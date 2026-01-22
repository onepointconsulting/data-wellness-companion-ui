import { Confidence } from "./confidence.ts";

export type Suggestion = {
  id: number;
  img_alt: string;
  img_src: string;
  main_text: string;
  title: string;
  svg_image: string | undefined;
};

export type RelevantDocument = {
  id: number;
  document_path: string;
  document_name: string;
  count: number;
  document_extract: string;
};

export type Message = {
  question: string;
  answer: string;
  final_report: boolean;
  suggestions: Suggestion[];
  clarification: string | undefined;
  confidence?: Confidence;
  question_id: string | undefined;
  documents: RelevantDocuments[];
};

export type RelevantDocuments = {
  questionnaire_status_id: number;
  relevant_documents: RelevantDocument[];
};

export type RegenerateMessage = {
  session_id: string;
  new_question: string;
  suggestions: string[];
};
