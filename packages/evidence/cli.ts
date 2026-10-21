import { resolve } from 'node:path';
import { validateRecords } from './validate.ts';

if (process.argv.length > 3 || process.argv[2]?.startsWith('-')) {
  console.error('Usage: pnpm validate:records [repository-root]');
  process.exitCode = 1;
} else {
  try {
    const root = process.argv[2] ?? resolve(import.meta.dirname, '../..');
    console.log(JSON.stringify(validateRecords(root), null, 2));
  } catch (error) {
    console.error(`Record validation failed: ${error instanceof Error ? error.message : 'unknown error'}`);
    process.exitCode = 1;
  }
}
