import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Message, MessagesState } from "@/types/messages";
import { 
  fetchUserMessages, 
  sendUserMessage, 
  setupMessageSubscription 
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

    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const currentUserId = sessionData.session?.user.id;
      
      if (!currentUserId) {
        throw new Error("You must be logged in to send messages");
      }

      await sendUserMessage(currentUserId, userId, content);
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
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
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

      const channel = setupMessageSubscription(
        currentUserId, 
        userId, 
        (newMessage) => {
          setState((prev) => ({
            ...prev,
            messages: [...prev.messages, newMessage],
          }));
        }
      );

      return () => {
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