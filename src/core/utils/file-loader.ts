import { existsSync, readFileSync } from 'fs';
import { writeFile } from 'fs/promises';

export interface FileResponse {
  data: string;
  status: Boolean;
}

export const fileLoader = (path: string): FileResponse => {
  if (!existsSync(path)) {
    return { data: 'file not found', status: false };
  }

  return {
    data: readFileSync(path, 'utf-8'),
    status: true,
  };
};


export async function saveArrayBufferToFile(buffer: ArrayBuffer, outputPath: string) {
  const nodeBuffer = Buffer.from(buffer);
  await writeFile(outputPath, nodeBuffer);
}
