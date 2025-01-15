import { MessageType } from "../model.ts";

export default interface FormProperties {
  processing: boolean;
  message: string;
  messageType?: MessageType;
}
