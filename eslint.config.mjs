import typescriptEslint from "typescript-eslint";
import boundaries from "eslint-plugin-boundaries";

export default [{
    files: ["**/*.ts"],
}, {
    plugins: {
        "@typescript-eslint": typescriptEslint.plugin,
    },

    languageOptions: {
        parser: typescriptEslint.parser,
        ecmaVersion: 2022,
        sourceType: "module",
    },

    rules: {
        "@typescript-eslint/naming-convention": ["warn", {
            selector: "import",
            format: ["camelCase", "PascalCase"],
        }],

        curly: "warn",
        eqeqeq: "warn",
        "no-throw-literal": "warn",
        semi: "warn",
    },
}, {
    plugins: { boundaries },
    settings: {
        "boundaries/elements": [
            { type: "persona-management", pattern: "src/core/persona-management/**" },
            { type: "review-generation",  pattern: "src/core/review-generation/**"  },
            { type: "extension",          pattern: "src/extension/**"               },
            { type: "test",               pattern: "src/test/**"                    },
        ],
    },
    rules: {
        "boundaries/dependencies": ["error", {
            default: "disallow",
            rules: [
                { from: { type: "persona-management" }, allow: { to: { type: "persona-management" } } },
                { from: { type: "review-generation" },  allow: { to: { type: ["review-generation", "persona-management"] } } },
                { from: { type: "extension" },          allow: { to: { type: ["persona-management", "review-generation", "extension"] } } },
                { from: { type: "test" },               allow: { to: { type: ["persona-management", "review-generation", "extension", "test"] } } },
            ],
        }],
    },
}];
