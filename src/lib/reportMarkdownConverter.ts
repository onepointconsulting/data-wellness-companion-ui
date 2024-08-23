
function renderItems(items: string[], header: string): string {
  return `# ${header}
${items.map((r, i) => `${i + 1}. ${r}`).join('\n')}
`
}

export default function reportMarkdownAdapter(
  recommendations: string[],
  avoidance: string[],
  outcomes: string[],
  recommendationsHeader: string,
  avoidanceHeader: string,
  outcomesHeader: string): string {
  return `${renderItems(recommendations, recommendationsHeader)}
${renderItems(avoidance, avoidanceHeader)}
${renderItems(outcomes, outcomesHeader)}`
}