import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/messages";

export const fetchUserMessages = async (currentUserId: string, userId: string): Promise<Message[]> => {
  if (!currentUserId || !userId) {
    console.log('Missing required IDs:', { currentUserId, userId });
    return [];
  }

  console.log('Fetching messages for:', { currentUserId, userId });

  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:profiles!messages_sender_profile_fkey(username, avatar_url),
      receiver:profiles!messages_receiver_profile_fkey(username, avatar_url)
    `)
    .or(
      `and(sender_id.eq.${currentUserId},receiver_id.eq.${userId}),` +
      `and(sender_id.eq.${userId},receiver_id.eq.${currentUserId})`
    )
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }

  console.log('Fetched messages:', data);
  return data || [];
};

export const sendUserMessage = async (senderId: string, receiverId: string, content: string) => {
  if (!senderId || !receiverId || !content.trim()) {
    console.error('Missing required parameters:', { senderId, receiverId, content });
    throw new Error("Missing required parameters");
  }

  console.log('Sending message:', { senderId, receiverId, content });

  const { error } = await supabase
    .from('messages')
    .insert([
      {
        sender_id: senderId,
        receiver_id: receiverId,
        content: content.trim(),
      },
    ]);

  if (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};