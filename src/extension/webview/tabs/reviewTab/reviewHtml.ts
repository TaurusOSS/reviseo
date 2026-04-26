export function getReviewHtml(): string {
    return /* html */`
    <div class="field">
      <label for="pr-url">Pull Request URL *</label>
      <input type="url" id="pr-url" placeholder="https://github.com/org/repo/pull/123">
    </div>

    <hr class="divider">

    <div class="section-label">Select Personas for Review</div>
    <div class="checklist-header hidden" id="checklist-header">
      <label class="persona-check-item select-all-item">
        <input type="checkbox" id="chk-select-all">
        <span>Select all</span>
      </label>
      <hr class="checklist-divider">
    </div>
    <div class="persona-checklist" id="persona-checklist">
      <!-- rendered by JS -->
    </div>

    <details class="settings-toggle">
      <summary class="btn btn-secondary btn-sm">Additional settings</summary>
      <div class="additional-settings">
        <label class="persona-check-item">
          <input type="checkbox" id="chk-multi-agent">
          <span>Run each persona as subagent</span>
        </label>
        <p class="settings-tip">Best results, but takes longer and uses more tokens.</p>
      </div>
    </details>

    <button class="btn btn-primary" id="btn-generate">Generate Prompt</button>

    <div class="prompt-output hidden" id="prompt-output">
      <hr class="divider">
      <div class="section-label">Generated Prompt</div>
      <textarea id="prompt-text" readonly></textarea>
      <div class="copy-bar">
        <span class="copy-success" id="copy-success">Copied!</span>
        <button class="btn btn-secondary" id="btn-copy">Copy to Clipboard</button>
      </div>
    </div>`;
}
