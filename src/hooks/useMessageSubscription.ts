import { supabase } from "@/integrations/supabase/client";
import { Message, MessagesState } from "@/types/messages";
import { Dispatch, SetStateAction } from "react";

export const useMessageSubscription = (
  userId: string | undefined,
  currentUserId: string | undefined,
  setState: Dispatch<SetStateAction<MessagesState>>
) => {
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