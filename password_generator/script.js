const passwordInput = document.getElementById("password");
const lengthSlider = document.getElementById("length");
const lengthDisplay = document.getElementById("length-value");
const uppercaseCheckbox = document.getElementById("uppercase");
const lowercaseCheckbox = document.getElementById("lowercase");
const numbersCheckbox = document.getElementById("numbers");
const symbolsCheckbox = document.getElementById("symbols");
const generateButton = document.getElementById("generate-btn");
const copyButton = document.getElementById("copy-btn");
const strengthBar = document.querySelector(".strength-bar");
const strengthLabel = document.getElementById("strength-label");
const checkboxWarning = document.getElementById('checkbox-warning');

//所使用到的字符；
const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
const numberCharacters = "0123456789";
const symbolCharacters = "!@#$%^&*()-_=+[]{}|;:,.<>?/";

lengthSlider.addEventListener("input", () => {
  lengthDisplay.textContent = lengthSlider.value;
});

// update generate button enabled state when checkboxes change
[uppercaseCheckbox, lowercaseCheckbox, numbersCheckbox, symbolsCheckbox].forEach(cb => {
  cb.addEventListener('change', updateCheckboxState);
});

function updateCheckboxState(){
  const anyChecked = uppercaseCheckbox.checked || lowercaseCheckbox.checked || numbersCheckbox.checked || symbolsCheckbox.checked;
  generateButton.disabled = !anyChecked;
  if(!anyChecked){
    checkboxWarning.hidden = false;
  } else {
    checkboxWarning.hidden = true;
  }
}

// 给按钮添加事件；
generateButton.addEventListener("click", makePassword);

// allow pressing Enter when focus is on the password input to generate a new one
passwordInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") makePassword();
});

function makePassword() {
  const length = Number(lengthSlider.value);
  const includeUppercase = uppercaseCheckbox.checked;
  const includeLowercase = lowercaseCheckbox.checked;
  const includeNumbers = numbersCheckbox.checked;
  const includeSymbols = symbolsCheckbox.checked;
  // 一定要勾选一种字符类型；
  if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) {
    // show a non-blocking message and abort generation
    alert("Please select at least one character type.");
    return;
  }
  //生成密码；
  const newPassword = createRandomPassword(
    length,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols
  );
  passwordInput.value = newPassword;
  //更新密码强度指示条；
  updateStrengthMeter(newPassword);
}

//生成密码；
function createRandomPassword(
  length,
  includeUppercase,
  includeLowercase,
  includeNumbers,
  includeSymbols
) {
  let allCharacters = "";
  // "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

  if (includeUppercase) allCharacters += uppercaseLetters;
  if (includeLowercase) allCharacters += lowercaseLetters;
  if (includeNumbers) allCharacters += numberCharacters;
  if (includeSymbols) allCharacters += symbolCharacters;

  let password = "";

  if (!allCharacters) {
    return "";
  }

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * allCharacters.length);
    password += allCharacters[randomIndex];
  }
  return password;
}

function updateStrengthMeter(password) {
  const passwordLength = password ? password.length : 0;

  const hasUppercase = /[A-Z]/.test(password || "");
  const hasLowercase = /[a-z]/.test(password || "");
  const hasNumbers = /[0-9]/.test(password || "");
  // escaped - and [] for safe regex
  const hasSymbols = /[!@#$%^&*()\-_=+\[\]{}|;:,.<>?/]/.test(password || "");

  let strengthScore = 0;
  // length contributes up to 40
  strengthScore += Math.min(passwordLength * 2, 40);

  if (hasUppercase) strengthScore += 15;
  if (hasLowercase) strengthScore += 15;
  if (hasNumbers) strengthScore += 15;
  if (hasSymbols) strengthScore += 15;

  if (passwordLength < 8) {
    strengthScore = Math.min(strengthScore, 40);
  }

  const safeScore = Math.max(0, Math.min(100, strengthScore));
  strengthBar.style.width = safeScore + "%";

  let strengthLabelText = "";
  // set class for color styling
  strengthBar.classList.remove('weak','medium','strong');

  if (strengthScore < 40) {
    strengthLabelText = "Weak";
    strengthBar.classList.add('weak');
  } else if (strengthScore < 70) {
    strengthLabelText = "Medium";
    strengthBar.classList.add('medium');
  } else {
    strengthLabelText = "Strong";
    strengthBar.classList.add('strong');
  }

  strengthLabel.textContent = strengthLabelText;
}

window.addEventListener("DOMContentLoaded", () => {
  // initialize length display
  lengthDisplay.textContent = lengthSlider.value;

  // ensure strength shows something
  updateStrengthMeter("");

  // generate initial password
  updateCheckboxState();
  makePassword();
});

copyButton.addEventListener("click", () => {
  if (!passwordInput.value) return;

  navigator.clipboard
    .writeText(passwordInput.value)
    .then(() => showCopySuccess())
    .catch((error) => console.log("Could not copy:", error));
});

function showCopySuccess() {
  // toggle inner icon markup for consistency with our HTML
  const icon = copyButton.querySelector('i');
  if (icon) {
    icon.className = 'fas fa-check';
  } else {
    copyButton.innerHTML = '<i class="fas fa-check"></i>';
  }
  copyButton.style.color = "#48bb78";

  setTimeout(() => {
    if (icon) {
      icon.className = 'far fa-copy';
    } else {
      copyButton.innerHTML = '<i class="far fa-copy"></i>';
    }
    copyButton.style.color = "";
  }, 1500);
}