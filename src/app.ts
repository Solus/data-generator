// --- Interfaces and Types ---
interface Bank {
    name: string;
    vbdi: string;
}

interface BankData {
    [key: string]: Bank;
}

// --- DOM Elements ---
// IBAN Tab Elements
const bankSelect = document.getElementById("bankSelect") as HTMLSelectElement;
const customBankSelectDisplay = document.getElementById("customBankSelectDisplay") as HTMLDivElement;
const customBankDropdownMenu = document.getElementById("customBankDropdownMenu") as HTMLDivElement;
const vbdiDisplayLabel = document.getElementById("vbdiDisplayLabel") as HTMLSpanElement;
const ibanDisplayLabel = document.getElementById("ibanDisplayLabel") as HTMLSpanElement;
const ibanCopyButton = document.getElementById("ibanCopyButton") as HTMLButtonElement;
const ibanErrorLabel = document.getElementById("ibanErrorLabel") as HTMLDivElement;

// OIB Tab Elements
const oibDisplayLabel = document.getElementById("oibDisplayLabel") as HTMLSpanElement;
const oibCopyButton = document.getElementById("oibCopyButton") as HTMLButtonElement;
const oibErrorLabel = document.getElementById("oibErrorLabel") as HTMLDivElement;

// Names Tab Elements
const numNamesInput = document.getElementById("numNames") as HTMLInputElement;
const namesDisplayGrid = document.getElementById("namesDisplayGrid") as HTMLDivElement;
const namesErrorLabel = document.getElementById("namesErrorLabel") as HTMLDivElement;
const generateNamesSpinner = document.getElementById("generateNamesSpinner") as HTMLSpanElement;
const generateNamesText = document.getElementById("generateNamesText") as HTMLSpanElement;

// --- Data ---
const bankData: BankData = {
    zaba: { name: "Zagrebačka banka", vbdi: "2360000" },
    pbz: { name: "Privredna banka Zagreb", vbdi: "2340009" },
    erste: { name: "Erste & Steiermärkische Bank", vbdi: "2402006" },
    otp: { name: "OTP banka", vbdi: "2407000" },
    rba: { name: "Raiffeisenbank Hrvatska", vbdi: "2484008" }
};

// --- Helper Functions ---

/**
 * Generates a random string of digits of a specified length.
 * @param length The desired length of the digit string.
 * @returns A string containing random digits.
 */
function generateRandomDigits(length: number): string {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

/**
 * Calculates the two-digit check digits for an IBAN using ISO 7064 MOD 97-10.
 * @param ibanWithoutCheckDigits The IBAN string with country code and '00' placeholder for check digits.
 * @returns The two calculated check digits as a string.
 */
function calculateIBANCheckDigits(ibanWithoutCheckDigits: string): string {
    // Move first four characters (country code + 00) to the end
    const rearranged = ibanWithoutCheckDigits.substring(4) + ibanWithoutCheckDigits.substring(0, 4);

    let numericString = "";
    for (let i = 0; i < rearranged.length; i++) {
        const char = rearranged[i];
        // Convert letters to numbers (A=10, B=11, ..., Z=35)
        if (char >= 'A' && char <= 'Z') {
            numericString += (char.charCodeAt(0) - 55).toString();
        } else {
            numericString += char;
        }
    }

    // Perform modulo 97-10 calculation in chunks to avoid large number issues
    let remainder = 0;
    for (let i = 0; i < numericString.length; i += 9) {
        const chunk = numericString.substring(i, i + 9);
        remainder = parseInt(remainder + chunk, 10) % 97;
    }

    const checkDigitValue = 98 - remainder;
    // Ensure check digits are always two digits (e.g., 7 becomes "07")
    return (checkDigitValue < 10 ? "0" : "") + checkDigitValue.toString();
}

/**
 * Calculates the 11th check digit for a Croatian OIB using Modulo 11 algorithm.
 * @param firstTenDigits The first ten digits of the OIB.
 * @returns The calculated 11th check digit as a string.
 */
function calculateOIBCheckDigit(firstTenDigits: string): string {
    let sum = 10;
    for (let i = 0; i < 10; i++) {
        let digit = parseInt(firstTenDigits[i], 10);
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
}

/**
 * Handles copying text to clipboard and provides visual feedback.
 * Uses document.execCommand('copy') for broader iframe compatibility.
 * @param text The text to copy.
 * @param errorLabelId The ID of the HTMLDivElement to display errors.
 * @param buttonElement The HTMLButtonElement that triggered the copy, for visual feedback.
 */
function copyToClipboard(text: string, errorLabelId: string, buttonElement: HTMLButtonElement): void {
    const errorElement = document.getElementById(errorLabelId) as HTMLDivElement;
    const iconElement = buttonElement.querySelector('i') as HTMLElement;

    if (!text || text.trim() === '' || text.trim() === '&nbsp;') { // Check for empty or placeholder content
        errorElement.textContent = `No text to copy. Please generate a value first.`;
        errorElement.style.display = "block";
        return;
    }

    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
        document.execCommand('copy');
        if (iconElement) {
            iconElement.classList.remove('fa-copy');
            iconElement.classList.add('fa-check');
        }
        // Change button color for feedback
        buttonElement.classList.remove('btn-light', 'btn-outline-secondary');
        buttonElement.classList.add('btn-success');

        errorElement.style.display = "none";
        setTimeout(() => {
            if (iconElement) {
                iconElement.classList.remove('fa-check');
                iconElement.classList.add('fa-copy');
            }
            // Revert button color
            buttonElement.classList.remove('btn-success');
            // Determine original class based on button type
            if (buttonElement.classList.contains('copy-cell-button')) {
                buttonElement.classList.add('btn-light');
            } else { // This applies to IBAN/OIB main copy buttons and dropdown items
                buttonElement.classList.add('btn-outline-secondary');
            }
        }, 2000);
    } catch (err: any) { // Explicitly type err as 'any' or 'unknown'
        console.error('Failed to copy: ', err);
        errorElement.textContent = `Failed to copy. Please copy manually. ${err.message || ''}`;
        errorElement.style.display = "block";
        if (iconElement) {
            iconElement.classList.remove('fa-check');
            iconElement.classList.add('fa-copy');
        }
        // Revert button color on failure
        buttonElement.classList.remove('btn-success');
        if (buttonElement.classList.contains('copy-cell-button')) {
            buttonElement.classList.add('btn-light');
        } else {
            buttonElement.classList.add('btn-outline-secondary');
        }
    } finally {
        document.body.removeChild(tempInput);
    }
}

function copyIndividualName(text: string, errorLabelId: string, buttonElement: HTMLButtonElement): void {
    const errorElement = document.getElementById(errorLabelId) as HTMLDivElement;
    const iconElement = buttonElement.querySelector('i') as HTMLElement;

    if (!text || text.trim() === '') {
        errorElement.textContent = `No text to copy.`;
        errorElement.style.display = "block";
        return;
    }

    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
        document.execCommand('copy');
        if (iconElement) {
            iconElement.classList.remove('fa-copy');
            iconElement.classList.add('fa-check');
        }
        // Change button color for feedback
        buttonElement.classList.remove('btn-light', 'btn-outline-secondary');
        buttonElement.classList.add('btn-success');

        errorElement.style.display = "none";
        setTimeout(() => {
            if (iconElement) {
                iconElement.classList.remove('fa-check');
                iconElement.classList.add('fa-copy');
            }
            // Revert button color
            buttonElement.classList.remove('btn-success');
            if (buttonElement.classList.contains('copy-cell-button')) {
                buttonElement.classList.add('btn-light');
            } else {
                buttonElement.classList.add('btn-outline-secondary');
            }
        }, 2000);
    } catch (err: any) {
        console.error('Failed to copy: ', err);
        errorElement.textContent = `Failed to copy. Please copy manually.`;
        errorElement.style.display = "block";
        if (iconElement) {
            iconElement.classList.remove('fa-check');
            iconElement.classList.add('fa-copy');
        }
        // Revert button color on failure
        buttonElement.classList.remove('btn-success');
        if (buttonElement.classList.contains('copy-cell-button')) {
            buttonElement.classList.add('btn-light');
        } else {
            buttonElement.classList.add('btn-outline-secondary');
        }
    } finally {
        document.body.removeChild(tempInput);
    }
}


// --- Main Generation Functions ---

/**
 * Handles the selection of a custom bank from the dropdown and triggers IBAN generation.
 * @param key The key of the selected bank (e.g., 'zaba').
 * @param name The display name of the selected bank.
 * @param vbdi The VBDI of the selected bank.
 */
function selectCustomBank(key: string, name: string, vbdi: string): void {
    bankSelect.value = key; // Update hidden native select
    customBankSelectDisplay.textContent = name; // Display only name
    vbdiDisplayLabel.textContent = vbdi;
    ibanErrorLabel.style.display = "none";
    generateIBAN();
}

/**
 * Generates and displays a Croatian IBAN.
 * If no bank is selected, a random one is chosen.
 */
function generateIBAN(): void {
    let selectedBankKey = bankSelect.value;
    let vbdi: string;
    let bankName: string;

    if (!selectedBankKey || !bankData[selectedBankKey]) {
        // If no bank is selected or an invalid one, pick one at random
        const bankKeys = Object.keys(bankData);
        selectedBankKey = bankKeys[Math.floor(Math.random() * bankKeys.length)];
        bankSelect.value = selectedBankKey; // Update hidden native select
    }
    
    // Ensure bankData[selectedBankKey] is not undefined before accessing properties
    const selectedBank = bankData[selectedBankKey];
    if (selectedBank) {
        vbdi = selectedBank.vbdi;
        bankName = selectedBank.name;
    } else {
        // Fallback if somehow selectedBankKey is invalid even after random selection
        vbdi = "0000000"; 
        bankName = "Unknown Bank";
    }

    // Update the display for the custom dropdown
    customBankSelectDisplay.textContent = bankName;
    vbdiDisplayLabel.textContent = vbdi;

    const accountNumber = generateRandomDigits(10);
    const countryCode = "HR";
    const bbban = vbdi + accountNumber;
    const checkDigits = calculateIBANCheckDigits(countryCode + "00" + bbban);
    const iban = countryCode + checkDigits + bbban;

    ibanDisplayLabel.innerHTML = `<span class="countryCode">${countryCode}</span><span class="checkDigits">${checkDigits}</span><span class="bankCode">${vbdi}</span><span class="accountNumber">${accountNumber}</span>`;
    ibanErrorLabel.style.display = "none";
}

/**
 * Generates and displays a random Croatian OIB.
 */
function generateOIB(): void {
    const firstTenDigits = generateRandomDigits(10);
    const checkDigit = calculateOIBCheckDigit(firstTenDigits);
    const oib = firstTenDigits + checkDigit;
    oibDisplayLabel.textContent = oib;
    oibErrorLabel.style.display = "none";
}

/**
 * Generates and displays a list of Croatian first and last names using Gemini API.
 */
async function generateNames(): Promise<void> {
    const numNames = parseInt(numNamesInput.value, 10);
    if (isNaN(numNames) || numNames < 1 || numNames > 50) {
        namesErrorLabel.textContent = "Please enter a number between 1 and 50.";
        namesErrorLabel.style.display = "block";
        return;
    }

    // Clear previous names and add headers
    namesDisplayGrid.innerHTML = '<div class="names-grid-header">Ime</div><div class="names-grid-header">Prezime</div><div class="names-grid-header"><i class="fas fa-copy"></i></div>';
    namesErrorLabel.style.display = "none";
    generateNamesSpinner.classList.remove('d-none'); // Show spinner
    generateNamesText.textContent = "Generating..."; // Update button text

    // Prompt for Gemini API
    const prompt = `Generate a list of ${numNames} unique Croatian first and last names. Format each name as "Firstname,Lastname" on a new line, with no introductory or concluding text.`;

    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });
    const payload = { contents: chatHistory };
    const apiKey = ""; // Leave as empty string for Canvas to provide
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const result = await response.json();

        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            const text = result.candidates[0].content.parts[0].text as string;
            const nameLines = text.split('\n').filter(line => line.trim() !== '');

            if (nameLines.length === 0) {
                namesErrorLabel.textContent = "No names generated. Please try again.";
                namesErrorLabel.style.display = "block";
            } else {
                nameLines.forEach((line, index) => {
                    const parts = line.split(',');
                    if (parts.length === 2) {
                        const firstName = parts[0].trim();
                        const lastName = parts[1].trim();

                        // Create a container for the row
                        const namesGridRow = document.createElement('div');
                        namesGridRow.classList.add('names-grid-row');
                        // Apply alternating colors directly to the row container
                        if ((index + 1) % 2 !== 0) { // Odd index (1st, 3rd row etc.)
                            namesGridRow.style.backgroundColor = '#ffffff';
                        } else { // Even index (2nd, 4th row etc.)
                            namesGridRow.style.backgroundColor = '#f8f8f8';
                        }

                        // First Name Cell
                        const firstNameCell = document.createElement('div');
                        firstNameCell.classList.add('name-cell');
                        const firstNameSpan = document.createElement('span');
                        firstNameSpan.textContent = firstName;
                        firstNameCell.appendChild(firstNameSpan);

                        const firstNameCopyButton = document.createElement('button');
                        firstNameCopyButton.classList.add('copy-cell-button', 'btn', 'btn-sm', 'btn-light');
                        firstNameCopyButton.innerHTML = '<i class="fas fa-copy"></i>';
                        firstNameCopyButton.title = `Copy ${firstName}`;
                        firstNameCopyButton.onclick = (event) => {
                            event.stopPropagation(); // Prevent triggering cell's hover effect issues
                            copyIndividualName(firstName, 'namesErrorLabel', firstNameCopyButton);
                        };
                        firstNameCell.appendChild(firstNameCopyButton);

                        // Last Name Cell
                        const lastNameCell = document.createElement('div');
                        lastNameCell.classList.add('name-cell');
                        const lastNameSpan = document.createElement('span');
                        lastNameSpan.textContent = lastName;
                        lastNameCell.appendChild(lastNameSpan);

                        const lastNameCopyButton = document.createElement('button');
                        lastNameCopyButton.classList.add('copy-cell-button', 'btn', 'btn-sm', 'btn-light');
                        lastNameCopyButton.innerHTML = '<i class="fas fa-copy"></i>';
                        lastNameCopyButton.title = `Copy ${lastName}`;
                        lastNameCopyButton.onclick = (event) => {
                            event.stopPropagation(); // Prevent triggering cell's hover effect issues
                            copyIndividualName(lastName, 'namesErrorLabel', lastNameCopyButton);
                        };
                        lastNameCell.appendChild(lastNameCopyButton);

                        // Actions Cell (contains the dropdown)
                        const actionsCell = document.createElement('div');
                        actionsCell.classList.add('name-cell', 'actions-cell', 'dropdown'); // Add 'dropdown' class

                        const dropdownToggleBtn = document.createElement('button');
                        dropdownToggleBtn.classList.add('btn', 'btn-sm', 'btn-outline-secondary', 'dropdown-toggle');
                        dropdownToggleBtn.setAttribute('type', 'button');
                        dropdownToggleBtn.setAttribute('data-bs-toggle', 'dropdown');
                        dropdownToggleBtn.setAttribute('aria-expanded', 'false');
                        dropdownToggleBtn.innerHTML = '<i class="fas fa-ellipsis-v"></i>'; // Vertical dots icon
                        dropdownToggleBtn.title = 'More copy options';
                        actionsCell.appendChild(dropdownToggleBtn);

                        const dropdownMenu = document.createElement('ul');
                        dropdownMenu.classList.add('dropdown-menu');

                        const liImePrezime = document.createElement('li');
                        const btnImePrezime = document.createElement('button');
                        btnImePrezime.classList.add('dropdown-item');
                        btnImePrezime.innerHTML = `<i class="fas fa-copy"></i> <span>${firstName} ${lastName}</span>`;
                        btnImePrezime.title = `Copy ${firstName} ${lastName}`;
                        btnImePrezime.onclick = (event) => {
                            event.stopPropagation(); // Prevent dropdown from closing immediately
                            copyIndividualName(`${firstName} ${lastName}`, 'namesErrorLabel', btnImePrezime);
                        };
                        liImePrezime.appendChild(btnImePrezime);
                        dropdownMenu.appendChild(liImePrezime);

                        const liPrezimeIme = document.createElement('li');
                        const btnPrezimeIme = document.createElement('button');
                        btnPrezimeIme.classList.add('dropdown-item');
                        btnPrezimeIme.innerHTML = `<i class="fas fa-copy"></i> <span>${lastName} ${firstName}</span>`;
                        btnPrezimeIme.title = `Copy ${lastName} ${firstName}`;
                        btnPrezimeIme.onclick = (event) => {
                            event.stopPropagation(); // Prevent dropdown from closing immediately
                            copyIndividualName(`${lastName} ${firstName}`, 'namesErrorLabel', btnPrezimeIme);
                        };
                        liPrezimeIme.appendChild(btnPrezimeIme);
                        dropdownMenu.appendChild(liPrezimeIme);

                        actionsCell.appendChild(dropdownMenu);

                        // Append cells to the row container
                        namesGridRow.appendChild(firstNameCell);
                        namesGridRow.appendChild(lastNameCell);
                        namesGridRow.appendChild(actionsCell); // Add the new actions cell

                        // Append the row container to the main names grid
                        namesDisplayGrid.appendChild(namesGridRow);
                    }
                });
            }
        } else { // Handle cases where result.candidates or content is missing
            namesErrorLabel.textContent = "Could not retrieve names. The AI response was empty or malformed. Please try again.";
            namesErrorLabel.style.display = "block";
        }
    } catch (error: any) { // Explicitly type error as 'any' or 'unknown'
        console.error("Error calling Gemini API:", error);
        namesErrorLabel.textContent = `Error: Failed to fetch names. ${error.message || 'Please check your network connection.'}`;
        namesErrorLabel.style.display = "block";
    } finally {
        generateNamesSpinner.classList.add('d-none'); // Hide spinner
        generateNamesText.textContent = "Generate Names"; // Revert button text
    }
}

// --- Event Listeners Initialization (after all functions are defined) ---
document.addEventListener('DOMContentLoaded', () => {
    // Populate custom dropdown on load
    for (const key in bankData) {
        if (bankData.hasOwnProperty(key)) {
            const bank = bankData[key];
            const item = document.createElement('div');
            item.classList.add('custom-dropdown-item');
            item.setAttribute('data-value', key);
            item.innerHTML = `<span class="bank-name">${bank.name}</span><span class="bank-vbdi">${bank.vbdi}</span>`;
            item.addEventListener('click', () => {
                selectCustomBank(key, bank.name, bank.vbdi);
                customBankDropdownMenu.classList.remove('show');
            });
            customBankDropdownMenu.appendChild(item);
        }
    }

    // Close custom bank dropdown if clicked outside
    document.body.addEventListener('click', (event: MouseEvent) => {
        const targetElement = event.target as HTMLElement;
        if (!customBankSelectDisplay.contains(targetElement) && !customBankDropdownMenu.contains(targetElement)) {
            customBankDropdownMenu.classList.remove('show');
        }
    });

    // Event listener for bank selection changes
    bankSelect.addEventListener("change", function () {
        const selectedBank = this.value;
        const bank = bankData[selectedBank];
        if (bank) {
            vbdiDisplayLabel.textContent = bank.vbdi;
            customBankSelectDisplay.textContent = bank.name; // Update custom display
        } else {
            vbdiDisplayLabel.textContent = "";
            customBankSelectDisplay.textContent = "-- Select a Bank --"; // Reset custom display
        }
        ibanErrorLabel.style.display = "none";
        generateIBAN();
    });
});
