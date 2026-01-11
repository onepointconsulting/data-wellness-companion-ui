

type DeepResearchStatus = {
  status: string;
  advice: string;
  timestamp: string;
}

type Citation = {
  index: number;
  title: string;
  url: string;
  start_index: number;
  end_index: number;
  text: string;
}

type DeepResearchOutput = {
  advice: string;
  deep_research_output: string;
  citations: Citation[];
}

type DeepResearchOutputs = {
  outputs: DeepResearchOutput[];
}

type DeepResearchOutputMap = {
  [key: string]: DeepResearchOutput;
}

export type { DeepResearchStatus, Citation, DeepResearchOutput, DeepResearchOutputs, DeepResearchOutputMap };