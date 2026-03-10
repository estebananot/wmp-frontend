export function validateCardNumber(number: string): boolean {
  const cleanNumber = number.replace(/\s/g, '');
  if (!/^\d{13,19}$/.test(cleanNumber)) {
    return false;
  }
  let sum = 0;
  let isEven = false;
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber[i], 10);
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
    isEven = !isEven;
  }
  return sum % 10 === 0;
}

export function validateExpiryDate(month: string, year: string): boolean {
  const cleanMonth = month.padStart(2, '0');
  const cleanYear = year.length === 2 ? `20${year}` : year;
  const expiry = new Date(parseInt(cleanYear, 10), parseInt(cleanMonth, 10) - 1, 1);
  const now = new Date();
  return expiry >= now;
}

export function validateCVC(cvc: string): boolean {
  return /^\d{3,4}$/.test(cvc);
}

export function formatCardNumber(value: string): string {
  const cleanValue = value.replace(/\D/g, '');
  const groups = cleanValue.match(/.{1,4}/g);
  return groups ? groups.join(' ').substr(0, 19) : '';
}

export function formatExpiryDate(value: string): string {
  const cleanValue = value.replace(/\D/g, '');
  if (cleanValue.length >= 2) {
    return `${cleanValue.substr(0, 2)}/${cleanValue.substr(2, 2)}`;
  }
  return cleanValue;
}

export function getCardBrand(number: string): string {
  const cleanNumber = number.replace(/\D/g, '');
  if (/^4/.test(cleanNumber)) return 'Visa';
  if (/^5[1-5]/.test(cleanNumber)) return 'Mastercard';
  if (/^3[47]/.test(cleanNumber)) return 'Amex';
  if (/^6(?:011|5)/.test(cleanNumber)) return 'Discover';
  return 'Unknown';
}
