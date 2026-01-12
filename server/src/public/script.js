const getById = (id) => document.getElementById(id);

const container = getById("container");
const error = getById("error");
const success = getById("success");
const form = getById("form");
const password = getById("password");
const confirmPassword = getById("confirm-password");
const loader = getById("loader");
const button = getById("submit");

error.style.display = "none";
success.style.display = "none";
container.style.display = "none";

let token, userId;

const passRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

window.addEventListener("DOMContentLoaded", async () => {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });

  token = params.token;
  userId = params.userId;

  if (!token || !userId) {
    loader.innerText = "Invalid or expired reset link.";
    return;
  }

  const res = await fetch("/auth/verify-pass-reset-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, userId }),
  });

  if (!res.ok) {
  let message = "Invalid or expired reset link.";

  try {
    const data = await res.json();
    message = data.error || data.message || message;
  } catch (err) {
    // response is not JSON
  }

  loader.innerText = message;
  return;
}


  loader.style.display = "none";
  container.style.display = "block";
});

const displayError = (msg) => {
  success.style.display = "none";
  error.textContent = msg;
  error.style.display = "block";
};

const displaySuccess = (msg) => {
  error.style.display = "none";
  success.textContent = msg;
  success.style.display = "block";
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!password.value.trim()) return displayError("Password is required");

  if (!passRegex.test(password.value))
    return displayError(
      "Password must be strong (uppercase, lowercase, number, symbol)"
    );

  if (password.value !== confirmPassword.value)
    return displayError("Passwords do not match");

  button.disabled = true;
  button.classList.add("busy");
  button.innerText = "Updating...";

  const res = await fetch("/auth/update-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, userId, password: password.value }),
  });

  button.disabled = false;
  button.classList.remove("busy");
  button.innerText = "Reset Password";

  if (!res.ok) {
  let message = "Failed to update password. Please try again.";

  try {
    const data = await res.json();
    message = data.error || data.message || message;
  } catch (err) {}

  return displayError(message);
}

  displaySuccess("Password updated successfully. You may now log in.");
  password.value = "";
  confirmPassword.value = "";
});
