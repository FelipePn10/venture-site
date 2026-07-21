/**
 * Máscara de telefone brasileiro para inputs.
 *
 * Aceita só dígitos (descarta letras e qualquer outro caractere), limita a 11
 * números — DDD + 9 dígitos do celular — e formata como (11) 99999-9999 à
 * medida que o usuário digita. Números fixos (10 dígitos) também ficam certos:
 * (11) 3333-4444.
 */
export function maskPhoneBR(input: string): string {
  const digits = input.replace(/\D/g, '').slice(0, 11);
  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

/** Quantidade de dígitos, para validar se o telefone está completo. */
export function phoneDigits(input: string): number {
  return input.replace(/\D/g, '').length;
}
