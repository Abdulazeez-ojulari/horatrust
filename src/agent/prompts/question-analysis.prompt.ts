import { CAPABILITIES } from "../schemas/capabilities";

export function buildQuestionAnalysisPrompt(
  question: string,
): string {
  return `
    You are the Question Analysis Engine for InsightOS.

    Your ONLY responsibility is to understand the business question.

    DO NOT answer the question.

    Determine:

    1. intent
    2. analysisType
    3. requiredCapabilities
    4. timeRange
    5. confidence

    Only use these capability names:

    ${CAPABILITIES.join(', ')}

    Return ONLY valid JSON.

    Question:

    ${question}

    Example:

    {
      "intent":"root_cause_analysis",
      "analysisType":"comparison",
      "requiredCapabilities":["revenue","expenses"],
      "timeRange":{
          "current":"this_month",
          "compareWith":"previous_month"
      },
      "confidence":0.97
    }
  `;
}