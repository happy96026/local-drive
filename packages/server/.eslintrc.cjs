const { resolve } = require("node:path")

const project = resolve(__dirname, "tsconfig.json")

module.exports = {
    extends: [
        require.resolve("@vercel/style-guide/eslint/node"),
        "eslint:recommended",
        "plugin:prettier/recommended",
    ],
    root: true,
    env: {
        node: true,
    },
    rules: {
        "import/order": [
            "warn",
            {
                alphabetize: {
                    order: "asc",
                    caseInsensitive: false,
                },
                groups: [
                    "builtin", // Node.js built-in modules
                    "external", // Packages
                    "internal", // Aliased modules
                    "parent", // Relative parent
                    "sibling", // Relative sibling
                    "index", // Relative index
                ],
                "newlines-between": "never",
            },
        ],
    },
    overrides: [
        {
            files: ["**/*.ts"],
            extends: [
                require.resolve("@vercel/style-guide/eslint/typescript"),
                "plugin:@typescript-eslint/recommended-type-checked",
            ],
            plugins: ["@typescript-eslint"],
            parser: "@typescript-eslint/parser",
            parserOptions: {
                project,
                projectService: true,
                tsConfigRootDir: __dirname,
            },
            settings: {
                "import/resolver": {
                    typescript: {
                        project,
                    },
                },
            },
            rules: {
                "@typescript-eslint/class-literal-property-style": "off",
                "@typescript-eslint/restrict-template-expressions": [
                    "error",
                    {
                        allowNumber: true,
                        allowBoolean: true,
                        allowNullish: true,
                    },
                ],
            },
        },
    ],
}
