export interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
}

export interface MessagesState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}