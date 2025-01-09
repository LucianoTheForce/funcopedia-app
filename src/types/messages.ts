export interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  updated_at: string;
  sender: {
    username: string | null;
    avatar_url: string | null;
  } | null;
  receiver: {
    username: string | null;
    avatar_url: string | null;
  } | null;
}

export interface MessagesState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}