const params = new URLSearchParams(window.location.search);
const courseId = params.get("courseId");
const courseName = params.get("courseName");
const categoryId = params.get("categoryId");
const categoryName = params.get("categoryName");

const container = document.getElementById("lessonsContainer");

async function loadLessons() {
  try {
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
      <nav class="breadcrumb-nav">
        <a href="home.html">Home</a>
        <span class="separator">›</span>
        <a href="courses.html?categoryId=${categoryId}&categoryName=${encodeURIComponent(categoryName || "")}">${categoryName || "Category"}</a>
        <span class="separator">›</span>
        <span class="current">${courseName || "Course"}</span>
      </nav>
      <h2>${courseName || "All Lessons"}</h2>
      <div class="lessons-grid">
        ${lessons
          .map(
            (lesson) => `
          <a href="lesson.html?id=${lesson._id}&courseId=${courseId}&courseName=${encodeURIComponent(courseName || "")}&categoryId=${categoryId}&categoryName=${encodeURIComponent(categoryName || "")}" class="lesson-card">
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