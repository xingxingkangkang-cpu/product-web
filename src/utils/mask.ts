/**
 * Data masking helpers.
 */

export function maskName(name: string): string {
  if (!name) {
    return '-';
  }

  if (name.length === 1) {
    return `${name}*`;
  }

  return `${name[0]}${'*'.repeat(Math.max(1, name.length - 1))}`;
}
