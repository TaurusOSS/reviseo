import { apiClient } from './client';

export interface GenerateCodeReviewPromptRequest {
  pullRequestUrl: string;
  personasIdentifiers: string[];
}

export interface GenerateCodeReviewPromptResponse {
  prompt: string;
}

export const reviewApi = {
  generatePrompt: async (request: GenerateCodeReviewPromptRequest): Promise<string> => {
    const response = await apiClient.post<GenerateCodeReviewPromptResponse>('/api/reviews/prompt', request);
    return response.data.prompt;
  },
};
