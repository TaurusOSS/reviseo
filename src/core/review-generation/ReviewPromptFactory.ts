import type { ReviewConfiguration } from './ReviewConfiguration';
import type { Prompt } from './review';

export interface ReviewPromptFactory {
    create(config: ReviewConfiguration): Prompt;
}
