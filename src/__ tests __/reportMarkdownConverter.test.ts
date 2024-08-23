import reportMarkdownAdapter from "../lib/reportMarkdownConverter.ts";
import { CONFIDENCE_ENUM } from "../lib/confidenceConstants.ts";

test("reportMarkdownAdapter", () => {
  const finalReport = {
    recommendations: [
      "Establish a **centralised data governance framework** that includes a standardised set of data definitions applicable across all departments. This will help eliminate inconsistencies and improve data quality.",
      "Implement a **data stewardship programme** where designated individuals in each department are responsible for maintaining and adhering to the agreed-upon data definitions. This promotes accountability and consistency.",
      "Conduct regular **data quality assessments** to identify and rectify issues stemming from inconsistent definitions. This proactive approach will enhance the reliability of your data.",
      "Encourage **cross-departmental collaboration** to foster a culture of shared understanding regarding data definitions. This can be achieved through workshops or joint projects that highlight the importance of consistent data usage.",
      "Utilise **data integration tools** that facilitate the merging of data from different silos while maintaining the integrity of the definitions. This will help in creating a unified view of the data.",
    ],
    avoidance: [
      "Avoid allowing each department to continue managing its own data definitions without oversight, as this perpetuates inconsistencies and quality issues.",
      "Do not ignore the importance of **training and education** for staff on the new data governance policies, as lack of understanding can lead to non-compliance.",
      "Refrain from implementing changes without first assessing the current state of your data quality and governance, as this could lead to further complications.",
    ],
    outcomes: [
      "Improved **data quality** across the organisation, leading to more reliable reports and analyses.",
      "Enhanced **decision-making capabilities** due to access to consistent and trustworthy data.",
      "Increased **collaboration** between departments, fostering a culture of shared responsibility for data integrity.",
    ],
  };
  const boomidata = {
    session: "",
    step: 7,
    suggestions: [],
    recommendations: finalReport.recommendations,
    avoidance: finalReport.avoidance,
    outcomes: finalReport.outcomes,
    confidence_level: CONFIDENCE_ENUM.HIGH,
    previous_step_confidence_level: CONFIDENCE_ENUM.MEDIUM,
    rational:
      "The recommendations provided are based on industry best practices and have been successfully implemented in similar organisations.",
  };
  const markdown = reportMarkdownAdapter(
    boomidata,
    "Recommendations",
    "Avoidance",
    "Outcomes",
    "Confidence Level",
    "D-Well confidence degree reasoning",
  );
  expect(markdown).toBe(`# Recommendations
1. Establish a **centralised data governance framework** that includes a standardised set of data definitions applicable across all departments. This will help eliminate inconsistencies and improve data quality.
2. Implement a **data stewardship programme** where designated individuals in each department are responsible for maintaining and adhering to the agreed-upon data definitions. This promotes accountability and consistency.
3. Conduct regular **data quality assessments** to identify and rectify issues stemming from inconsistent definitions. This proactive approach will enhance the reliability of your data.
4. Encourage **cross-departmental collaboration** to foster a culture of shared understanding regarding data definitions. This can be achieved through workshops or joint projects that highlight the importance of consistent data usage.
5. Utilise **data integration tools** that facilitate the merging of data from different silos while maintaining the integrity of the definitions. This will help in creating a unified view of the data.

# Avoidance
1. Avoid allowing each department to continue managing its own data definitions without oversight, as this perpetuates inconsistencies and quality issues.
2. Do not ignore the importance of **training and education** for staff on the new data governance policies, as lack of understanding can lead to non-compliance.
3. Refrain from implementing changes without first assessing the current state of your data quality and governance, as this could lead to further complications.

# Outcomes
1. Improved **data quality** across the organisation, leading to more reliable reports and analyses.
2. Enhanced **decision-making capabilities** due to access to consistent and trustworthy data.
3. Increased **collaboration** between departments, fostering a culture of shared responsibility for data integrity.

# Confidence Level
\`\`\`high\`\`\`
## D-Well confidence degree reasoning
The recommendations provided are based on industry best practices and have been successfully implemented in similar organisations.
`);
});
