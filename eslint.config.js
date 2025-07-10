import { defineConfig } from "eslint/config";
import react from 'eslint-plugin-react';
import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierRecommendedConfig from 'eslint-plugin-prettier/recommended';

export default defineConfig([
    {
        files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],

        "env": {
            "browser": true,
            "node": true
        },

        "parser": "@typescript-eslint/parser",
        "parserOptions": {
            "ecmaVersion": 2020,
            "sourceType": "module",
            "ecmaFeatures": {
                "jsx": true
            }
        },
        "settings": {
            "react": {
                "version": "detect"
            }
        },

        "plugins": {
            react: react,
            // '@typescript-eslint': tseslint.plugin,
            // prettier: prettierPlugin
        },

        "extends": [
            ...tseslint.configs.recommended,
            react.configs.recommended,
            prettierRecommendedConfig,
        ],

        "rules": {
            "prettier/prettier": ["error", { "endOfLine": "auto" }],
            "@typescript-eslint/no-empty-interface": "off",
            "@typescript-eslint/no-empty-function": "off",
            "@typescript-eslint/ban-ts-comment": "off",
            "@typescript-eslint/no-inferrable-types": "off",
            "react/display-name": "off",
            "@typescript-eslint/ban-types": "off"
        }
    },
]);