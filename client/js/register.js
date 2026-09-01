// register.js — handles the register form submission

const form = document.getElementById("registerForm");
const errorMsg = document.getElementById("errorMsg");

// Listen for the form's submit event
form.addEventListener("submit", async (e) => {
  // Prevent the browser's default behavior (reloading the page on submit)
  e.preventDefault();
  errorMsg.textContent = "";

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    // fetch() sends an HTTP request to our backend
    const response = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // tells the server we're sending JSON
      },
      body: JSON.stringify({ name, email, password }), // convert JS object to JSON text
    });

    const data = await response.json(); // parse the server's JSON response

    if (!response.ok) {
      // response.ok is false for status codes like 400, 500
      errorMsg.textContent = data.message || "Registration failed";
      return;
    }

    // Success — store the token so we stay "logged in"
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify({ name: data.name, email: data.email }));

    // Redirect to a dashboard (we'll build this next)
    window.location.href = "home.html";
  } catch (error) {
    errorMsg.textContent = "Something went wrong. Is the server running?";
  }
});