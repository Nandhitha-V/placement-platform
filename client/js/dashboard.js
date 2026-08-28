// dashboard.js — fetches and displays the user's real progress

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

// Basic protection: no token means not logged in
if (!token) {
  window.location.href = "login.html";
}

const container = document.getElementById("dashboardContainer");

async function loadDashboard() {
  try {
    const response = await fetch("http://localhost:5000/api/progress/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      container.innerHTML = `<p>Error: ${data.message}</p>`;
      return;
    }

    renderDashboard(data);
  } catch (error) {
    container.innerHTML = "<p>Something went wrong loading your dashboard.</p>";
  }
}

function renderDashboard(data) {
  container.innerHTML = `
    <h2>Good to see you, ${user.name}!</h2>

    <div class="stats-grid">
      <div class="stat-card">
        <p class="stat-number">${data.lessonsCompleted} / ${data.totalLessons}</p>
        <p class="stat-label">Lessons Completed</p>
      </div>
      <div class="stat-card">
        <p class="stat-number">${data.accuracy}%</p>
        <p class="stat-label">Overall Accuracy</p>
      </div>
    </div>

    <h3>Your Progress</h3>
    <div class="progress-list">
      ${
        data.lessonProgress.length === 0
          ? "<p>You haven't attempted any lessons yet. Let's fix that!</p>"
          : data.lessonProgress
              .map(
                (p) => `
          <div class="progress-item">
            <span>${p.lessonTitle}</span>
            <span class="progress-score">${p.score} / ${p.totalQuestions}</span>
          </div>
        `
              )
              .join("")
      }
    </div>

    <a href="categories.html" class="btn-primary" style="display:inline-block; margin-top: 1.5rem;">
      Continue Learning
    </a>
  `;
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "login.html";
}

loadDashboard();