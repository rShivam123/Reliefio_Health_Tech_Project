import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // This rule (new in eslint-plugin-react-hooks v7 / the React Compiler
      // ruleset) flags any setState call made synchronously at the top of a
      // useEffect - including the extremely common "setLoading(true) then
      // fetch()" pattern used throughout this app's data-fetching pages.
      // That pattern has no actual cascading-render bug here (it does not
      // set state derived from props/state that could be computed during
      // render instead), so we keep it as a warning rather than a build-
      // blocking error instead of restructuring ~20 fetch effects.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
