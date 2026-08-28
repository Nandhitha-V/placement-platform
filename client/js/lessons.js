const params = new URLSearchParams(window.location.search);
const courseId = params.get("courseId");
const courseName = params.get("courseName");

const container = document.getElementById("lessonsContainer");

async function loadLessons() {
  try {
    // If a courseId is present, filter; otherwise show everything (fallback)
    const url = courseId
      ? `http://localhost:5000/api/lessons?course=${courseId}`
      : `http://localhost:5000/api/lessons`;

    const response = await fetch(url);
    const lessons = await response.json();

    if (!response.ok) {
      container.innerHTML = `<p>Error loading lessons.</p>`;
      return;
    }

    container.innerHTML = `
      <h2>${courseName || "All Lessons"}</h2>
      <div class="lessons-grid">
        ${lessons
          .map(
            (lesson) => `
          <a href="lesson.html?id=${lesson._id}" class="lesson-card">
            <h3>${lesson.title}</h3>
            <p>${lesson.content.replace(/<[^>]*>/g, "").substring(0, 80)}...</p>
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