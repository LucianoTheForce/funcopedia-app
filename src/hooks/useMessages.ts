import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Message, MessagesState } from "@/types/messages";
import { 
  fetchUserMessages, 
  sendUserMessage
} from "@/services/messages";

export const useMessages = (userId: string | undefined) => {
  const [state, setState] = useState<MessagesState>({
    messages: [],
    isLoading: false,
    error: null,
  });
  const { toast } = useToast();

  const fetchMessages = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const currentUserId = sessionData.session?.user.id;
      
      if (!currentUserId || !userId) {
        throw new Error("Authentication required");
      }

      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const messages = await fetchUserMessages(currentUserId, userId);
      
      setState((prev) => ({
        ...prev,
        messages,
        isLoading: false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load messages";
      setState((prev) => ({
        ...prev,
        error: message,
        isLoading: false,
      }));
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || !userId) return;

    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      
      const { data: sessionData } = await supabase.auth.getSession();
      const currentUserId = sessionData.session?.user.id;
      
      if (!currentUserId) {
        throw new Error("You must be logged in to send messages");
      }

      await sendUserMessage(currentUserId, userId, content);
      
      // Add optimistic update
      const newMessage: Message = {
        id: crypto.randomUUID(),
        content: content.trim(),
        sender_id: currentUserId,
        receiver_id: userId,
        created_at: new Date().toISOString(),
      };

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, newMessage],
        isLoading: false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to send message";
      setState((prev) => ({
        ...prev,
        error: message,
        isLoading: false,
      }));
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
    }
  };

  useEffect(() => {
    if (userId) {
      fetchMessages();
    }
  }, [userId]);

  useEffect(() => {
    const setupSubscription = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const currentUserId = sessionData.session?.user.id;
      
      if (!currentUserId || !userId) return;

      console.log('Setting up subscription for:', { currentUserId, userId });

      const channel = supabase
        .channel('messages')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'messages',
            filter: `sender_id=eq.${userId},receiver_id=eq.${currentUserId}`,
          },
          (payload) => {
            console.log('Received message payload:', payload);
            if (payload.eventType === 'INSERT') {
              const newMessage = payload.new as Message;
              setState((prev) => ({
                ...prev,
                messages: [...prev.messages, newMessage],
              }));
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'messages',
            filter: `sender_id=eq.${currentUserId},receiver_id=eq.${userId}`,
          },
          (payload) => {
            console.log('Sent message payload:', payload);
            if (payload.eventType === 'INSERT') {
              const newMessage = payload.new as Message;
              setState((prev) => ({
                ...prev,
                messages: prev.messages.map(msg => 
                  msg.id === newMessage.id ? newMessage : msg
                ),
              }));
            }
          }
        )
        .subscribe();

      return () => {
        console.log('Cleaning up subscription');
        supabase.removeChannel(channel);
      };
    };

    setupSubscription();
  }, [userId]);

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    sendMessage,
  };
};