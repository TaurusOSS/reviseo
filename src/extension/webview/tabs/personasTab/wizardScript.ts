export function getWizardScript(): string {
    return /* js */`
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
      document.getElementById('wizard-description').value = '';
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
      const description = document.getElementById('wizard-description').value.trim();
      vscode.postMessage({ type: 'buildGenerationPrompt', name, ...(description && { description }) });
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
      const additionalInputsHtml = Array.isArray(parsed.additionalInputs) && parsed.additionalInputs.length > 0
        ? \`<div class="persona-preview-field">
            <label>Additional Inputs</label>
            <ul class="persona-preview-checklist">\${parsed.additionalInputs.map(i => \`<li>\${esc(i.name)} (<code>\${esc(i.id)}</code>)</li>\`).join('')}</ul>
          </div>\`
        : '';
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
        \${additionalInputsHtml}
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
        ...(Array.isArray(wizardParsedPersona.additionalInputs) && wizardParsedPersona.additionalInputs.length > 0
          ? { additionalInputs: wizardParsedPersona.additionalInputs.filter(i => i.id && i.name) }
          : {}),
      };
      vscode.postMessage({ type: 'savePersona', persona });
      closeWizard();
    });
    `.trim();
}
