import type { WebviewTab } from '../../WebviewTab';
import { getReviewHtml } from './reviewHtml';
import { getReviewScript } from './reviewScript';

export class ReviewTab implements WebviewTab {
    readonly id = 'review';
    readonly label = 'Generate Review';

    html(): string { return getReviewHtml(); }
    script(): string { return getReviewScript(); }
}
