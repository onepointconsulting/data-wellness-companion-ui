import { MessageType } from "./model.ts";

export function messageTypeColor(messageType: MessageType | undefined) {
  return messageType === MessageType.FAILURE ? "bg-red-100" : "bg-green-100";
}

export default function AdminMessage({
  message,
  messageType,
}: {
  message: string;
  messageType?: MessageType;
}) {
  return (
    <div
      className={`${messageTypeColor(messageType)} border border-gray-400 text-gray-700 px-4 py-3 rounded relative mt-4`}
    >
      {message}
    </div>
  );
}
