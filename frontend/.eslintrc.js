module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react-hooks/recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended"
    ],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
          }
    },
    "plugins": [
        "@typescript-eslint",
        "@stylistic/js",
        "spellcheck",
        "react"
    ],
    "rules": {
        "@stylistic/js/indent": ["error"],
        "@stylistic/js/array-bracket-spacing": ["error"],
        "@stylistic/js/brace-style": ["error"],
        "@stylistic/js/spaced-comment": ["error"],
        "@stylistic/js/comma-style": ["error"],
        "@typescript-eslint/no-explicit-any": ["warn"],
        "spellcheck/spell-checker": [1,  {"skipWords": [
            "str",
            "sluggified",
            "checkbox",
            "minio",
            "goto",
            "frontend",
            "podplistic",
            "dom",
            "wavesurfer",
            "i",
         ]}],
        "react/react-in-jsx-scope": "off",
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx", ".ts", ".tsx",] }],
        "no-unused-vars": ["warn", { "varsIgnorePattern": "slug|created_at" }],
        "@typescript-eslint/no-unused-vars": ["warn", { "varsIgnorePattern": "slug|created_at" }],
        "no-duplicate-imports": ["error"],
        "camelcase": ["warn"],
        "semi": [
            "error",
            "always"
        ], 
        "no-undef": ["warn"],
    },
    "settings": {
        "react": {
          "version": "detect"
        }
    },
}
