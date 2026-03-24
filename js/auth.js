let currentStep = 0;
const steps = document.querySelectorAll(".form-step");
const progressBar = document.getElementById("progressBar");

function showStep(step) {
  steps.forEach((s, i) => {
    s.classList.toggle("active", i === step);
  });

  progressBar.style.width = `${(step + 1) * 33}%`;
}

function nextStep() {
  if (currentStep === 0) {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    if (!name || !email) {
      alert("Fill all fields");
      return;
    }
  }

  if (currentStep === 1) {
    const pass = document.getElementById("password").value;
    const confirm = document.getElementById("confirmPassword").value;

    if (pass !== confirm) {
      alert("Passwords do not match");
      return;
    }
  }

  currentStep++;
  showStep(currentStep);

  if (currentStep === 2) {
    document.getElementById("review").innerHTML = `
      <strong>Name:</strong> ${name.value}<br>
      <strong>Email:</strong> ${email.value}
    `;
  }
}

function prevStep() {
  currentStep--;
  showStep(currentStep);
}

/* PASSWORD STRENGTH */
const passwordInput = document.getElementById("password");
const strengthText = document.getElementById("strength");

passwordInput.addEventListener("input", () => {
  const val = passwordInput.value;

  if (val.length < 6) {
    strengthText.innerText = "Weak";
    strengthText.style.color = "red";
  } else if (val.match(/[A-Z]/) && val.match(/[0-9]/)) {
    strengthText.innerText = "Strong";
    strengthText.style.color = "green";
  } else {
    strengthText.innerText = "Medium";
    strengthText.style.color = "orange";
  }
});

/* SUBMIT */
function submitForm() {
  const user = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  localStorage.setItem("tasknest_user", JSON.stringify(user));

  alert("Signup Successful!");
  window.location.href = "login.html";
}

/* INIT */
showStep(currentStep);