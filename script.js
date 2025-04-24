const initialQuestions = [
  {
    id: 1,
    text: "What is the primary purpose of the HTML language?",
    source: "Alex",
    category: "html",
  },
  {
    id: 2,
    text: "How does CSS help in web development?",
    source: "Martin",
    category: "css",
  },
  {
    id: 3,
    text: "Why is JavaScript considered the backbone of modern web development?",
    source: "Mihail",
    category: "javascript",
  },
  {
    id: 4,
    text: "What are the main advantages of using React for frontend development?",
    source: "Georgi",
    category: "react",
  },
];

const CATEGORIES = [
  { name: "html", color: "#ff5722" },
  { name: "css", color: "#2196f3" },
  { name: "javascript", color: "#ffeb3b" },
  { name: "react", color: "#61dafb" },
  { name: "nextjs", color: "#1a1a1a" },
];

const headers = {
  "Content-Type": "application/json",
  apikey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzdWNmYnZiY2J1bGxoenF5bGV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5NjU1MDEsImV4cCI6MjA1OTU0MTUwMX0.bMEVES5cV9s1Nnerx1uDAkJtCNFNeyed56mcsFp_yzU",
  Authorization:
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzdWNmYnZiY2J1bGxoenF5bGV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5NjU1MDEsImV4cCI6MjA1OTU0MTUwMX0.bMEVES5cV9s1Nnerx1uDAkJtCNFNeyed56mcsFp_yzU",
};

const btnAskQuestion = document.querySelector(".btn-open");
const form = document.querySelector(".form");
const questionsList = document.querySelector(".questions");
const btnCategories = document.querySelectorAll(".category .btn");
const btnPostQuestion = document.querySelector(".btn-post");

getQuestions();

async function getQuestions(category = "all") {
  const res = await fetch(
    "https://zsucfbvbcbullhzqyley.supabase.co/rest/v1/question",
    { headers }
  );

  let data = await res.json();
  if (category !== "all") {
    data = data.filter((question) => question.category === category);
  }
  createQuestionsList(data);
}

function createQuestionsList(questions) {
  questionsList.innerHTML = "";

  questions.forEach((question) =>
    questionsList.insertAdjacentHTML(
      "beforeend",
      `<li class="question">
        <p>
           ${question.text}
           <a class="source" target="_blank">${question.source}</a>
       </p>
        <span class="tag" style="background-color: ${
          CATEGORIES.find((category) => category.name === question.category)
            .color
        }">${question.category}</span>
      </li>`
    )
  );
}

btnAskQuestion.addEventListener("click", function () {
  if (form.classList.contains("hidden")) {
    form.classList.remove("hidden");
    btnAskQuestion.textContent = "Close";
  } else {
    form.classList.add("hidden");
    btnAskQuestion.textContent = "Ask a question";
  }
});

btnCategories.forEach((btn) =>
  btn.addEventListener("click", function () {
    const category = btn.textContent.toLowerCase().trim().replace(".", "");
    getQuestions(category);
  })
);

btnPostQuestion.addEventListener("click", async function (e) {
  e.preventDefault();
  const questionTextEl = document.querySelector(".question-text");
  const questionSourceEl = document.querySelector(".question-source");
  const questionCategoryEl = document.querySelector(".question-category");

  if (
    !questionTextEl.value ||
    !questionSourceEl.value ||
    !questionCategoryEl.value
  ) {
    alert("Please fill all fields!");
    return;
  }

  const res = await fetch(
    "https://zsucfbvbcbullhzqyley.supabase.co/rest/v1/question",
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        text: questionTextEl.value,
        source: questionSourceEl.value,
        category: questionCategoryEl.value,
      }),
    }
  );

  if (res.ok) {
    questionTextEl.value = "";
    questionSourceEl.value = "";
    questionCategoryEl.value = "";
    form.classList.add("hidden");
    btnAskQuestion.textContent = "Ask a question";
    await getQuestions();
  } else {
    alert("Something went wrong!");
  }
});
