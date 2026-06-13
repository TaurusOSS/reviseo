export function getReviewScript(): string {
    return /* js */`
    // ── Personas updated / prompt generated / settings events ──────
    document.addEventListener('personas-updated', renderChecklist);
    document.addEventListener('prompt-generated', (e) => showPrompt(e.detail.text));
    document.addEventListener('review-settings-loaded', (e) => {
      document.getElementById('chk-multi-agent').checked = e.detail.multiAgent;
      document.getElementById('chk-pending-review').checked = e.detail.pendingReview;
    });

    function saveReviewSettings() {
      vscode.postMessage({
        type: 'saveReviewSettings',
        multiAgent: document.getElementById('chk-multi-agent').checked,
        pendingReview: document.getElementById('chk-pending-review').checked,
      });
    }

    document.getElementById('chk-multi-agent').addEventListener('change', saveReviewSettings);
    document.getElementById('chk-pending-review').addEventListener('change', saveReviewSettings);

    // ── Rendering ──────────────────────────────────────────────────
    function renderChecklist() {
      const list = document.getElementById('persona-checklist');
      const header = document.getElementById('checklist-header');
      if (allPersonas.length === 0) {
        list.innerHTML = '<div class="empty-state">No personas defined. Add some in the Personas tab first.</div>';
        header.classList.add('hidden');
        return;
      }
      list.innerHTML = allPersonas.map(p => \`
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
        cb.addEventListener('change', syncAdditionalInputs);
      });
    }

    function syncAdditionalInputs() {
      const container = document.getElementById('additional-inputs-container');
      const checkedPersonaIds = Array.from(document.querySelectorAll('input[name="persona"]:checked'))
        .map(el => el.value);
      const selectedPersonas = allPersonas.filter(p => checkedPersonaIds.includes(p.id));

      const existingInputIds = new Set(
        Array.from(container.querySelectorAll('[data-persona-id]'))
          .map(el => el.getAttribute('data-persona-id') + ':' + el.querySelector('input').getAttribute('data-input-id'))
      );
      const neededInputIds = new Set(
        selectedPersonas.flatMap(p => (p.additionalInputs ?? []).map(inp => p.id + ':' + inp.id))
      );

      // Remove fields no longer needed, preserving values of fields that stay
      Array.from(container.querySelectorAll('[data-persona-id]')).forEach(el => {
        const key = el.getAttribute('data-persona-id') + ':' + el.querySelector('input').getAttribute('data-input-id');
        if (!neededInputIds.has(key)) {
          container.removeChild(el);
        }
      });

      // Add new fields
      selectedPersonas.forEach(p => {
        (p.additionalInputs ?? []).forEach(inp => {
          const key = p.id + ':' + inp.id;
          if (!existingInputIds.has(key)) {
            const div = document.createElement('div');
            div.className = 'field';
            div.setAttribute('data-persona-id', p.id);
            div.innerHTML = \`
              <label>\${esc(inp.name)} * <span class="settings-tip">(required by \${esc(p.name)})</span></label>
              <input type="text" data-input-id="\${esc(inp.id)}" placeholder="\${esc(inp.name)}">
            \`;
            container.appendChild(div);
          }
        });
      });
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
      const container = document.getElementById('additional-inputs-container');
      const inputFields = Array.from(container.querySelectorAll('[data-persona-id]'));
      for (const field of inputFields) {
        const input = field.querySelector('input');
        if (!input.value.trim()) {
          const inputId = input.getAttribute('data-input-id');
          const personaId = field.getAttribute('data-persona-id');
          const persona = allPersonas.find(p => p.id === personaId);
          const additionalInput = persona?.additionalInputs?.find(i => i.id === inputId);
          alert(\`\${additionalInput?.name ?? inputId} is required for \${persona?.name ?? personaId}.\`);
          return;
        }
      }
      const multiAgentChecked = document.getElementById('chk-multi-agent').checked;
      const pendingReviewChecked = document.getElementById('chk-pending-review').checked;
      const promptOptions = { multiAgent: multiAgentChecked, pendingReview: pendingReviewChecked };
      const personaContext = {};
      inputFields.forEach(field => {
        const personaId = field.getAttribute('data-persona-id');
        const input = field.querySelector('input');
        const inputId = input.getAttribute('data-input-id');
        const value = input.value.trim();
        if (value) {
          if (!personaContext[personaId]) {
            personaContext[personaId] = {};
          }
          personaContext[personaId][inputId] = value;
        }
      });
      vscode.postMessage({ type: 'generatePrompt', prUrl, personaIds: checked, promptOptions, personaContext });
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
    `.trim();
}
