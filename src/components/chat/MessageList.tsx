import { Message } from "@/types/messages";

interface MessageListProps {
  messages: Message[];
  userId: string;
}

export const MessageList = ({ messages, userId }: MessageListProps) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex flex-col gap-2 ${
            message.sender_id === userId ? "items-end" : "items-start"
          }`}
        >
          <div
            className={`p-3 rounded-lg max-w-[80%] ${
              message.sender_id === userId
                ? "bg-orange-500 text-white self-end"
                : "bg-gray-800 text-white self-start"
            }`}
          >
            {message.content}
          </div>
          <span className="text-xs text-gray-500">
            {new Date(message.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      ))}
    </div>
  );
};