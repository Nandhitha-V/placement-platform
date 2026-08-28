// lesson.js — fetches and displays a single lesson, plus its quiz

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
      <div id="quizSlot"></div>
    `;

    if (lesson.title === "Arrays") {
      renderArrayAnimation();
    } else if (lesson.title === "Stacks") {
      renderStackAnimation();
    } else if (lesson.title === "Queues") {
      renderQueueAnimation();
    } else if (lesson.title === "Percentages") {
      renderPercentageCalculator();
    }

    loadQuiz(lessonId);
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

  let arr = [10, 20, 30];

  const track = document.getElementById("arrayTrack");
  const note = document.getElementById("arrayNote");

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

  draw();

  document.getElementById("insertBtn").addEventListener("click", () => {
    const value = document.getElementById("insertValue").value;
    if (value === "") {
      note.textContent = "Enter a value first.";
      return;
    }

    arr.push(value);
    draw();

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

    document.querySelectorAll(".array-box").forEach((b) => b.classList.remove("highlighted"));
    const box = document.querySelector(`.array-box[data-index="${index}"]`);
    box.classList.add("highlighted");

    note.textContent = `arr[${index}] = ${arr[index]} — accessed instantly (O(1) time).`;
  });
}

// Builds and wires up the interactive stack visualization
function renderStackAnimation() {
  const slot = document.getElementById("animationSlot");

  slot.innerHTML = `
    <div class="array-widget">
      <h3>Try it: Stack Visualization</h3>
      <div class="stack-track" id="stackTrack"></div>

      <div class="array-controls">
        <input type="text" id="pushValue" placeholder="Value to push" />
        <button id="pushBtn">Push</button>
        <button id="popBtn">Pop</button>
      </div>

      <p class="array-note" id="stackNote"></p>
    </div>
  `;

  let stack = [5, 15, 25]; // bottom to top: 5 is at the bottom, 25 is on top

  const track = document.getElementById("stackTrack");
  const note = document.getElementById("stackNote");

  function draw() {
    // We render in REVERSE so the top of the stack visually appears at the top of the screen
    track.innerHTML = [...stack]
      .reverse()
      .map(
        (val, i) => `
        <div class="stack-box ${i === 0 ? "top-box" : ""}">
          ${val} ${i === 0 ? '<span class="top-label">← top</span>' : ""}
        </div>
      `
      )
      .join("");
  }

  draw();

  document.getElementById("pushBtn").addEventListener("click", () => {
    const value = document.getElementById("pushValue").value;
    if (value === "") {
      note.textContent = "Enter a value first.";
      return;
    }

    stack.push(value); // JS arrays already have push/pop built in — matches the concept directly
    draw();

    note.textContent = `Pushed "${value}" onto the stack.`;
    document.getElementById("pushValue").value = "";
  });

  document.getElementById("popBtn").addEventListener("click", () => {
    if (stack.length === 0) {
      note.textContent = "Stack is empty — nothing to pop.";
      return;
    }

    const removed = stack.pop();
    draw();
    note.textContent = `Popped "${removed}" from the top.`;
  });
}


// Builds and wires up the interactive queue visualization
function renderQueueAnimation() {
  const slot = document.getElementById("animationSlot");

  slot.innerHTML = `
    <div class="array-widget">
      <h3>Try it: Queue Visualization</h3>
      <div class="array-track" id="queueTrack"></div>

      <div class="array-controls">
        <input type="text" id="enqueueValue" placeholder="Value to enqueue" />
        <button id="enqueueBtn">Enqueue</button>
        <button id="dequeueBtn">Dequeue</button>
      </div>

      <p class="array-note" id="queueNote"></p>
    </div>
  `;

  let queue = [7, 14, 21]; // front is index 0, back is the last index

  const track = document.getElementById("queueTrack");
  const note = document.getElementById("queueNote");

  function draw() {
    track.innerHTML = queue
      .map(
        (val, i) => `
        <div class="array-box ${i === 0 ? "highlighted" : ""}">
          <div class="array-value">${val}</div>
          <div class="array-index">${i === 0 ? "front" : i === queue.length - 1 ? "back" : ""}</div>
        </div>
      `
      )
      .join("");
  }

  draw();

  document.getElementById("enqueueBtn").addEventListener("click", () => {
    const value = document.getElementById("enqueueValue").value;
    if (value === "") {
      note.textContent = "Enter a value first.";
      return;
    }

    queue.push(value); // add to the back
    draw();

    const boxes = document.querySelectorAll("#queueTrack .array-box");
    const newBox = boxes[boxes.length - 1];
    newBox.classList.add("just-added");
    setTimeout(() => newBox.classList.remove("just-added"), 600);

    note.textContent = `Enqueued "${value}" at the back.`;
    document.getElementById("enqueueValue").value = "";
  });

  document.getElementById("dequeueBtn").addEventListener("click", () => {
    if (queue.length === 0) {
      note.textContent = "Queue is empty — nothing to dequeue.";
      return;
    }

    const removed = queue.shift(); // remove from the front
    draw();
    note.textContent = `Dequeued "${removed}" from the front.`;
  });
}

// A live percentage calculator — the "animation equivalent" for a math-based lesson
function renderPercentageCalculator() {
  const slot = document.getElementById("animationSlot");

  slot.innerHTML = `
    <div class="array-widget">
      <h3>Try it: Percentage Calculator</h3>
      <p style="color: var(--text-secondary); margin-bottom: 1rem; font-size: 0.9rem;">
        Find what X% of Y is — see the formula applied live.
      </p>

      <div class="array-controls">
        <input type="number" id="percentInput" placeholder="Percentage (e.g. 40)" />
        <span style="align-self:center;">% of</span>
        <input type="number" id="wholeInput" placeholder="Whole number (e.g. 250)" />
      </div>

      <button id="calcBtn" style="margin-top: 0.5rem;">Calculate</button>

      <p class="array-note" id="calcResult"></p>
    </div>
  `;

  document.getElementById("calcBtn").addEventListener("click", () => {
    const percent = parseFloat(document.getElementById("percentInput").value);
    const whole = parseFloat(document.getElementById("wholeInput").value);
    const result = document.getElementById("calcResult");

    if (isNaN(percent) || isNaN(whole)) {
      result.textContent = "Enter both values first.";
      return;
    }

    const answer = (percent * whole) / 100;

    result.innerHTML = `
      (${percent} × ${whole}) / 100 = <strong style="color: var(--accent-primary);">${answer}</strong>
    `;
  });
}
// ----------------------
// QUIZ SECTION
// ----------------------

async function loadQuiz(lessonId) {
  const quizSlot = document.getElementById("quizSlot");

  try {
    const response = await fetch(`http://localhost:5000/api/questions/lesson/${lessonId}`);
    const questions = await response.json();

    if (!response.ok || questions.length === 0) {
      quizSlot.innerHTML = "<p>No quiz available for this lesson yet.</p>";
      return;
    }

    // Build the quiz form — one block per question, radio buttons for options
    quizSlot.innerHTML = `
      <div class="quiz-widget">
        <h3>Quick Check</h3>
        <form id="quizForm">
          ${questions
            .map(
              (q, qIndex) => `
            <div class="quiz-question" data-question-id="${q._id}">
              <p class="quiz-question-text">${qIndex + 1}. ${q.questionText}</p>
              ${q.options
                .map(
                  (opt, optIndex) => `
                <label class="quiz-option">
                  <input type="radio" name="q_${q._id}" value="${optIndex}" required />
                  ${opt}
                </label>
              `
                )
                .join("")}
            </div>
          `
            )
            .join("")}
          <button type="submit">Submit Quiz</button>
        </form>
        <div id="quizResults"></div>
      </div>
    `;

    document.getElementById("quizForm").addEventListener("submit", (e) => submitQuiz(e, lessonId));
  } catch (error) {
    quizSlot.innerHTML = "<p>Could not load quiz.</p>";
  }
}

async function submitQuiz(e, lessonId) {
  e.preventDefault();

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please log in to submit the quiz.");
    window.location.href = "login.html";
    return;
  }

  // Gather all selected answers from the form
  const questionBlocks = document.querySelectorAll(".quiz-question");
  const answers = [];

  questionBlocks.forEach((block) => {
    const questionId = block.dataset.questionId;
    const selected = block.querySelector(`input[name="q_${questionId}"]:checked`);
    if (selected) {
      answers.push({ questionId, selectedIndex: parseInt(selected.value) });
    }
  });

  try {
    const response = await fetch("http://localhost:5000/api/questions/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // attach the JWT so the backend knows who's submitting
      },
      body: JSON.stringify({ lessonId, answers }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Submission failed");
      return;
    }

    displayResults(data);
  } catch (error) {
    alert("Something went wrong submitting the quiz.");
  }
}

function displayResults(data) {
  const resultsDiv = document.getElementById("quizResults");

  resultsDiv.innerHTML = `
    <div class="quiz-score">
      Score: ${data.score} / ${data.totalQuestions}
    </div>
    ${data.results
      .map(
        (r) => `
      <div class="quiz-result-item ${r.isCorrect ? "correct" : "incorrect"}">
        <p>${r.questionText}</p>
        <p>${r.isCorrect ? "✅ Correct" : "❌ Incorrect"}</p>
        <p class="quiz-explanation">${r.explanation}</p>
      </div>
    `
      )
      .join("")}
  `;

  // Hide the form now that results are shown
  document.getElementById("quizForm").style.display = "none";
}

loadLesson();