import type { WebviewTab } from '../WebviewTab';

export class PersonasTab implements WebviewTab {
    readonly id = 'personas';
    readonly label = 'Personas';

    html(): string {
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

    script(): string {
        return /* js */`
    // ── Personas updated event ─────────────────────────────────────
    document.addEventListener('personas-updated', renderPersonaList);

    // ── Rendering ──────────────────────────────────────────────────
    function renderPersonaList() {
      const list = document.getElementById('persona-list');
      if (allPersonas.length === 0) {
        list.innerHTML = '<div class="empty-state">No personas yet. Click "+ Add Persona" to get started.</div>';
        return;
      }
      list.innerHTML = allPersonas.map(p => {
        const itemCount = p.checklist.length;
        const meta = itemCount === 1 ? '1 checklist item' : itemCount + ' checklist items';
        return \`
          <div class="persona-card">
            <div class="persona-card-body">
              <div class="persona-name">\${esc(p.name)}</div>
              <div class="persona-meta">\${meta}</div>
            </div>
            <div class="persona-actions">
              <button class="btn btn-secondary btn-sm" data-action="edit" data-id="\${esc(p.id)}">Edit</button>
              <button class="btn btn-danger btn-sm" data-action="delete" data-id="\${esc(p.id)}">Delete</button>
            </div>
          </div>
        \`;
      }).join('');
    }

    // ── Event delegation for persona card actions ──────────────────
    document.getElementById('persona-list').addEventListener('click', e => {
      const btn = e.target.closest('[data-action]');
      if (!btn) { return; }
      const { action, id } = btn.dataset;
      if (action === 'edit') { openEditForm(id); }
      if (action === 'delete') { confirmDelete(id); }
    });

    function openEditForm(id) {
      const p = allPersonas.find(x => x.id === id);
      if (!p) { return; }
      document.getElementById('form-title').textContent = 'Edit Persona';
      document.getElementById('persona-id').value = p.id;
      document.getElementById('f-name').value = p.name;
      document.getElementById('f-instructions').value = p.customInstructions;
      populateChecklistEditor(p.checklist);
      document.getElementById('persona-form').classList.remove('hidden');
      document.getElementById('persona-form').scrollIntoView({ behavior: 'smooth' });
    }

    function confirmDelete(id) {
      vscode.postMessage({ type: 'deletePersona', id });
    }

    // ── Checklist editor ───────────────────────────────────────────
    function populateChecklistEditor(items) {
      document.getElementById('checklist-editor').innerHTML = '';
      items.forEach(item => addChecklistRow(item));
    }

    function addChecklistRow(value) {
      const editor = document.getElementById('checklist-editor');
      const row = document.createElement('div');
      row.className = 'checklist-item-row';
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'checklist-item-input';
      input.value = value || '';
      input.placeholder = 'Checklist item';
      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'btn-remove-item';
      removeBtn.setAttribute('aria-label', 'Remove item');
      removeBtn.textContent = '✕';
      removeBtn.addEventListener('click', () => row.remove());
      row.appendChild(input);
      row.appendChild(removeBtn);
      editor.appendChild(row);
    }

    function readChecklistItems() {
      return Array.from(document.querySelectorAll('.checklist-item-input'))
        .map(el => el.value.trim())
        .filter(Boolean);
    }

    document.getElementById('btn-add-item').addEventListener('click', () => {
      addChecklistRow('');
      const inputs = document.querySelectorAll('.checklist-item-input');
      inputs[inputs.length - 1].focus();
    });

    // ── Persona form ───────────────────────────────────────────────
    document.getElementById('btn-add-persona').addEventListener('click', () => {
      clearForm();
      document.getElementById('form-title').textContent = 'Add Persona';
      document.getElementById('persona-form').classList.remove('hidden');
    });

    document.getElementById('btn-cancel-form').addEventListener('click', () => {
      document.getElementById('persona-form').classList.add('hidden');
      clearForm();
    });

    document.getElementById('btn-save-persona').addEventListener('click', () => {
      const name = document.getElementById('f-name').value.trim();
      if (!name) {
        alert('Name is required.');
        return;
      }
      const idField = document.getElementById('persona-id').value;
      const persona = {
        id: idField || generateId(),
        name,
        customInstructions: document.getElementById('f-instructions').value.trim(),
        checklist: readChecklistItems(),
      };
      vscode.postMessage({ type: 'savePersona', persona });
      document.getElementById('persona-form').classList.add('hidden');
      clearForm();
    });

    function clearForm() {
      document.getElementById('persona-id').value = '';
      document.getElementById('f-name').value = '';
      document.getElementById('f-instructions').value = '';
      document.getElementById('checklist-editor').innerHTML = '';
    }

    // ── Generate Persona wizard ────────────────────────────────────
    let wizardPersonaName = '';
    let wizardParsedPersona = null;

    document.addEventListener('generation-prompt-built', (e) => {
      document.getElementById('wizard-prompt').value = e.detail.prompt;
      showWizardStep(2);
    });

    function showWizardStep(step) {
      [1, 2, 3, 4].forEach(n => {
        document.getElementById('wizard-step-' + n).classList.toggle('hidden', n !== step);
      });
    }

    function openWizard() {
      wizardPersonaName = '';
      wizardParsedPersona = null;
      document.getElementById('wizard-name').value = '';
      document.getElementById('wizard-response').value = '';
      document.getElementById('wizard-preview').innerHTML = '';
      document.getElementById('persona-form').classList.add('hidden');
      document.getElementById('persona-wizard').classList.remove('hidden');
      showWizardStep(1);
      document.getElementById('persona-wizard').scrollIntoView({ behavior: 'smooth' });
    }

    function closeWizard() {
      document.getElementById('persona-wizard').classList.add('hidden');
    }

    document.getElementById('btn-generate-persona').addEventListener('click', openWizard);
    document.getElementById('wizard-cancel').addEventListener('click', closeWizard);
    document.getElementById('wizard-decline').addEventListener('click', closeWizard);

    document.getElementById('wizard-step1-next').addEventListener('click', () => {
      const name = document.getElementById('wizard-name').value.trim();
      if (!name) { alert('Please enter a persona name.'); return; }
      wizardPersonaName = name;
      vscode.postMessage({ type: 'buildGenerationPrompt', name });
    });

    document.getElementById('wizard-copy-prompt').addEventListener('click', () => {
      vscode.postMessage({ type: 'copyToClipboard', text: document.getElementById('wizard-prompt').value });
    });

    document.getElementById('wizard-step2-next').addEventListener('click', () => { showWizardStep(3); });
    document.getElementById('wizard-step3-back').addEventListener('click', () => { showWizardStep(2); });

    document.getElementById('wizard-step3-next').addEventListener('click', () => {
      const raw = document.getElementById('wizard-response').value.trim();
      if (!raw) { alert('Please paste the AI response before continuing.'); return; }
      let parsed;
      try { parsed = JSON.parse(raw); } catch (_) {
        alert('Invalid JSON. Please check the AI response and paste only the JSON object.');
        return;
      }
      if (typeof parsed.name !== 'string' || typeof parsed.customInstructions !== 'string' || !Array.isArray(parsed.checklist)) {
        alert('The JSON is missing required fields (name, customInstructions, checklist). Please check the response and try again.');
        return;
      }
      wizardParsedPersona = parsed;
      const checklistHtml = parsed.checklist
        .filter(item => typeof item === 'string' && item.trim())
        .map(item => \`<li>\${esc(item)}</li>\`).join('');
      document.getElementById('wizard-preview').innerHTML = \`
        <div class="persona-preview-field">
          <label>Name</label>
          <p>\${esc(parsed.name)}</p>
        </div>
        <div class="persona-preview-field">
          <label>Custom Instructions</label>
          <p>\${esc(parsed.customInstructions)}</p>
        </div>
        <div class="persona-preview-field">
          <label>Checklist</label>
          <ul class="persona-preview-checklist">\${checklistHtml}</ul>
        </div>
      \`;
      showWizardStep(4);
    });

    document.getElementById('wizard-confirm').addEventListener('click', () => {
      if (!wizardParsedPersona) { return; }
      const persona = {
        id: generateId(),
        name: wizardParsedPersona.name || wizardPersonaName,
        customInstructions: wizardParsedPersona.customInstructions || '',
        checklist: Array.isArray(wizardParsedPersona.checklist)
          ? wizardParsedPersona.checklist.filter(item => typeof item === 'string' && item.trim())
          : [],
      };
      vscode.postMessage({ type: 'savePersona', persona });
      closeWizard();
    });
    `.trim();
    }
}
