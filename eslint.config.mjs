import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/**
 * Global ignores MUST be first in flat config.
 * Otherwise ESLint may walk `.next/**` build artifacts and large
 * non-source trees before ignore rules apply, which can hang lint.
 */
const eslintConfig = [
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/out/**",
      "**/build/**",
      "**/dist/**",
      "**/coverage/**",
      "**/tmp/**",
      "docs/**",
      "prompts/**",
      "templates/**",
      "knowledge/**",
      "reports/**",
      "schemas/**",
      "package-lock.json",
      "next-env.d.ts",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
