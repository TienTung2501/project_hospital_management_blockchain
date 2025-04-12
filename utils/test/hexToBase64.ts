import forge from 'node-forge';

export function hexToBase64(hexStr: string): string {
  const bytes = forge.util.hexToBytes(hexStr);
  return forge.util.encode64(bytes);
}
