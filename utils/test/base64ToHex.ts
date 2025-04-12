import forge from 'node-forge';

export function base64ToHex(base64Str: string): string {
  const bytes = forge.util.decode64(base64Str);
  return forge.util.bytesToHex(bytes);
}
