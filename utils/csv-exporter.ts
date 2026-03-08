import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname, resolve } from 'path';

interface Exportable {
  [key: string]: string | number | boolean;
}

export function exportToCsv<T extends Exportable>(data: T[], filename: string): string {
  const outputDir = resolve('output');
  mkdirSync(outputDir, { recursive: true });
  const outputPath = join(outputDir, filename);

  if (data.length === 0) {
    writeFileSync(outputPath, '', 'utf-8');
    return outputPath;
  }

  const headers = Object.keys(data[0]);
  const headerLine = headers.join(',');
  const rows = data.map((row) =>
    headers
      .map((h) => {
        const val = row[h];
        if (typeof val === 'string') {
          return `"${val.replace(/"/g, '""')}"`;
        }
        return String(val);
      })
      .join(','),
  );

  writeFileSync(outputPath, [headerLine, ...rows].join('\n'), 'utf-8');
  return outputPath;
}
