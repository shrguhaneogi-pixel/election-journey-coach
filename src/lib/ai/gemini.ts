import { VertexAI, GenerativeModel } from '@google-cloud/vertexai';

let model: GenerativeModel | null = null;

export function getGeminiModel(): GenerativeModel | null {
  if (model) return model;

  const projectId = process.env.GCLOUD_PROJECT_ID;
  const location = process.env.GCLOUD_LOCATION || 'us-central1';

  // We check if projectId exists to avoid crashing local environments lacking a service account.
  if (!projectId || projectId === 'demo-project-id') {
    console.warn("Vertex AI not fully configured. Using fallback mode.");
    return null;
  }

  try {
    const vertexAI = new VertexAI({ project: projectId, location });
    model = vertexAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        maxOutputTokens: 150, // Keep explanations short
        temperature: 0.2,     // Highly deterministic
      },
    });
    return model;
  } catch (err) {
    console.error("Failed to initialize Vertex AI", err);
    return null;
  }
}
