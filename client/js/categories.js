const container = document.getElementById("categoriesContainer");

async function loadCategories() {
  try {
    const response = await fetch("http://localhost:5000/api/categories");
    const categories = await response.json();

    container.innerHTML = `
      <h2>Choose a Category</h2>
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

loadCategories();