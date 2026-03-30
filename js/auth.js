// ============================================
// TaskNest - Auth JS
// ============================================

// ---- SIGNUP FLOW ----
let currentStep = 1;
const totalSteps = 3;

function nextStep() {
  if (currentStep === 1) {
    const name  = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();

    if (!name) { showFieldError('nameError', 'Please enter your full name'); return; }
    else hideFieldError('nameError');

    if (!email || !isValidEmail(email)) { showFieldError('emailError', 'Enter a valid email address'); return; }
    else hideFieldError('emailError');
  }

  if (currentStep === 2) {
    const pass    = document.getElementById('signupPassword').value;
    const confirm = document.getElementById('signupConfirm').value;

    if (pass.length < 6) { showFieldError('passError', 'Password must be at least 6 characters'); return; }
    else hideFieldError('passError');

    if (pass !== confirm) { showFieldError('confirmError', 'Passwords do not match'); return; }
    else hideFieldError('confirmError');
  }

  if (currentStep < totalSteps) {
    currentStep++;
    updateStepUI();
  }
}

function prevStep() {
  if (currentStep > 1) {
    currentStep--;
    updateStepUI();
  }
}

function updateStepUI() {
  // Show/hide steps
  document.querySelectorAll('.form-step').forEach((el, i) => {
    el.classList.toggle('active', i + 1 === currentStep);
  });

  // Update step dots
  document.querySelectorAll('.step-dot').forEach((dot, i) => {
    dot.classList.remove('active', 'done');
    if (i + 1 === currentStep) dot.classList.add('active');
    if (i + 1 < currentStep)  dot.classList.add('done');
    dot.textContent = i + 1 < currentStep ? '✓' : (i + 1);
  });

  // Update step lines
  document.querySelectorAll('.step-line').forEach((line, i) => {
    line.classList.toggle('done', i + 1 < currentStep);
  });

  // Populate review
  if (currentStep === 3) populateReview();
}

function populateReview() {
  const name  = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();

  const reviewEl = document.getElementById('reviewBox');
  if (reviewEl) {
    reviewEl.innerHTML = `
      <div class="review-row"><span class="key">Name</span><span class="val">${escapeHtmlAuth(name)}</span></div>
      <div class="review-row"><span class="key">Email</span><span class="val">${escapeHtmlAuth(email)}</span></div>
      <div class="review-row"><span class="key">Password</span><span class="val">••••••••</span></div>
    `;
  }
}

function submitForm() {
  const name  = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const pass  = document.getElementById('signupPassword').value;

  const user = { name, email, password: pass };
  localStorage.setItem('tasknest_user', JSON.stringify(user));
  localStorage.setItem('tasknest_logged_in', '1');

  // Animate success
  const card = document.querySelector('.auth-card');
  if (card) {
    card.innerHTML = `
      <div style="text-align:center;padding:24px 0">
        <div style="font-size:64px;margin-bottom:16px;animation:bounceIn 0.5s ease">🎉</div>
        <h2 style="font-family:'Plus Jakarta Sans',sans-serif;font-size:24px;font-weight:800;margin-bottom:8px">Welcome, ${escapeHtmlAuth(name)}!</h2>
        <p style="color:var(--text-muted);font-size:14px;margin-bottom:24px">Your account is ready. Let's get productive!</p>
        <a href="index.html" style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#7c3aed,#5b21b6);color:white;border-radius:12px;text-decoration:none;font-weight:700;font-size:15px;">Go to Dashboard →</a>
      </div>`;
  }
}

// ---- PASSWORD STRENGTH ----
function checkPasswordStrength() {
  const pass = document.getElementById('signupPassword').value;
  const segs = document.querySelectorAll('.strength-segment');
  const lbl  = document.getElementById('strengthLabel');

  let strength = 0;
  if (pass.length >= 6)                    strength++;
  if (pass.length >= 10)                   strength++;
  if (/[A-Z]/.test(pass))                  strength++;
  if (/[0-9]/.test(pass))                  strength++;
  if (/[^A-Za-z0-9]/.test(pass))          strength++;

  let level = 'weak';
  let label = '';
  let filled = 0;
  if (strength <= 1)      { level = 'weak';   label = 'Weak';   filled = 1; }
  else if (strength <= 3) { level = 'fair';   label = 'Fair';   filled = 2; }
  else                    { level = 'strong'; label = 'Strong'; filled = 3; }

  segs.forEach((seg, i) => {
    seg.classList.remove('filled', 'weak', 'fair', 'strong');
    if (i < filled) seg.classList.add('filled', level);
  });

  if (lbl) {
    lbl.textContent = pass.length > 0 ? label : '';
    lbl.className = `strength-label ${level}`;
  }
}

// ---- LOGIN ----
function login() {
  const email = document.getElementById('loginEmail').value.trim();
  const pass  = document.getElementById('loginPassword').value;
  const btn   = document.getElementById('loginBtn');

  hideFieldError('loginEmailError');
  hideFieldError('loginPassError');

  if (!email) { showFieldError('loginEmailError', 'Email is required'); return; }
  if (!isValidEmail(email)) { showFieldError('loginEmailError', 'Invalid email format'); return; }
  if (!pass) { showFieldError('loginPassError', 'Password is required'); return; }

  const stored = JSON.parse(localStorage.getItem('tasknest_user') || 'null');

  if (btn) {
    btn.textContent = 'Signing in...';
    btn.disabled = true;
  }

  setTimeout(() => {
    if (stored && stored.email === email && stored.password === pass) {
      localStorage.setItem('tasknest_logged_in', '1');
      window.location.href = 'index.html';
    } else {
      showFieldError('loginPassError', 'Invalid email or password');
      if (btn) {
        btn.textContent = 'Sign In';
        btn.disabled = false;
      }
      // Shake animation
      const card = document.querySelector('.auth-card');
      if (card) {
        card.style.animation = 'shake 0.4s ease';
        setTimeout(() => card.style.animation = '', 400);
      }
    }
  }, 600);
}

function togglePasswordVisibility(inputId, btnId) {
  const input = document.getElementById(inputId);
  const btn   = document.getElementById(btnId);
  if (!input || !btn) return;

  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = '🙈';
  } else {
    input.type = 'password';
    btn.textContent = '👁';
  }
}

// ---- HELPERS ----
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFieldError(id, message) {
  const el = document.getElementById(id);
  if (el) { el.textContent = message; el.classList.add('show'); }
}

function hideFieldError(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('show');
}

function escapeHtmlAuth(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// Enter key support for login
document.addEventListener('DOMContentLoaded', () => {
  const loginPass = document.getElementById('loginPassword');
  if (loginPass) loginPass.addEventListener('keydown', e => { if (e.key === 'Enter') login(); });

  const loginEmail = document.getElementById('loginEmail');
  if (loginEmail) loginEmail.addEventListener('keydown', e => { if (e.key === 'Enter') { document.getElementById('loginPassword').focus(); } });

  // Add shake keyframe
  const style = document.createElement('style');
  style.textContent = `
    @keyframes bounceIn {
      0%   { transform: scale(0); opacity: 0; }
      60%  { transform: scale(1.15); }
      100% { transform: scale(1); opacity: 1; }
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%, 60%  { transform: translateX(-8px); }
      40%, 80%  { transform: translateX(8px); }
    }
  `;
  document.head.appendChild(style);
});