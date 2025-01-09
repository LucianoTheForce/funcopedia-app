import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
}

export const useMessages = (userId: string | undefined) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchMessages = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const currentUserId = sessionData.session?.user.id;
      
      if (!currentUserId || !userId) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Authentication required",
        });
        return;
      }

      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load messages",
        });
        return;
      }

      setMessages(data || []);
    } catch (error) {
      console.error("Error in fetchMessages:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      });
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || !userId) return;

    setIsLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const currentUserId = sessionData.session?.user.id;
      
      if (!currentUserId) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "You must be logged in to send messages",
        });
        return;
      }

      const { error } = await supabase.from("messages").insert({
        content: content.trim(),
        sender_id: currentUserId,
        receiver_id: userId,
      });

      if (error) {
        console.error("Error sending message:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to send message",
        });
      }
    } catch (error) {
      console.error("Error in sendMessage:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchMessages();
    }
  }, [userId]);

  // Subscribe to new messages
  useEffect(() => {
    const setupSubscription = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const currentUserId = sessionData.session?.user.id;
      
      if (!currentUserId || !userId) return;

      const channel = supabase
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
            setMessages((current) => [...current, payload.new as Message]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    setupSubscription();
  }, [userId]);

  return { messages, isLoading, sendMessage };
};