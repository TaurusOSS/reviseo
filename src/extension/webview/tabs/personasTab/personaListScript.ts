export function getPersonaListScript(): string {
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
    `.trim();
}
