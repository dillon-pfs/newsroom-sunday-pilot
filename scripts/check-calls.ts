import { resolve } from "node:path";
import { CallFilingError, loadCalls } from "../lib/calls/content.ts";

try {
  const directory = process.argv[2] ? resolve(process.argv[2]) : undefined;
  const calls = loadCalls(directory);
  console.log(`Call filing passed: ${calls.length} calls, valid posts, results and status.`);
} catch (error) {
  if (!(error instanceof CallFilingError)) throw error;
  console.error(error.message);
  process.exitCode = 1;
}
