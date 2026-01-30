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
  question_id: string | undefined;
  relevant_documents: RelevantDocuments | null;
};

export type RelevantDocuments = {
  questionnaire_status_id: number;
  documents: RelevantDocument[];
};

export type RelevantDocument = {
  id: number;
  document_path: string;
  document_name: string;
  download_url: string;
  count: number;
  document_extracts: string[];
};

export type RegenerateMessage = {
  session_id: string;
  new_question: string;
  suggestions: string[];
};
