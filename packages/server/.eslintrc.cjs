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
                "@typescript-eslint/restrict-template-expressions": [
                    "error",
                    { allowNumber: true, allowBoolean: true, allowNullish: true }
                ],
            },
        },
    ]
}

