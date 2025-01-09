import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/messages";
import { validateUUIDs } from "@/utils/validation";

export const fetchUserMessages = async (currentUserId: string, userId: string) => {
  if (!validateUUIDs(currentUserId, userId)) {
    throw new Error("Invalid user ID format");
  }

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .or(
      `and(sender_id.eq.${currentUserId},receiver_id.eq.${userId}),` +
      `and(sender_id.eq.${userId},receiver_id.eq.${currentUserId})`
    )
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data as Message[];
};

export const sendUserMessage = async (
  currentUserId: string, 
  userId: string, 
  content: string
) => {
  if (!validateUUIDs(currentUserId, userId)) {
    throw new Error("Invalid user ID format");
  }

  const { error } = await supabase
    .from("messages")
    .insert({
      content: content.trim(),
      sender_id: currentUserId,
      receiver_id: userId,
    });

  if (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export const setupMessageSubscription = (
  currentUserId: string,
  userId: string,
  onNewMessage: (message: Message) => void
) => {
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