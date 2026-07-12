export function getReviewScript(): string {
    return /* js */`
    // ── Personas updated / prompt generated ───────────────────────
    document.addEventListener('personas-updated', renderChecklist);
    document.addEventListener('prompt-generated', (e) => showPrompt(e.detail.text));

    // ── Inner tab switching ────────────────────────────────────────
    let activeInnerTab = 'github';
    let githubSettings = { multiAgent: false, pendingReview: false, skipCommentedIssues: false, skipCleanup: false };
    let localSettings = { multiAgent: false, baseBranch: 'origin/main', diffSource: 'branch', skipCleanup: false };

    function updateFetchButtonState() {
      const btn = document.getElementById('btn-fetch-pr-data');
      btn.style.display = document.getElementById('chk-skip-commented').checked ? 'none' : '';
    }

    function applySettingsToUi(tab) {
      if (tab === 'github') {
        document.getElementById('chk-multi-agent').checked = githubSettings.multiAgent;
        document.getElementById('chk-pending-review').checked = githubSettings.pendingReview;
        document.getElementById('chk-skip-commented').checked = githubSettings.skipCommentedIssues;
        document.getElementById('chk-skip-cleanup').checked = githubSettings.skipCleanup;
        updateFetchButtonState();
      } else {
        document.getElementById('chk-multi-agent').checked = localSettings.multiAgent;
        document.querySelector(\`input[name="diff-source"][value="\${localSettings.diffSource}"]\`).checked = true;
        document.getElementById('base-branch-field').style.display = localSettings.diffSource === 'branch' ? '' : 'none';
        document.getElementById('base-branch').value = localSettings.baseBranch ?? 'origin/main';
        document.getElementById('chk-skip-cleanup').checked = localSettings.skipCleanup;
      }
    }

    function activateTab(tab) {
      activeInnerTab = tab;
      document.querySelectorAll('.inner-tab-btn').forEach(b => b.classList.toggle('active', b.dataset.innerTab === tab));
      document.querySelectorAll('.inner-tab-panel').forEach(p => p.classList.add('hidden'));
      document.getElementById('inner-tab-' + tab).classList.remove('hidden');
      document.querySelectorAll('.github-only').forEach(el => {
        el.style.display = tab === 'github' ? '' : 'none';
      });
      applySettingsToUi(tab);
    }

    document.querySelectorAll('.inner-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activateTab(btn.dataset.innerTab);
        vscode.postMessage({ type: 'saveActiveReviewTab', tab: activeInnerTab });
      });
    });

    document.addEventListener('initial-state-loaded', (e) => {
      githubSettings = e.detail.github;
      localSettings = e.detail.local;
      activateTab(e.detail.activeTab);
    });

    // ── Settings persistence ───────────────────────────────────────
    function readLocalDiffSettings() {
      const diffSource = document.querySelector('input[name="diff-source"]:checked').value;
      const baseBranch = diffSource === 'branch'
        ? (document.getElementById('base-branch').value.trim() || 'origin/main')
        : undefined;
      return { diffSource, baseBranch };
    }

    const tabHandlers = {
      github: {
        save: () => {
          githubSettings.multiAgent = document.getElementById('chk-multi-agent').checked;
          githubSettings.pendingReview = document.getElementById('chk-pending-review').checked;
          githubSettings.skipCommentedIssues = document.getElementById('chk-skip-commented').checked;
          githubSettings.skipCleanup = document.getElementById('chk-skip-cleanup').checked;
          vscode.postMessage({ type: 'saveReviewSettings', ...githubSettings });
        },
        generate: (checked, personaContext) => {
          const prUrl = document.getElementById('pr-url').value.trim();
          if (!prUrl) { alert('Please enter a Pull Request URL.'); return; }
          const multiAgent = document.getElementById('chk-multi-agent').checked;
          const pendingReview = document.getElementById('chk-pending-review').checked;
          const skipCommentedIssues = document.getElementById('chk-skip-commented').checked;
          const skipCleanup = document.getElementById('chk-skip-cleanup').checked;
          vscode.postMessage({ type: 'generatePrompt', prUrl, personaIds: checked, promptOptions: { multiAgent, pendingReview, skipCommentedIssues, skipCleanup }, personaContext });
        },
      },
      local: {
        save: () => {
          const { diffSource, baseBranch } = readLocalDiffSettings();
          localSettings.multiAgent = document.getElementById('chk-multi-agent').checked;
          localSettings.diffSource = diffSource;
          localSettings.baseBranch = baseBranch;
          localSettings.skipCleanup = document.getElementById('chk-skip-cleanup').checked;
          vscode.postMessage({ type: 'saveLocalReviewSettings', ...localSettings });
        },
        generate: (checked, personaContext) => {
          const { diffSource, baseBranch } = readLocalDiffSettings();
          const multiAgent = document.getElementById('chk-multi-agent').checked;
          const skipCleanup = document.getElementById('chk-skip-cleanup').checked;
          vscode.postMessage({ type: 'generateLocalPrompt', diffSource, baseBranch, personaIds: checked, multiAgent, skipCleanup, personaContext });
        },
      },
    };

    function saveSettings() {
      tabHandlers[activeInnerTab].save();
    }

    document.getElementById('chk-multi-agent').addEventListener('change', saveSettings);
    document.getElementById('chk-pending-review').addEventListener('change', saveSettings);
    document.getElementById('chk-skip-commented').addEventListener('change', () => { saveSettings(); updateFetchButtonState(); });
    document.getElementById('chk-skip-cleanup').addEventListener('change', saveSettings);
    document.getElementById('base-branch').addEventListener('change', saveSettings);
    document.querySelectorAll('input[name="diff-source"]').forEach(radio => {
      radio.addEventListener('change', () => {
        document.getElementById('base-branch-field').style.display = radio.value === 'branch' ? '' : 'none';
        saveSettings();
      });
    });

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
          <input type="checkbox" name="persona" value="\${esc(p.id)}"\${p.favorite ? ' checked' : ''}>
          <span>\${esc(p.name)}</span>
        </label>
      \`).join('');
      header.classList.remove('hidden');
      const master = document.getElementById('chk-select-all');
      const initialChecked = document.querySelectorAll('input[name="persona"]:checked').length;
      const totalPersonas = allPersonas.length;
      master.checked = initialChecked === totalPersonas && totalPersonas > 0;
      master.indeterminate = initialChecked > 0 && initialChecked < totalPersonas;
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
      syncAdditionalInputs();
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

      tabHandlers[activeInnerTab].generate(checked, personaContext);
    });

    function showPrompt(text) {
      document.getElementById('prompt-text').value = text;
      document.getElementById('prompt-output').classList.remove('hidden');
      document.getElementById('prompt-output').scrollIntoView({ behavior: 'smooth' });
    }

    // ── Fetch PR Data ──────────────────────────────────────────────
    document.getElementById('btn-fetch-pr-data').addEventListener('click', () => {
      const prUrl = document.getElementById('pr-url').value.trim();
      if (!prUrl) { alert('Please enter a Pull Request URL.'); return; }
      const skipCommentedIssues = document.getElementById('chk-skip-commented').checked;
      vscode.postMessage({ type: 'fetchReviewData', prUrl, skipCommentedIssues });
    });

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
