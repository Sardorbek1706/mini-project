const defaultUsers = [
  { firstName: "Ahmad", lastName: "Aliyev", email: "ahmad@email.com", password: "123456" },
  { firstName: "Madina", lastName: "Karimova", email: "madina@email.com", password: "password" },
  { firstName: "Bobur", lastName: "Rahimov", email: "bobur@email.com", password: "qwerty" }
];

const STORAGE_KEY = 'users_db';
function loadUsers() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers));
    return [...defaultUsers];
  }
  try {
    return JSON.parse(saved) || [...defaultUsers];
  } catch (e) {
    console.warn('Users parse error', e);
    return [...defaultUsers];
  }
}
function saveUsers(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

let users = loadUsers();
function validateEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(String(email).toLowerCase());
}
function validateName(name) {
  return /^[\p{L}\s'\-]{2,}$/u.test(String(name).trim());
}
function validatePassword(password) {
  return String(password).length >= 6;
}
function showFieldError(inputEl, message) {
  if (!inputEl) return;
  inputEl.classList.add('error');
  const msgEl = document.getElementById(inputEl.id + 'Error');
  if (msgEl) {
    msgEl.textContent = message;
    msgEl.style.display = 'block';
  }
}
function clearFieldError(inputEl) {
  if (!inputEl) return;
  inputEl.classList.remove('error');
  const msgEl = document.getElementById(inputEl.id + 'Error');
  if (msgEl) {
    msgEl.textContent = '';
    msgEl.style.display = 'none';
  }
}

function showLoading(button) {
  if (!button) return;
  button.dataset._text = button.innerHTML;
  button.innerHTML = 'Yuklanmoqda...';
  button.disabled = true;
}
function hideLoading(button) {
  if (!button) return;
  button.innerHTML = button.dataset._text || 'OK';
  button.disabled = false;
}

function showSuccessMessage(message) {
  const alertDiv = document.createElement('div');
  alertDiv.className = 'alert success';
  alertDiv.textContent = message;
  document.getElementById('alerts').prepend(alertDiv);
  setTimeout(() => alertDiv.remove(), 4000);
}
function showErrorMessage(message) {
  const alertDiv = document.createElement('div');
  alertDiv.className = 'alert error';
  alertDiv.textContent = message;
  document.getElementById('alerts').prepend(alertDiv);
  setTimeout(() => alertDiv.remove(), 5000);
}
const firstNameEl = document.getElementById('firstName');
const lastNameEl = document.getElementById('lastName');
const sEmailEl = document.getElementById('signupEmail');
const sPassEl = document.getElementById('signupPassword');
const cPassEl = document.getElementById('confirmPassword');

const signupForm = document.getElementById('signupForm');
const signupBtn = document.getElementById('signupBtn');

const loginForm = document.getElementById('loginForm');
const loginBtn = document.getElementById('loginBtn');
const lEmailEl = document.getElementById('loginEmail');
const lPassEl = document.getElementById('loginPassword');
[firstNameEl, lastNameEl].forEach(el => {
  if (!el) return;
  el.addEventListener('input', function () {
    const val = this.value.trim();
    if (!validateName(val)) {
      showFieldError(this, 'Kamida 2 ta harf kiriting');
    } else {
      clearFieldError(this);
    }
  });
});

if (sEmailEl) {
  sEmailEl.addEventListener('input', function () {
    const val = this.value.trim();
    if (!validateEmail(val)) {
      showFieldError(this, "Email formati noto'g'ri");
    } else {
      clearFieldError(this);
    }
  });
}

function validateSignupPasswordFields() {
  const pwd = sPassEl.value;
  const conf = cPassEl.value;
  let ok = true;

  if (!validatePassword(pwd)) {
    showFieldError(sPassEl, "Parol kamida 6 belgidan iborat bo'lsin");
    ok = false;
  } else {
    clearFieldError(sPassEl);
  }

  if (conf.length === 0) {
    showFieldError(cPassEl, 'Parolni tasdiqlang');
    ok = false;
  } else if (pwd !== conf) {
    showFieldError(cPassEl, 'Parollar mos kelmadi');
    ok = false;
  } else {
    clearFieldError(cPassEl);
  }
  return ok;
}

if (sPassEl) sPassEl.addEventListener('input', validateSignupPasswordFields);
if (cPassEl) cPassEl.addEventListener('input', validateSignupPasswordFields);
if (signupForm) {
  signupForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const firstName = firstNameEl.value.trim();
    const lastName = lastNameEl.value.trim();
    const email = sEmailEl.value.trim().toLowerCase();
    const password = sPassEl.value;
    const confirmPassword = cPassEl.value;

    let valid = true;
    if (!validateName(firstName)) {
      showFieldError(firstNameEl, 'Ism kamida 2 ta harf');
      valid = false;
    }
    if (!validateName(lastName)) {
      showFieldError(lastNameEl, 'Familiya kamida 2 ta harf');
      valid = false;
    }
    if (!validateEmail(email)) {
      showFieldError(sEmailEl, "Email formati noto'g'ri");
      valid = false;
    }
    if (!validateSignupPasswordFields()) valid = false;

    if (!valid) {
      showErrorMessage("Iltimos, maydonlarni to'g'ri to'ldiring.");
      return;
    }

    const exists = users.some(u => u.email.toLowerCase() === email);
    if (exists) {
      showFieldError(sEmailEl, "Bu email allaqachon ro'yxatda mavjud");
      showErrorMessage("Bu email bilan avval ro'yxatdan o'tilgan.");
      return;
    }

    const newUser = { firstName, lastName, email, password };
    showLoading(signupBtn);
    setTimeout(() => {
      users.push(newUser);
      saveUsers(users);
      hideLoading(signupBtn);

      const signupSuccess = document.getElementById('signupSuccess');
      if (signupSuccess) {
        signupSuccess.style.display = 'block';
        signupSuccess.textContent = "Muvaffaqiyatli ro'yxatdan o'tdingiz!";
      }
      showSuccessMessage("Ro'yxatdan o'tish muvaffaqiyatli.");
      signupForm.reset();
    }, 700);
  });
}
if (loginForm) {
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = lEmailEl.value.trim().toLowerCase();
    const password = lPassEl.value;

    let ok = true;
    if (!validateEmail(email)) {
      showFieldError(lEmailEl, "Email noto'g'ri");
      ok = false;
    } else {
      clearFieldError(lEmailEl);
    }
    if (!validatePassword(password)) {
      showFieldError(lPassEl, 'Parol kamida 6 belgi');
      ok = false;
    } else {
      clearFieldError(lPassEl);
    }
    if (!ok) {
      showErrorMessage("Login ma'lumotlarini tekshiring.");
      return;
    }

    const user = users.find(u => u.email.toLowerCase() === email);
    showLoading(loginBtn);
    setTimeout(() => {
      hideLoading(loginBtn);
      if (!user) {
        showErrorMessage('Bunday email topilmadi');
        return;
      }
      if (user.password !== password) {
        showErrorMessage("Email yoki parol noto'g'ri");
        return;
      }

      const loginSuccess = document.getElementById('loginSuccess');
      if (loginSuccess) {
        loginSuccess.style.display = 'block';
        loginSuccess.textContent = `Xush kelibsiz, ${user.firstName}!`;
      }
      showSuccessMessage('Muvaffaqiyatli kirdingiz!');
    }, 500);
  });
}
