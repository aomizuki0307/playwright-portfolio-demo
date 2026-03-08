import { writeFileSync, mkdirSync } from 'fs';
import { join, resolve } from 'path';

export function exportToJson<T>(data: T[], filename: string): string {
  const outputDir = resolve('output');
  mkdirSync(outputDir, { recursive: true });
  const outputPath = join(outputDir, filename);

  writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8');
  return outputPath;
}
