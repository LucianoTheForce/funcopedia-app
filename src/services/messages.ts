import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/messages";

export const fetchUserMessages = async (currentUserId: string, userId: string): Promise<Message[]> => {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:profiles!messages_sender_profile_fkey(username, avatar_url),
      receiver:profiles!messages_receiver_profile_fkey(username, avatar_url)
    `)
    .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order('created_at', { ascending: true });

  if (error) {
    throw error;
  }

  return data || [];
};

export const sendUserMessage = async (senderId: string, receiverId: string, content: string) => {
  const { error } = await supabase
    .from('messages')
    .insert([
      {
        sender_id: senderId,
        receiver_id: receiverId,
        content,
      },
    ]);

  if (error) {
    throw error;
  }
};