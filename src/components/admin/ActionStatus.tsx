import { MessageType } from "./model";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function ActionStatus({
  message,
  messageType,
}: {
  message: string;
  messageType: MessageType;
}) {
  const isSuccess = messageType === MessageType.SUCCESS;
  const colorClass = isSuccess
    ? "text-green-600 dark:text-green-400"
    : "text-red-600 dark:text-red-400";
  const Icon = isSuccess ? CheckCircle : AlertCircle;

  return (
    <div className={`flex items-center ${colorClass} text-sm mt-2`}>
      <Icon className="w-4 h-4 mr-2 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
