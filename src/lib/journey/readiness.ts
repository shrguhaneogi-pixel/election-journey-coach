import { ContextState } from '@/types/journey';

export function calculateReadiness(
  context: ContextState,
  totalChecklistItems: number,
  expectedAnswers: Record<string, number>
): number {
  let score = 0;

  // Calculate checklist score (1 point per item)
  const checkedItems = Object.values(context.checklistState).filter(Boolean).length;
  score += checkedItems;

  // Calculate rehearsal score (1 point per correct answer)
  const totalQuestions = Object.keys(expectedAnswers).length;
  for (const [qId, correctAnswer] of Object.entries(expectedAnswers)) {
    if (context.rehearsalAnswers[qId] === correctAnswer) {
      score += 1;
    }
  }

  const maxPossibleScore = totalChecklistItems + totalQuestions;
  return maxPossibleScore > 0 ? (score / maxPossibleScore) * 100 : 0;
}
