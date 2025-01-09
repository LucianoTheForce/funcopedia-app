import { useState, useEffect } from 'react';
import { fetchUserMessages, sendUserMessage } from '@/services/messages';
import { Message } from '@/types/messages';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export const useMessages = (receiverId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || !receiverId) return;

        console.log('Fetching messages for conversation between:', user.id, 'and', receiverId);
        const fetchedMessages = await fetchUserMessages(user.id, receiverId);
        console.log('Fetched messages:', fetchedMessages);
        setMessages(fetchedMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast({
          title: "Error",
          description: "Failed to load messages",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();

    // Set up realtime subscription for messages
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        async (payload) => {
          console.log('Received new message:', payload);
          const newMessage = payload.new as Message;
          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) return;
          
          // Only add message if it's part of this conversation
          const isPartOfConversation = 
            (newMessage.sender_id === user.id && newMessage.receiver_id === receiverId) ||
            (newMessage.sender_id === receiverId && newMessage.receiver_id === user.id);

          console.log('Is part of conversation:', isPartOfConversation, {
            currentUserId: user.id,
            receiverId,
            senderId: newMessage.sender_id,
            messageReceiverId: newMessage.receiver_id
          });

          if (isPartOfConversation) {
            setMessages(prev => [...prev, newMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up subscription');
      supabase.removeChannel(channel);
    };
  }, [receiverId, toast]);

  const sendMessage = async (content: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !receiverId) return;

      console.log('Sending message:', {
        senderId: user.id,
        receiverId,
        content
      });

      // Optimistic update
      const optimisticMessage: Message = {
        id: crypto.randomUUID(),
        content,
        sender_id: user.id,
        receiver_id: receiverId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        sender: null,
        receiver: null
      };

      setMessages(prev => [...prev, optimisticMessage]);

      await sendUserMessage(user.id, receiverId, content);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  return { messages, isLoading, sendMessage };
};