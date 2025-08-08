// src/lib/auth/recaptcha.ts
export async function verifyRecaptcha(token: string) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) throw new Error("Missing reCAPTCHA secret key");

  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `secret=${secret}&response=${token}`,
  });

  return res.json() as Promise<{ success: boolean; [key: string]: any }>;
}
