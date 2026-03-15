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

    // ── Init ───────────────────────────────────────────────────────
    vscode.postMessage({ type: 'getPersonas' });
    `.trim();
}
