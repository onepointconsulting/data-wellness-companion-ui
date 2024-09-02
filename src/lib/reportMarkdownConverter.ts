import { BoomiData } from "../model/message.ts";

function renderItems(items: string[] | undefined, header: string): string {
  if (!items || items.length === 0) {
    return "";
  }
  return `# ${header}
${items.map((r, i) => `${i + 1}. ${r}`).join("\n")}
`;
}

export default function reportMarkdownAdapter(
  data: BoomiData,
  recommendationsHeader: string,
  avoidanceHeader: string,
  outcomesHeader: string,
  confidenceDegreeHeader: string,
  confidenceDegreereasoningHeader: string,
): string {
  const {
    recommendations,
    avoidance,
    outcomes,
    confidence_level,
    rational,
    previous_step_confidence_level,
    previous_step_rational,
  } = data;
  const confidenceLevel = confidence_level ?? previous_step_confidence_level;
  const rationale = rational ?? previous_step_rational;
  return `${renderItems(recommendations, recommendationsHeader)}
${renderItems(avoidance, avoidanceHeader)}
${renderItems(outcomes, outcomesHeader)}
# ${confidenceDegreeHeader}
\`\`\`${confidenceLevel}\`\`\`
## ${confidenceDegreereasoningHeader}
${rationale}
`;
}
