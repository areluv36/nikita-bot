import { existsSync, readFileSync } from 'fs';

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
