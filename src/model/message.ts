import { Confidence } from "./confidence.ts";

export type Suggestion = {
  id: number;
  img_alt: string;
  img_src: string;
  main_text: string;
  title: string;
  svg_image: string | undefined;
};

export type Message = {
  question: string;
  answer: string;
  final_report: boolean;
  suggestions: Suggestion[];
  clarification: string | undefined;
  confidence?: Confidence;
};

export type RegenerateMessage = {
  session_id: string;
  new_question: string,
  suggestions: string[]
}
