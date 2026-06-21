export function getStyles(nonce: string): string {
    return /* html */`<style nonce="${nonce}">
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --reviseo-favorite-color: #f5a623;
    }

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

    /* Inner tabs (mode switcher within a tab panel) */
    .inner-tabs {
      display: flex;
      border-bottom: 1px solid var(--vscode-panel-border);
      margin-bottom: 16px;
    }
    .inner-tab-btn {
      padding: 6px 16px;
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
    .inner-tab-btn.active {
      border-bottom-color: var(--vscode-button-background);
      opacity: 1;
      font-weight: 600;
    }
    .inner-tab-panel { display: block; }
    .inner-tab-panel.hidden { display: none; }

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
    .persona-actions { display: flex; gap: 6px; flex-shrink: 0; align-items: center; }
    .btn-favorite {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.1em;
      padding: 2px 4px;
      color: var(--vscode-foreground);
      opacity: 0.35;
      line-height: 1;
      transition: opacity 0.1s, color 0.1s;
    }
    .btn-favorite:hover { opacity: 0.7; }
    .btn-favorite.is-favorite { color: var(--reviseo-favorite-color); opacity: 1; }
    .btn-favorite.is-favorite:hover { opacity: 0.8; }

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

    /* Generate Persona wizard */
    .wizard-step-desc { font-size: 0.88em; opacity: 0.8; margin-bottom: 14px; }
    .persona-tab-actions { display: flex; gap: 8px; }
    .persona-preview-field { margin-bottom: 10px; }
    .persona-preview-field > label { margin-bottom: 3px; font-weight: 600; font-size: 0.88em; opacity: 0.75; }
    .persona-preview-field > p { font-size: 0.9em; line-height: 1.5; white-space: pre-wrap; }
    .persona-preview-checklist { list-style: none; padding: 0; }
    .persona-preview-checklist li { font-size: 0.88em; padding: 2px 0 2px 14px; position: relative; }
    .persona-preview-checklist li::before { content: '•'; position: absolute; left: 0; }

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

    details.settings-toggle { margin-bottom: 16px; }
    details.settings-toggle > summary {
      list-style: none;
      display: inline-block;
      font-weight: normal;
      cursor: pointer;
    }
    details.settings-toggle > summary::-webkit-details-marker { display: none; }
    .additional-settings {
      padding: 10px 12px;
      background: var(--vscode-sideBar-background);
      border: 1px solid var(--vscode-panel-border);
      border-radius: 3px;
      margin-top: 8px;
    }
    .settings-tip {
      font-size: 0.82em;
      opacity: 0.75;
      margin-top: 6px;
      padding-left: 26px;
    }
  </style>`;
}
