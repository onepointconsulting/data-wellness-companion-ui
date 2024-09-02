import { CONFIDENCE_ENUM } from "../lib/confidenceConstants.ts";
import { Confidence } from "./confidence.ts";

export type ServerSuggestion = {
  title: string;
  suggestion: string;
  image: string;
};

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

export type BoomiSuggestion = {
  title: string;
  suggestion: string;
  image: string;
};

export type BoomiData = {
  session: string;
  step: number;
  question?: string;
  suggestions: BoomiSuggestion[];
  recommendations?: string[];
  avoidance?: string[];
  outcomes?: string[];
  confidence_level?: CONFIDENCE_ENUM;
  previous_step_confidence_level?: CONFIDENCE_ENUM;
  rational?: string;
  previous_step_rational?: string;
};

export type BoomiMessage = {
  data?: BoomiData;
  message?: string;
  code: number;
};
