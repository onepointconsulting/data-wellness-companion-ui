import {BoomiData} from "../model/message.ts";

function renderItems(items: string[] | undefined, header: string): string {
  if (!items || items.length === 0) {
    return ''
  }
  return `# ${header}
${items.map((r, i) => `${i + 1}. ${r}`).join('\n')}
`
}

export default function reportMarkdownAdapter(
  data: BoomiData,
  recommendationsHeader: string,
  avoidanceHeader: string,
  outcomesHeader: string,
  confidenceDegreeHeader: string,
  confidenceDegreereasoningHeader: string): string {
  const {recommendations, avoidance, outcomes, confidence_level, rational} = data
  return `${renderItems(recommendations, recommendationsHeader)}
${renderItems(avoidance, avoidanceHeader)}
${renderItems(outcomes, outcomesHeader)}
# ${confidenceDegreeHeader}
\`\`\`${confidence_level}\`\`\`
## ${confidenceDegreereasoningHeader}
${rational}
`
}