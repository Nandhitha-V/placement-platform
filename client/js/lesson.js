// lesson.js — fetches and displays a single lesson

const params = new URLSearchParams(window.location.search);
const lessonId = params.get("id");

const container = document.getElementById("lessonContainer");

async function loadLesson() {
  if (!lessonId) {
    container.innerHTML = "<p>No lesson selected.</p>";
    return;
  }

  try {
    const response = await fetch(`http://localhost:5000/api/lessons/${lessonId}`);
    const lesson = await response.json();

    if (!response.ok) {
      container.innerHTML = `<p>Error: ${lesson.message}</p>`;
      return;
    }

    container.innerHTML = `
      <p class="breadcrumb">${lesson.course.category.name} / ${lesson.course.title}</p>
      <h1>${lesson.title}</h1>
      <div class="lesson-content">
        <p>${lesson.content}</p>
      </div>
      <div id="animationSlot"></div>
    `;

    // Only render the array animation for lessons titled "Arrays"
    // (Later, we can generalize this with a proper "animation type" field)
    if (lesson.title === "Arrays") {
      renderArrayAnimation();
    }
  } catch (error) {
    container.innerHTML = "<p>Something went wrong. Is the server running?</p>";
  }
}

// Builds and wires up the interactive array visualization
function renderArrayAnimation() {
  const slot = document.getElementById("animationSlot");

  slot.innerHTML = `
    <div class="array-widget">
      <h3>Try it: Array Visualization</h3>
      <div class="array-track" id="arrayTrack"></div>

      <div class="array-controls">
        <input type="text" id="insertValue" placeholder="Value to insert" />
        <button id="insertBtn">Insert</button>

        <input type="number" id="accessIndex" placeholder="Index to access" />
        <button id="accessBtn">Access</button>
      </div>

      <p class="array-note" id="arrayNote"></p>
    </div>
  `;

  // Our in-memory array data — starts with a few example values
  let arr = [10, 20, 30];

  const track = document.getElementById("arrayTrack");
  const note = document.getElementById("arrayNote");

  // Renders the current state of `arr` as visual boxes
  function draw() {
    track.innerHTML = arr
      .map(
        (val, i) => `
        <div class="array-box" data-index="${i}">
          <div class="array-value">${val}</div>
          <div class="array-index">${i}</div>
        </div>
      `
      )
      .join("");
  }

  draw(); // initial render

  document.getElementById("insertBtn").addEventListener("click", () => {
    const value = document.getElementById("insertValue").value;
    if (value === "") {
      note.textContent = "Enter a value first.";
      return;
    }

    arr.push(value); // add to the end — mirrors real array append behavior
    draw();

    // Briefly highlight the newly added box to draw attention to it
    const boxes = document.querySelectorAll(".array-box");
    const newBox = boxes[boxes.length - 1];
    newBox.classList.add("just-added");
    setTimeout(() => newBox.classList.remove("just-added"), 600);

    note.textContent = `Inserted "${value}" at index ${arr.length - 1}.`;
    document.getElementById("insertValue").value = "";
  });

  document.getElementById("accessBtn").addEventListener("click", () => {
    const index = parseInt(document.getElementById("accessIndex").value);

    if (isNaN(index) || index < 0 || index >= arr.length) {
      note.textContent = `Index out of bounds. Valid range: 0 to ${arr.length - 1}.`;
      return;
    }

    // Remove any previous highlight, then highlight the accessed box
    document.querySelectorAll(".array-box").forEach((b) => b.classList.remove("highlighted"));
    const box = document.querySelector(`.array-box[data-index="${index}"]`);
    box.classList.add("highlighted");

    note.textContent = `arr[${index}] = ${arr[index]} — accessed instantly (O(1) time).`;
  });
}

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    content: {
      type: String,
      required: true,
    },
    hasAnimation: {
      type: Boolean,
      default: false,
    },
    // Reserved for future AI-narrated video lessons — not used yet
    videoUrl: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);


loadLesson();