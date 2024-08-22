export type ServerSuggestion = {
  title: string;
  suggestion: string;
  image: string;
}

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
};

export type BoomiSuggestion = {
  title: string;
  suggestion: string;
  image: string;
}

export type BoomiData = {
  session: string,
  step: number,
  question?: string,
  suggestions: BoomiSuggestion[]
  outcomes?: string[],
}

export type BoomiMessage = {
  data?: BoomiData,
  message?: string,
  code: number,
}
