const params = new URLSearchParams(window.location.search);
const categoryId = params.get("categoryId");
const categoryName = params.get("categoryName");

const container = document.getElementById("coursesContainer");

async function loadCourses() {
  try {
    const response = await fetch(`http://localhost:5000/api/courses?category=${categoryId}`);
    const courses = await response.json();

    container.innerHTML = `
  <nav class="breadcrumb-nav">
    <a href="home.html">Home</a>
    <span class="separator">›</span>
    <span class="current">${categoryName}</span>
  </nav>
  <h2>${categoryName}</h2>
  <div class="lessons-grid">
    ${courses
      .map(
        (course) => `
      <a href="lessons.html?courseId=${course._id}&courseName=${encodeURIComponent(course.title)}&categoryId=${categoryId}&categoryName=${encodeURIComponent(categoryName)}" class="lesson-card">
        <h3>${course.title}</h3>
        <p>${course.description}</p>
      </a>
    `
      )
      .join("")}
  </div>
`;
  } catch (error) {
    container.innerHTML = "<p>Something went wrong.</p>";
  }
}

loadCourses();