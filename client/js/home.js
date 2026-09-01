// home.js — shows all available categories, regardless of progress

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (!token) {
  window.location.href = "login.html";
}

const container = document.getElementById("homeContainer");

async function loadHome() {
  try {
    const response = await fetch("http://localhost:5000/api/categories");
    const categories = await response.json();

    container.innerHTML = `
      <h2>Welcome back, ${user.name}</h2>
      <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">
        Explore everything available on the platform.
      </p>
      <div class="lessons-grid">
        ${categories
          .map(
            (cat) => `
          <a href="courses.html?categoryId=${cat._id}&categoryName=${encodeURIComponent(cat.name)}" class="lesson-card">
            <h3>${cat.icon} ${cat.name}</h3>
            <p>${cat.description}</p>
          </a>
        `
          )
          .join("")}
      </div>
    `;
  } catch (error) {
    container.innerHTML = "<p>Something went wrong. Is the server running?</p>";
  }
}

loadHome();