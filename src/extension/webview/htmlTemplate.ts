export function getWebviewHtml(nonce: string, cspSource: string): string {
    return /* html */`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy"
    content="default-src 'none'; style-src ${cspSource} 'nonce-${nonce}'; script-src 'nonce-${nonce}';">
  <title>Reviseo</title>
  <style nonce="${nonce}">
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: var(--vscode-font-family);
      font-size: var(--vscode-font-size);
      color: var(--vscode-foreground);
      background: var(--vscode-editor-background);
      padding: 16px;
    }

    h1 {
      font-size: 1.3em;
      font-weight: 600;
      margin-bottom: 16px;
      color: var(--vscode-foreground);
    }

    /* Tabs */
    .tabs {
      display: flex;
      border-bottom: 1px solid var(--vscode-panel-border);
      margin-bottom: 20px;
    }
    .tab-btn {
      padding: 8px 20px;
      background: none;
      border: none;
      border-bottom: 2px solid transparent;
      color: var(--vscode-foreground);
      cursor: pointer;
      font-size: var(--vscode-font-size);
      font-family: var(--vscode-font-family);
      opacity: 0.7;
      margin-bottom: -1px;
    }
    .tab-btn.active {
      border-bottom-color: var(--vscode-button-background);
      opacity: 1;
      font-weight: 600;
    }
    .tab-panel { display: none; }
    .tab-panel.active { display: block; }

    /* Buttons */
    .btn {
      padding: 6px 14px;
      border: none;
      border-radius: 2px;
      cursor: pointer;
      font-size: var(--vscode-font-size);
      font-family: var(--vscode-font-family);
    }
    .btn-primary {
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
    }
    .btn-primary:hover { background: var(--vscode-button-hoverBackground); }
    .btn-secondary {
      background: var(--vscode-button-secondaryBackground);
      color: var(--vscode-button-secondaryForeground);
    }
    .btn-secondary:hover { background: var(--vscode-button-secondaryHoverBackground); }
    .btn-danger {
      background: var(--vscode-inputValidation-errorBackground);
      color: var(--vscode-button-foreground);
      border: 1px solid var(--vscode-inputValidation-errorBorder);
    }
    .btn-sm { padding: 3px 10px; font-size: 0.85em; }
    .btn-remove-item {
      flex-shrink: 0;
      padding: 4px 8px;
      font-size: 0.85em;
      background: var(--vscode-button-secondaryBackground);
      color: var(--vscode-button-secondaryForeground);
      border: none;
      border-radius: 2px;
      cursor: pointer;
      line-height: 1;
    }
    .btn-remove-item:hover {
      background: var(--vscode-inputValidation-errorBackground);
      color: var(--vscode-button-foreground);
    }

    /* Form elements */
    input[type="text"], input[type="url"], textarea {
      width: 100%;
      padding: 6px 8px;
      background: var(--vscode-input-background);
      color: var(--vscode-input-foreground);
      border: 1px solid var(--vscode-input-border, var(--vscode-panel-border));
      border-radius: 2px;
      font-size: var(--vscode-font-size);
      font-family: var(--vscode-font-family);
    }
    input:focus, textarea:focus {
      outline: 1px solid var(--vscode-focusBorder);
      border-color: var(--vscode-focusBorder);
    }
    label {
      display: block;
      margin-bottom: 4px;
      font-weight: 500;
      font-size: 0.9em;
    }
    .field { margin-bottom: 12px; }

    /* Checklist editor */
    .checklist-item-row {
      display: flex;
      gap: 6px;
      margin-bottom: 6px;
      align-items: center;
    }
    .checklist-item-row input { flex: 1; }

    /* Persona list */
    .persona-list { margin-bottom: 16px; }
    .persona-card {
      background: var(--vscode-editor-inactiveSelectionBackground);
      border: 1px solid var(--vscode-panel-border);
      border-radius: 4px;
      padding: 10px 14px;
      margin-bottom: 8px;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
    }
    .persona-card-body { flex: 1; min-width: 0; }
    .persona-name { font-weight: 600; margin-bottom: 2px; }
    .persona-meta { font-size: 0.82em; opacity: 0.75; }
    .persona-actions { display: flex; gap: 6px; flex-shrink: 0; }

    .empty-state {
      text-align: center;
      padding: 32px 0;
      opacity: 0.6;
      font-style: italic;
    }

    /* Inline form */
    .persona-form {
      background: var(--vscode-sideBar-background);
      border: 1px solid var(--vscode-panel-border);
      border-radius: 4px;
      padding: 16px;
      margin-bottom: 16px;
    }
    .persona-form h3 { margin-bottom: 14px; font-size: 1em; }
    .form-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 4px; }

    /* Review tab */
    .section-label {
      font-weight: 600;
      margin-bottom: 8px;
      font-size: 0.95em;
    }
    .persona-checklist {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0 8px;
      margin-bottom: 20px;
    }
    .checklist-header { margin-bottom: 6px; }
    .checklist-divider { margin: 4px 0 8px; border: none; border-top: 1px solid var(--vscode-panel-border); }
    .select-all-item { opacity: 0.85; }
    .persona-check-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 10px;
      border-radius: 3px;
      cursor: pointer;
      user-select: none;
    }
    .persona-check-item:hover { background: var(--vscode-list-hoverBackground); }
    .persona-check-item input[type="checkbox"] { width: auto; cursor: pointer; }

    .prompt-output { margin-top: 20px; }
    .prompt-output textarea {
      min-height: 260px;
      resize: vertical;
      font-size: 0.85em;
      line-height: 1.5;
    }
    .copy-bar {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 8px;
    }
    .copy-success {
      font-size: 0.85em;
      color: var(--vscode-testing-iconPassed);
      opacity: 0;
      transition: opacity 0.3s;
    }
    .copy-success.visible { opacity: 1; }

    .divider { margin: 20px 0; border: none; border-top: 1px solid var(--vscode-panel-border); }
    .hidden { display: none !important; }
  </style>
</head>
<body>
  <h1>Reviseo</h1>

  <div class="tabs">
    <button class="tab-btn active" data-tab="personas">Personas</button>
    <button class="tab-btn" data-tab="review">Generate Review</button>
  </div>

  <!-- ==================== PERSONAS TAB ==================== -->
  <div id="tab-personas" class="tab-panel active">
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

    <button class="btn btn-primary" id="btn-add-persona">+ Add Persona</button>
  </div>

  <!-- ==================== REVIEW TAB ==================== -->
  <div id="tab-review" class="tab-panel">
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

    <button class="btn btn-primary" id="btn-generate">Generate Prompt</button>

    <div class="prompt-output hidden" id="prompt-output">
      <hr class="divider">
      <div class="section-label">Generated Prompt</div>
      <textarea id="prompt-text" readonly></textarea>
      <div class="copy-bar">
        <span class="copy-success" id="copy-success">Copied!</span>
        <button class="btn btn-secondary" id="btn-copy">Copy to Clipboard</button>
      </div>
    </div>
  </div>

  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();
    let allPersonas = [];

    // ── Tab switching ──────────────────────────────────────────────
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
      });
    });

    // ── Message handling ───────────────────────────────────────────
    window.addEventListener('message', ({ data }) => {
      switch (data.type) {
        case 'personasLoaded':
        case 'personasSaved':
          allPersonas = data.personas;
          renderPersonaList();
          renderChecklist();
          break;
        case 'promptGenerated':
          showPrompt(data.text);
          break;
        case 'error':
          alert('Error: ' + data.message);
          break;
      }
    });

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

    function renderChecklist() {
      const list = document.getElementById('persona-checklist');
      const header = document.getElementById('checklist-header');
      if (allPersonas.length === 0) {
        list.innerHTML = '<div class="empty-state">No personas defined. Add some in the Personas tab first.</div>';
        header.classList.add('hidden');
        return;
      }
      const sorted = [...allPersonas].sort((a, b) => a.name.localeCompare(b.name));
      list.innerHTML = sorted.map(p => \`
        <label class="persona-check-item">
          <input type="checkbox" name="persona" value="\${esc(p.id)}">
          <span>\${esc(p.name)}</span>
        </label>
      \`).join('');
      header.classList.remove('hidden');
      const master = document.getElementById('chk-select-all');
      master.checked = false;
      master.indeterminate = false;
      master.onchange = () => {
        document.querySelectorAll('input[name="persona"]')
          .forEach(cb => { cb.checked = master.checked; });
      };
      function syncMaster() {
        const all = document.querySelectorAll('input[name="persona"]');
        const checked = document.querySelectorAll('input[name="persona"]:checked');
        master.checked = checked.length === all.length;
        master.indeterminate = checked.length > 0 && checked.length < all.length;
      }
      document.querySelectorAll('input[name="persona"]').forEach(cb => {
        cb.addEventListener('change', syncMaster);
      });
    }

    function esc(str) {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
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

    function generateId() {
      return 'p-' + Math.random().toString(36).slice(2, 10) + '-' + Date.now();
    }

    // ── Generate prompt ────────────────────────────────────────────
    document.getElementById('btn-generate').addEventListener('click', () => {
      const prUrl = document.getElementById('pr-url').value.trim();
      if (!prUrl) {
        alert('Please enter a Pull Request URL.');
        return;
      }
      const checked = Array.from(document.querySelectorAll('input[name="persona"]:checked'))
        .map(el => el.value);
      if (checked.length === 0) {
        alert('Please select at least one persona.');
        return;
      }
      vscode.postMessage({ type: 'generatePrompt', prUrl, personaIds: checked });
    });

    function showPrompt(text) {
      document.getElementById('prompt-text').value = text;
      document.getElementById('prompt-output').classList.remove('hidden');
      document.getElementById('prompt-output').scrollIntoView({ behavior: 'smooth' });
    }

    // ── Copy to clipboard ──────────────────────────────────────────
    document.getElementById('btn-copy').addEventListener('click', () => {
      const text = document.getElementById('prompt-text').value;
      vscode.postMessage({ type: 'copyToClipboard', text });
      const success = document.getElementById('copy-success');
      success.classList.add('visible');
      setTimeout(() => success.classList.remove('visible'), 2000);
    });

    // ── Init ───────────────────────────────────────────────────────
    vscode.postMessage({ type: 'getPersonas' });
  </script>
</body>
</html>`;
}
