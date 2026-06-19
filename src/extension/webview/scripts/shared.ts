export function getSharedScript(): string {
    return /* js */`
    const vscode = acquireVsCodeApi();
    let allPersonas = [];

    function esc(str) {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    function generateId() {
      return 'p-' + Math.random().toString(36).slice(2, 10) + '-' + Date.now();
    }

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
          document.dispatchEvent(new CustomEvent('personas-updated'));
          break;
        case 'promptGenerated':
          document.dispatchEvent(new CustomEvent('prompt-generated', { detail: { text: data.text } }));
          break;
        case 'generationPromptBuilt':
          document.dispatchEvent(new CustomEvent('generation-prompt-built', { detail: { prompt: data.prompt } }));
          break;
        case 'reviewSettingsLoaded':
          document.dispatchEvent(new CustomEvent('review-settings-loaded', { detail: { multiAgent: data.multiAgent, pendingReview: data.pendingReview } }));
          break;
        case 'localReviewSettingsLoaded':
          document.dispatchEvent(new CustomEvent('local-review-settings-loaded', { detail: { multiAgent: data.multiAgent, baseBranch: data.baseBranch } }));
          break;
        case 'error':
          alert('Error: ' + data.message);
          break;
      }
    });

    // ── Init ───────────────────────────────────────────────────────
    vscode.postMessage({ type: 'getPersonas' });
    vscode.postMessage({ type: 'getReviewSettings' });
    `.trim();
}
