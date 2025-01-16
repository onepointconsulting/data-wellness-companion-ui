import { TFunction } from "i18next";
import { Confidence } from "../model/confidence.ts";
import { Message } from "../model/message.ts";

export function confidenceAdapter(
  t: TFunction<"translation", undefined>,
  confidence: Confidence | null,
) {
  return confidence?.rating ? t(`confidence_${confidence?.rating}`) : "???";
}

export function messagesOverLowerLimit(
  messages: Message[],
  messageLowerLimit: number,
) {
  console.info(
    "messages.length, messageLowerLimit",
    messages.length,
    messageLowerLimit,
  );
  return messages.length >= messageLowerLimit - 1;
}
