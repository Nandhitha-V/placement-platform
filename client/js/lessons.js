// lessons.js — fetches and lists all lessons

const container = document.getElementById("lessonsContainer");

async function loadLessons() {
  try {
    const response = await fetch("http://localhost:5000/api/lessons");
    const lessons = await response.json();

    if (!response.ok) {
      container.innerHTML = `<p>Error loading lessons.</p>`;
      return;
    }

    container.innerHTML = `
      <h2>DSA Fundamentals</h2>
      <div class="lessons-grid">
        ${lessons
          .map(
            (lesson) => `
          <a href="lesson.html?id=${lesson._id}" class="lesson-card">
            <h3>${lesson.title}</h3>
            <p>${lesson.content.substring(0, 80)}...</p>
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

loadLessons();