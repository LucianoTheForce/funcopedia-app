import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { RealtimeChannel } from "@supabase/supabase-js";

export interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
}

interface MessagesState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const validateUUIDs = (currentUserId: string, userId: string): boolean => {
  return UUID_REGEX.test(currentUserId) && UUID_REGEX.test(userId);
};

const buildMessagesQuery = (currentUserId: string, userId: string) => {
  return supabase
    .from("messages")
    .select("*")
    .or(
      `and(sender_id.eq.${currentUserId},receiver_id.eq.${userId}),` +
      `and(sender_id.eq.${userId},receiver_id.eq.${currentUserId})`
    )
    .order("created_at", { ascending: true });
};

const setupMessageSubscription = (
  currentUserId: string,
  userId: string,
  onNewMessage: (message: Message) => void
): RealtimeChannel => {
  return supabase
    .channel("messages")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `sender_id=eq.${userId},receiver_id=eq.${currentUserId}`,
      },
      (payload) => {
        onNewMessage(payload.new as Message);
      }
    )
    .subscribe();
};

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

      if (!validateUUIDs(currentUserId, userId)) {
        throw new Error("Invalid user ID format");
      }

      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const { data, error } = await buildMessagesQuery(currentUserId, userId);

      if (error) throw error;

      setState((prev) => ({
        ...prev,
        messages: data || [],
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

      if (!validateUUIDs(currentUserId, userId)) {
        throw new Error("Invalid user ID format");
      }

      const { error } = await supabase.from("messages").insert({
        content: content.trim(),
        sender_id: currentUserId,
        receiver_id: userId,
      });

      if (error) throw error;
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
      if (!validateUUIDs(currentUserId, userId)) return;

      const channel = setupMessageSubscription(currentUserId, userId, (newMessage) => {
        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, newMessage],
        }));
      });

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