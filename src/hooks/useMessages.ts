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

        const fetchedMessages = await fetchUserMessages(user.id, receiverId);
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

    // Set up realtime subscription
    const subscription = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${receiverId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [receiverId, toast]);

  const sendMessage = async (content: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !receiverId) return;

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

      setMessages((prev) => [...prev, optimisticMessage]);

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