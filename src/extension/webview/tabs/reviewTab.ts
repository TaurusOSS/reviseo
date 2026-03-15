import type { WebviewTab } from '../WebviewTab';

export class ReviewTab implements WebviewTab {
    readonly id = 'review';
    readonly label = 'Generate Review';

    html(): string {
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

    script(): string {
        return /* js */`
    // ── Personas updated / prompt generated events ─────────────────
    document.addEventListener('personas-updated', renderChecklist);
    document.addEventListener('prompt-generated', (e) => showPrompt(e.detail.text));

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
    `.trim();
    }
}
