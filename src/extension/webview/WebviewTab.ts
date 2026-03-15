export interface WebviewTab {
    readonly id: string;     // panel id: "tab-{id}", button data-tab="{id}" — must be a safe slug
    readonly label: string;  // tab button text
    html(): string;          // inner HTML of the tab panel (no wrapping div)
    script(): string;        // JS fragment injected into the shared <script> block (no <script> wrapper)
}
