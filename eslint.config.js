import globals from "globals";
//import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslint_plugin_solid from "eslint-plugin-solid";
import eslint_plugin_prettier from "eslint-plugin-prettier/recommended";

export default [
  //...tseslint.configs.strict,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      eslint_plugin_solid,
    },
  },
  { languageOptions: { globals: globals.node } },
  eslint_plugin_prettier,
];
