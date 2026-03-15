import { getStyles } from './styles';
import { getSharedScript } from './scripts/shared';
import type { WebviewTab } from './WebviewTab';

export function getWebviewHtml(nonce: string, cspSource: string, tabs: WebviewTab[]): string {
    const tabButtons = tabs
        .map((t, i) => `<button class="tab-btn${i === 0 ? ' active' : ''}" data-tab="${t.id}">${t.label}</button>`)
        .join('\n    ');

    const tabPanels = tabs
        .map((t, i) => `<div id="tab-${t.id}" class="tab-panel${i === 0 ? ' active' : ''}">\n${t.html()}\n  </div>`)
        .join('\n\n  ');

    const allScripts = [getSharedScript(), ...tabs.map(t => t.script())].join('\n\n');

    return /* html */`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy"
    content="default-src 'none'; style-src ${cspSource} 'nonce-${nonce}'; script-src 'nonce-${nonce}';">
  <title>Reviseo</title>
  ${getStyles(nonce)}
</head>
<body>
  <h1>Reviseo</h1>

  <div class="tabs">
    ${tabButtons}
  </div>

  ${tabPanels}

  <script nonce="${nonce}">
    ${allScripts}
  </script>
</body>
</html>`;
}
