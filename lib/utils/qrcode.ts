import QRCode from 'qrcode';

export async function generateQRCode(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 300
    });
  } catch (error) {
    console.error('QR generation failed:', error);
    throw new Error('Failed to generate QR code');
  }
}