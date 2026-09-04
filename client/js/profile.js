const token = localStorage.getItem("token");
let user = JSON.parse(localStorage.getItem("user"));

if (!token) {
  window.location.href = "login.html";
}

// Pre-fill the form with current info
document.getElementById("profileName").value = user.name;
document.getElementById("profileEmail").value = user.email;

// --- Update profile (name) ---
document.getElementById("profileForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const msg = document.getElementById("profileMsg");
  msg.textContent = "";
  msg.style.color = "";

  const name = document.getElementById("profileName").value;

  try {
    const response = await fetch("http://localhost:5000/api/auth/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });

    const data = await response.json();

    if (!response.ok) {
      msg.textContent = data.message || "Update failed";
      return;
    }

    // Update localStorage so the navbar/dashboard reflect the new name immediately
    user = { ...user, name: data.name };
    localStorage.setItem("user", JSON.stringify(user));

    msg.style.color = "var(--accent-primary)";
    msg.textContent = "Profile updated successfully.";
  } catch (error) {
    msg.textContent = "Something went wrong.";
  }
});

// --- Change password ---
document.getElementById("passwordForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const msg = document.getElementById("passwordMsg");
  msg.textContent = "";
  msg.style.color = "";

  const currentPassword = document.getElementById("currentPassword").value;
  const newPassword = document.getElementById("newPassword").value;

  try {
    const response = await fetch("http://localhost:5000/api/auth/change-password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      msg.textContent = data.message || "Password update failed";
      return;
    }

    msg.style.color = "var(--accent-primary)";
    msg.textContent = "Password updated successfully.";
    document.getElementById("passwordForm").reset();
  } catch (error) {
    msg.textContent = "Something went wrong.";
  }
});

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "login.html";
}