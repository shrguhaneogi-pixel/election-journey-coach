/**
 * Strictly validates the AI response.
 * Ensure it doesn't contain HTML, hallucinated commands, or excessive length.
 */
export function validateAIExplanation(rawText: string | null | undefined): string | null {
  if (!rawText) return null;

  const trimmed = rawText.trim();
  
  if (trimmed.length === 0) return null;
  if (trimmed.length > 500) return null; // Too long for a simple explanation

  // Disallow HTML tags to prevent injection or weird rendering
  const htmlRegex = /<\/?[a-z][\s\S]*>/i;
  if (htmlRegex.test(trimmed)) return null;

  // Disallow obvious command hallucinations (just a basic safety check)
  const commandRegex = /\{(action|type|state|dispatch):/i;
  if (commandRegex.test(trimmed)) return null;

  return trimmed;
}
