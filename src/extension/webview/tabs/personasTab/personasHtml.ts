export function getPersonasHtml(): string {
    return /* html */`
    <div id="persona-form" class="persona-form hidden">
      <h3 id="form-title">Add Persona</h3>
      <input type="hidden" id="persona-id">
      <div class="field">
        <label for="f-name">Name *</label>
        <input type="text" id="f-name" placeholder="e.g. Security Auditor">
      </div>
      <div class="field">
        <label for="f-instructions">Custom Instructions</label>
        <textarea id="f-instructions" rows="3"
          placeholder="Describe how this persona should approach the review..."></textarea>
      </div>
      <div class="field">
        <label>Checklist Items</label>
        <div id="checklist-editor"></div>
        <button type="button" class="btn btn-secondary btn-sm" id="btn-add-item">+ Add item</button>
      </div>
      <div class="form-actions">
        <button class="btn btn-secondary" id="btn-cancel-form">Cancel</button>
        <button class="btn btn-primary" id="btn-save-persona">Save</button>
      </div>
    </div>

    <div class="persona-list" id="persona-list">
      <!-- rendered by JS -->
    </div>

    <!-- Generate Persona Wizard -->
    <div id="persona-wizard" class="persona-form hidden">
      <!-- Step 1: name -->
      <div id="wizard-step-1">
        <h3>Generate Persona — Step 1 of 4</h3>
        <p class="wizard-step-desc">Enter a name for the persona you want to generate.</p>
        <div class="field">
          <label for="wizard-name">Persona Name *</label>
          <input type="text" id="wizard-name" placeholder="e.g. Security Auditor">
        </div>
        <div class="field">
          <label for="wizard-description">Short Description (optional)</label>
          <textarea id="wizard-description" rows="3" placeholder="e.g. Focuses on OWASP top 10, secrets exposure, and auth flows."></textarea>
        </div>
        <div class="form-actions">
          <button class="btn btn-secondary" id="wizard-cancel">Cancel</button>
          <button class="btn btn-primary" id="wizard-step1-next">Next</button>
        </div>
      </div>
      <!-- Step 2: copy prompt -->
      <div id="wizard-step-2" class="hidden">
        <h3>Generate Persona — Step 2 of 4</h3>
        <p class="wizard-step-desc">Copy the prompt below and paste it into your preferred AI assistant (e.g. ChatGPT, Claude, Perplexity). Then click Next.</p>
        <div class="field">
          <label>Prompt for AI</label>
          <textarea id="wizard-prompt" readonly rows="10"></textarea>
        </div>
        <div class="form-actions">
          <button class="btn btn-secondary" id="wizard-copy-prompt">Copy Prompt</button>
          <button class="btn btn-primary" id="wizard-step2-next">Next</button>
        </div>
      </div>
      <!-- Step 3: paste response -->
      <div id="wizard-step-3" class="hidden">
        <h3>Generate Persona — Step 3 of 4</h3>
        <p class="wizard-step-desc">Paste the AI's JSON response below, then click Next to preview the generated persona.</p>
        <div class="field">
          <label for="wizard-response">AI Response (JSON)</label>
          <textarea id="wizard-response" rows="12" placeholder='{ "name": "...", "customInstructions": "...", "checklist": [...] }'></textarea>
        </div>
        <div class="form-actions">
          <button class="btn btn-secondary" id="wizard-step3-back">← Back</button>
          <button class="btn btn-primary" id="wizard-step3-next">Next</button>
        </div>
      </div>
      <!-- Step 4: preview and confirm -->
      <div id="wizard-step-4" class="hidden">
        <h3>Generate Persona — Step 4 of 4</h3>
        <p class="wizard-step-desc">Review the generated persona. Click Confirm to save it or Decline to cancel.</p>
        <div id="wizard-preview"></div>
        <div class="form-actions">
          <button class="btn btn-secondary" id="wizard-decline">Decline</button>
          <button class="btn btn-primary" id="wizard-confirm">Confirm</button>
        </div>
      </div>
    </div>

    <div class="persona-tab-actions">
      <button class="btn btn-primary" id="btn-add-persona">+ Add Persona</button>
      <button class="btn btn-secondary" id="btn-generate-persona">Generate Persona</button>
    </div>`;
}
