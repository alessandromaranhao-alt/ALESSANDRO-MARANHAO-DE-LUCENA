
import { QRCodePayload, QRValidationResult } from '../types';

/**
 * Generates a Base64 encoded JSON string representing the QR Data.
 * Uses unicode-safe encoding to support special characters.
 * @param id User or Visitor ID
 * @param name User or Visitor Name
 * @param type 'visitor' | 'resident' | 'employee' | 'provider' | 'dependent' | 'associate'
 * @param validityHours Duration in hours
 * @param unit Optional unit number
 */
export const generateDynamicQRToken = (
  id: string,
  name: string,
  type: 'visitor' | 'resident' | 'employee' | 'provider' | 'dependent' | 'associate',
  validityHours: number,
  unit?: string
): string => {
  const now = Date.now();
  const expiresAt = now + (validityHours * 60 * 60 * 1000);

  const payload: QRCodePayload = {
    t: type,
    id: id,
    nm: name,
    exp: expiresAt,
    unt: unit
  };

  // Create JSON string
  const jsonString = JSON.stringify(payload);
  
  // Encode to Base64 with Unicode support (fixes issues with accents like ã, é)
  return btoa(unescape(encodeURIComponent(jsonString)));
};

/**
 * Decodes and validates a QR Token.
 * @param token The Base64 string scanned
 */
export const validateQRToken = (token: string): QRValidationResult => {
  try {
    // Decode Base64 with Unicode support
    const decodedString = decodeURIComponent(escape(atob(token)));
    const payload: QRCodePayload = JSON.parse(decodedString);

    const now = Date.now();

    if (!payload.exp || !payload.id || !payload.nm) {
      return { isValid: false, message: "Formato de QR Code inválido." };
    }

    if (now > payload.exp) {
      return { 
        isValid: false, 
        message: "QR Code EXPIRADO.", 
        data: payload 
      };
    }

    return {
      isValid: true,
      message: "Acesso Permitido",
      data: payload
    };

  } catch (error) {
    console.error("QR Decode Error", error);
    return { isValid: false, message: "Erro na leitura do código." };
  }
};
