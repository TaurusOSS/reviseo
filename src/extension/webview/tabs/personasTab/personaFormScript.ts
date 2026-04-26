export function getPersonaFormScript(): string {
    return /* js */`
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
    `.trim();
}
