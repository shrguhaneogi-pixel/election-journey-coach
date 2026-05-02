import { VertexAI, GenerativeModel } from '@google-cloud/vertexai';

// Named constants — avoids hardcoded magic values inline
const DEFAULT_AI_MODEL = 'gemini-1.5-flash';
const AI_MAX_OUTPUT_TOKENS = 150; // Keep explanations short and focused
const AI_TEMPERATURE = 0.2;       // Low temperature = highly deterministic output

let model: GenerativeModel | null = null;

export function getGeminiModel(): GenerativeModel | null {
  if (model) return model;

  const projectId = process.env.GCLOUD_PROJECT_ID;
  const location = process.env.GCLOUD_LOCATION || 'us-central1';
  const modelName = process.env.GCLOUD_AI_MODEL || DEFAULT_AI_MODEL;

  // We check if projectId exists to avoid crashing local environments lacking a service account.
  if (!projectId || projectId === 'demo-project-id') {
    console.warn("Vertex AI not fully configured. Using fallback mode.");
    return null;
  }

  try {
    const vertexAI = new VertexAI({ project: projectId, location });
    model = vertexAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        maxOutputTokens: AI_MAX_OUTPUT_TOKENS,
        temperature: AI_TEMPERATURE,
      },
    });
    return model;
  } catch (err) {
    console.error("Failed to initialize Vertex AI", err);
    return null;
  }
}
