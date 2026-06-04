import { authenticator } from "otplib";
import QRCode from "qrcode";

authenticator.options = { window: 1 };

export function generateTotpSecret(email: string): string {
  return authenticator.generateSecret();
}

export function getTotpUri(secret: string, email: string): string {
  return authenticator.keyuri(email, "AME Admin", secret);
}

export async function getTotpQrDataUrl(uri: string): Promise<string> {
  return QRCode.toDataURL(uri);
}

export function verifyTotp(token: string, secret: string): boolean {
  return authenticator.verify({ token, secret });
}
