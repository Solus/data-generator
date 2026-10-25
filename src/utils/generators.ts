export const generateRandomDigits = (length: number): string => {
  let result = '';
  const characters = '0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

// ISO 7064 MOD 11,10 check digit. Used by the OIB and by the control digit of Croatian account numbers.
const mod1110CheckDigit = (digits: string): string => {
  let sum = 10;
  for (let i = 0; i < digits.length; i++) {
    const digit = parseInt(digits[i], 10);
    sum = sum + digit;
    sum = sum % 10;
    if (sum === 0) {
      sum = 10;
    }
    sum = sum * 2;
    sum = sum % 11;
  }
  let checkDigit = 11 - sum;
  if (checkDigit === 10) {
    checkDigit = 0;
  }
  return checkDigit.toString();
};

export const calculateOIBCheckDigit = (firstTenDigits: string): string => mod1110CheckDigit(firstTenDigits.slice(0, 10));

// A 10-digit Croatian account number: 9 random digits plus a valid control digit, so the IBAN also
// passes strict domestic validators (not just the generic IBAN mod-97 check).
export const generateAccountNumber = (): string => {
  const firstNine = generateRandomDigits(9);
  return firstNine + mod1110CheckDigit(firstNine);
};

export const calculateIBANCheckDigits = (ibanWithoutCheckDigits: string): string => {
  const rearranged = ibanWithoutCheckDigits.substring(4) + ibanWithoutCheckDigits.substring(0, 4);
  let numericString = '';
  for (let i = 0; i < rearranged.length; i++) {
    const char = rearranged[i];
    if (char >= 'A' && char <= 'Z') {
      numericString += (char.charCodeAt(0) - 55).toString();
    } else {
      numericString += char;
    }
  }

  let remainder = 0;
  for (let i = 0; i < numericString.length; i += 9) {
    const chunk = numericString.substring(i, i + 9);
    remainder = parseInt(String(remainder) + chunk, 10) % 97;
  }

  const checkDigitValue = 98 - remainder;
  return (checkDigitValue < 10 ? '0' : '') + checkDigitValue.toString();
};