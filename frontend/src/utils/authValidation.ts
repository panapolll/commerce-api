const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): string | null {
  const trimmed = email.trim();
  if (!trimmed) return 'กรุณากรอกอีเมล';
  if (!EMAIL_PATTERN.test(trimmed)) return 'กรุณาใส่อีเมลให้ถูกต้อง';
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return 'กรุณากรอกรหัสผ่าน';
  if (password.length < 6) return 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
  return null;
}

export function validateLoginForm(email: string, password: string): string | null {
  return validateEmail(email) ?? validatePassword(password);
}

export function validateRegisterForm(email: string, password: string): string | null {
  return validateEmail(email) ?? validatePassword(password);
}

export function formatApiError(message: unknown, fallback: string): string {
  if (Array.isArray(message)) return message.join(', ');
  if (typeof message === 'string') return message;
  return fallback;
}
