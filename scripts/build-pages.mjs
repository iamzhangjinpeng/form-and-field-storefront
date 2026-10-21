import { rename, access } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
const api = new URL('../app/api', import.meta.url);
const backup = new URL('../.api-backup', import.meta.url);
let moved = false;
try {
  await access(api);
  await rename(api, backup);
  moved = true;
  const result = spawnSync(
    process.execPath,
    ['node_modules/next/dist/bin/next', 'build', '--webpack'],
    {
      stdio: 'inherit',
      env: {
        ...process.env,
        STATIC_EXPORT: 'true',
        NEXT_PUBLIC_STATIC_DEMO:
          process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
            ? 'false'
            : 'true',
        NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH ?? '/form-and-field-storefront',
      },
    },
  );
  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
} finally {
  if (moved) await rename(backup, api);
}
