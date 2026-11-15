const card = document.querySelector("#detection-card");
const pythonComplete = document.querySelector("#python-complete");
const headerStatus = document.querySelector("#header-status");
const headerStatusText = document.querySelector("#header-status-text");
const pageTitle = document.querySelector("#page-title");
const introDescription = document.querySelector(".intro p");
const stateLabel = document.querySelector("#state-label");
const stateTitle = document.querySelector("#state-title");
const stateDescription = document.querySelector("#state-description");
const redetectButton = document.querySelector("#redetect-button");
const redetectCompleteButton = document.querySelector("#redetect-complete");
const redetectLabel = document.querySelector("#redetect-label");
const checkedTime = document.querySelector("#checked-time");
const venvCard = document.querySelector("#venv-card");
const venvComplete = document.querySelector("#venv-complete");
const venvCompleteSummary = document.querySelector("#venv-complete-summary");
const venvCompletePath = document.querySelector("#venv-complete-path");
const venvCompletePython = document.querySelector("#venv-complete-python");
const venvCompleteActivation = document.querySelector(
  "#venv-complete-activation",
);
const venvStateLabel = document.querySelector("#venv-state-label");
const venvTitle = document.querySelector("#venv-title");
const venvDescription = document.querySelector("#venv-description");
const venvProjectPath = document.querySelector("#venv-project-path");
const venvWorking = document.querySelector("#venv-working");
const venvReady = document.querySelector("#venv-ready");
const venvPath = document.querySelector("#venv-path");
const venvPython = document.querySelector("#venv-python");
const activationLabel = document.querySelector("#activation-label");
const activationCommandValue = document.querySelector(
  "#activation-command-value",
);
const venvFeedback = document.querySelector("#venv-feedback");
const venvHint = document.querySelector("#venv-hint");
const createVenvButton = document.querySelector("#create-venv-button");
const createVenvLabel = document.querySelector("#create-venv-label");
const libraryCard = document.querySelector("#library-card");
const libraryComplete = document.querySelector("#library-complete");
const libraryCompleteSummary = document.querySelector(
  "#library-complete-summary",
);
const installedLibraryList = document.querySelector("#installed-library-list");
const libraryStateLabel = document.querySelector("#library-state-label");
const libraryTitle = document.querySelector("#library-title");
const libraryList = document.querySelector("#library-list");
const libraryWorking = document.querySelector("#library-working");
const libraryFeedback = document.querySelector("#library-feedback");
const selectAllLibrariesButton = document.querySelector(
  "#select-all-libraries",
);
const selectedLibraryCount = document.querySelector(
  "#selected-library-count",
);
const generateRequirementsButton = document.querySelector(
  "#generate-requirements-button",
);
const generateRequirementsLabel = document.querySelector(
  "#generate-requirements-label",
);
const requirementsComplete = document.querySelector("#requirements-complete");
const requirementsCompleteSummary = document.querySelector(
  "#requirements-complete-summary",
);
const requirementsCompletePath = document.querySelector(
  "#requirements-complete-path",
);
const requirementsInstallCard = document.querySelector(
  "#requirements-install-card",
);
const requirementsInstallStateLabel = document.querySelector(
  "#requirements-install-state-label",
);
const requirementsInstallTitle = document.querySelector(
  "#requirements-install-title",
);
const requirementsInstallCommand = document.querySelector(
  "#requirements-install-command",
);
const copyRequirementsCommandButton = document.querySelector(
  "#copy-requirements-command",
);
const requirementsStatusList = document.querySelector(
  "#requirements-status-list",
);
const requirementsCheckWorking = document.querySelector(
  "#requirements-check-working",
);
const requirementsInstallFeedback = document.querySelector(
  "#requirements-install-feedback",
);
const requirementsInstallProgress = document.querySelector(
  "#requirements-install-progress",
);
const checkRequirementsButton = document.querySelector(
  "#check-requirements-button",
);
const checkRequirementsLabel = document.querySelector(
  "#check-requirements-label",
);
const repairRequirementsButton = document.querySelector(
  "#repair-requirements-button",
);
const selectFolderButton = document.querySelector("#select-folder-button");
const selectFolderLabel = document.querySelector("#select-folder-label");
const topbarFolderName = document.querySelector("#topbar-folder-name");
const topbarFolderPath = document.querySelector("#topbar-folder-path");
const courseOptions = [...document.querySelectorAll(".course-option[data-course]")];
const coursePages = [
  ...document.querySelectorAll(".course-page[data-course-page]"),
];
const lessonCourseConfigs = {
  "classification-preparing-data": {
    number: "02",
    title: "Classification: Prepare Data · ML Generator",
    allTitle: "You now have a dataset ready for clustering.",
    allCopy:
      "You inspected the data structure, cleaned the samples, and examined correlations and distributions. The next lesson can use this dataset to try k-means.",
    skippedTitle: "The lesson is complete, but some steps were skipped.",
    skippedCopy: (completed, total, skipped) =>
      `You completed ${completed}/${total} steps and skipped ${skipped}. Before clustering, review the skipped material to confirm the filtering rules and plot conclusions.`,
  },
  "classification-kmeans": {
    number: "03",
    title: "Classification: K-Means · ML Generator",
    allTitle: "You built and evaluated an unsupervised clustering model.",
    allCopy:
      "You standardized the music features, used the elbow method to compare cluster counts, fitted K-Means, and interpreted the resulting groups with silhouette and profile analysis.",
    skippedTitle: "The K-Means lesson is complete, but some steps were skipped.",
    skippedCopy: (completed, total, skipped) =>
      `You completed ${completed}/${total} steps and skipped ${skipped}. Review the skipped material before trying to interpret or improve the clusters.`,
  },
};
const courseExamConfigs = {
  setup: {
    storageKey: "ml-generator:setup:final-exam:v1",
    label: "Environment setup · Final exam",
    title: "Can you run this project reliably?",
    description:
      "Six questions cover the Python interpreter, virtual environment, dependency manifest, and installation check.",
    passScore: 5,
    questions: [
      {
        topic: "Python interpreter",
        prompt:
          "Which interpreter should this project use after its virtual environment has been created?",
        options: [
          {
            text: "The python.exe inside the project's .venv folder.",
            correct: true,
            explanation:
              "The project interpreter keeps the course's packages separate from other Python projects.",
          },
          {
            text: "Any system Python identified first on PATH.",
            explanation:
              "A system interpreter may not contain the packages installed for this project.",
          },
          {
            text: "The Python version embedded in the browser.",
            explanation:
              "Browsers do not provide the project's Python runtime.",
          },
        ],
      },
      {
        topic: "Environment isolation",
        prompt: "What is the main purpose of a virtual environment?",
        options: [
          {
            text: "It isolates this project's Python packages and interpreter settings.",
            correct: true,
            explanation:
              "Isolation prevents package versions in one project from breaking another.",
          },
          {
            text: "It automatically fixes every error in the course code.",
            explanation:
              "A virtual environment provides dependencies; it does not debug source code.",
          },
          {
            text: "It permanently removes the system Python installation.",
            explanation:
              "The system Python remains available; the project simply uses its isolated environment.",
          },
        ],
      },
      {
        topic: "Activation",
        prompt:
          "What does the activation command .\\.venv\\Scripts\\Activate.ps1 do in a PowerShell terminal?",
        options: [
          {
            text: "It makes subsequent python and pip commands use the project's .venv.",
            correct: true,
            explanation:
              "Activation changes the current terminal so its Python commands resolve to the project environment.",
          },
          {
            text: "It installs every package in requirements.txt immediately.",
            explanation:
              "Activation changes the terminal's environment; installation is a separate pip command.",
          },
          {
            text: "It creates a new CSV dataset for the course.",
            explanation:
              "Activation does not create or modify course data.",
          },
        ],
      },
      {
        topic: "Dependency manifest",
        prompt: "What information belongs in requirements.txt?",
        options: [
          {
            text: "The Python packages and versions the project needs.",
            correct: true,
            explanation:
              "The manifest lets another environment recreate the project's dependencies.",
          },
          {
            text: "The source code of model.py.",
            explanation:
              "Source code stays in its own Python file; requirements.txt records dependencies.",
          },
          {
            text: "The names of the songs in the training dataset.",
            explanation:
              "Dataset contents belong in the data file, not the dependency manifest.",
          },
        ],
      },
      {
        topic: "Installation command",
        prompt:
          "Which command installs the dependencies listed in requirements.txt?",
        options: [
          {
            text: ".\\.venv\\Scripts\\python.exe -m pip install -r requirements.txt",
            correct: true,
            explanation:
              "The project interpreter runs pip with -r to read the manifest from the project root.",
          },
          {
            text: "python model.py --install requirements.txt",
            explanation:
              "Running model.py executes the lesson code; it is not a pip installation command.",
          },
          {
            text: "requirements.txt install",
            explanation:
              "requirements.txt is data consumed by pip, not a command-line program.",
          },
        ],
      },
      {
        topic: "Verification",
        prompt:
          "When should the environment setup course be considered complete?",
        options: [
          {
            text: "After every requirement passes the installation check.",
            correct: true,
            explanation:
              "A generated manifest is not enough; each listed package must be verified as installed.",
          },
          {
            text: "As soon as requirements.txt is generated.",
            explanation:
              "Generating the manifest records the plan but does not install or verify the packages.",
          },
          {
            text: "After the Python version is printed once.",
            explanation:
              "Detecting Python is only the first setup step; the project environment and packages still need work.",
          },
        ],
      },
    ],
  },
  "classification-preparing-data": {
    storageKey:
      "ml-generator:classification-preparing-data:final-exam:v1",
    label: "Prepare data · Final exam",
    title: "Can you prepare a dataset for clustering?",
    description:
      "Six questions connect loading, quality checks, genre counts, filtering, correlations, and the distribution plots.",
    passScore: 5,
    questions: [
      {
        topic: "Load and inspect",
        prompt:
          "What is the first thing df.head() helps you confirm after reading a CSV?",
        options: [
          {
            text: "That the file loaded and the first rows and columns look as expected.",
            correct: true,
            explanation:
              "A small sample is a quick sanity check before deeper analysis.",
          },
          {
            text: "That every row has already been assigned to a cluster.",
            explanation:
              "Loading a DataFrame does not perform clustering.",
          },
          {
            text: "That all numeric features have exactly the same scale.",
            explanation:
              "head() shows values, but it does not standardize or compare feature scales.",
          },
        ],
      },
      {
        topic: "Data quality",
        prompt:
          "Which pandas output most directly counts missing values in every column?",
        options: [
          {
            text: "df.isnull().sum()",
            correct: true,
            explanation:
              "isnull() marks missing cells and sum() counts those marks by column.",
          },
          {
            text: "df.head()",
            explanation:
              "head() shows a sample and can miss missing values elsewhere.",
          },
          {
            text: "df.corr()",
            explanation:
              "corr() measures relationships among numeric columns.",
          },
        ],
      },
      {
        topic: "Category counts",
        prompt:
          "Why call value_counts() before drawing the genre bar chart?",
        options: [
          {
            text: "It turns individual songs into a count for each genre.",
            correct: true,
            explanation:
              "The chart needs one aggregate value per category, not one bar per song.",
          },
          {
            text: "It standardizes all numeric audio features.",
            explanation:
              "Counting categories does not scale numeric measurements.",
          },
          {
            text: "It removes every song whose popularity is missing.",
            explanation:
              "value_counts() counts categories; it is not a missing-value filter.",
          },
        ],
      },
      {
        topic: "Filtering",
        prompt:
          "When combining pandas conditions with |, why should each condition be wrapped in parentheses?",
        options: [
          {
            text: "To make the intended logical grouping unambiguous.",
            correct: true,
            explanation:
              "Operator precedence can change which rows the combined condition selects.",
          },
          {
            text: "To convert every result into a string column.",
            explanation:
              "Parentheses group boolean expressions; they do not change the data type.",
          },
          {
            text: "To automatically fill missing genres.",
            explanation:
              "The filters select existing rows; they do not impute category values.",
          },
        ],
      },
      {
        topic: "Correlation",
        prompt: "What does a correlation close to 1 mean?",
        options: [
          {
            text: "The two numeric variables tend to increase together, but it does not prove causation.",
            correct: true,
            explanation:
              "Correlation measures association. A plausible cause requires more evidence.",
          },
          {
            text: "One variable definitely causes the other to increase.",
            explanation:
              "Strong correlation alone cannot establish a causal mechanism.",
          },
          {
            text: "Neither variable contains a missing value.",
            explanation:
              "Missingness is checked separately from correlation strength.",
          },
        ],
      },
      {
        topic: "Cluster shapes",
        prompt:
          "What should overlapping genre points in the KDE and scatter plots tell you before K-Means?",
        options: [
          {
            text: "The groups are not cleanly separated in this two-feature view, so the cluster choice needs evidence.",
            correct: true,
            explanation:
              "Overlap is a reason to inspect the full feature space and model quality rather than assume obvious clusters.",
          },
          {
            text: "K-Means will certainly find exactly three perfect clusters.",
            explanation:
              "The number and quality of clusters are not guaranteed by genre labels.",
          },
          {
            text: "Any songs that overlap must be deleted from the dataset.",
            explanation:
              "Overlap is information about the distribution, not automatically bad data.",
          },
        ],
      },
    ],
  },
  "classification-kmeans": {
    storageKey: "ml-generator:classification-kmeans:final-exam:v1",
    label: "K-Means clustering · Final exam",
    title: "Can you build and interpret a clustering model?",
    description:
      "Six questions cover feature preparation, fitting, elbow analysis, evaluation, and controlled experiments.",
    passScore: 5,
    questions: [
      {
        topic: "Feature scales",
        prompt:
          "Why standardize features before fitting K-Means to popularity, tempo, and audio measurements?",
        options: [
          {
            text: "Features with wider numeric ranges could otherwise dominate distance calculations.",
            correct: true,
            explanation:
              "K-Means minimizes distances and WCSS, so scale affects which feature has the most influence.",
          },
          {
            text: "Standardization supplies the genre answer used to train K-Means.",
            explanation:
              "K-Means is unsupervised; standardization does not add labels.",
          },
          {
            text: "It guarantees that every song becomes its own cluster.",
            explanation:
              "Scaling changes feature units, not the requested number of clusters.",
          },
        ],
      },
      {
        topic: "Feature matrix",
        prompt:
          "Which column should stay out of the feature matrix X for this unsupervised exercise?",
        options: [
          {
            text: "artist_top_genre, because it is a label used afterward for interpretation.",
            correct: true,
            explanation:
              "Including the genre answer would make the clustering no longer an unsupervised fit.",
          },
          {
            text: "danceability, because K-Means cannot use values between 0 and 1.",
            explanation:
              "K-Means can use continuous numeric values, including values between 0 and 1.",
          },
          {
            text: "loudness, because every clustering feature must be text.",
            explanation:
              "K-Means requires numeric features rather than text labels.",
          },
        ],
      },
      {
        topic: "Elbow method",
        prompt:
          "What does the elbow method compare across candidate cluster counts?",
        options: [
          {
            text: "Within-cluster sum of squares (WCSS or inertia), looking for where improvement slows.",
            correct: true,
            explanation:
              "The bend suggests a useful candidate, but it is a heuristic rather than an automatic answer.",
          },
          {
            text: "The alphabetical order of every song title.",
            explanation:
              "Song names are not used to choose the number of clusters.",
          },
          {
            text: "The number of missing genres in each row.",
            explanation:
              "WCSS measures distances from centroids, not missing category counts.",
          },
        ],
      },
      {
        topic: "Fitting",
        prompt:
          "What does a two-dimensional plot of popularity and danceability show after fitting on five features?",
        options: [
          {
            text: "A projection that can overlap even when the full five-feature clusters are different.",
            correct: true,
            explanation:
              "The plot reveals only two dimensions of a five-dimensional distance calculation.",
          },
          {
            text: "Every cluster must appear as a completely separated island.",
            explanation:
              "Projection can hide the dimensions that separate clusters.",
          },
          {
            text: "Cluster numbers carry a built-in ranking from best to worst.",
            explanation:
              "Cluster IDs are arbitrary identifiers, not quality ranks.",
          },
        ],
      },
      {
        topic: "Evaluation",
        prompt:
          "How should a silhouette score and a cluster-by-genre table be interpreted together?",
        options: [
          {
            text: "Silhouette summarizes geometric separation, while the crosstab helps explain the groups without treating genres as training answers.",
            correct: true,
            explanation:
              "Both provide evidence, but neither alone proves that clusters are meaningful for the question.",
          },
          {
            text: "The crosstab is classification accuracy because every song has an official cluster.",
            explanation:
              "There is no ground-truth cluster label for this unsupervised exercise.",
          },
          {
            text: "A silhouette score near 0 proves the clusters are perfectly separated.",
            explanation:
              "Scores near 0 indicate substantial overlap; values closer to 1 indicate better separation.",
          },
        ],
      },
      {
        topic: "Controlled comparison",
        prompt:
          "How should you compare candidate cluster counts fairly?",
        options: [
          {
            text: "Keep features, scaling, initialization, and random seed consistent while varying the main decision.",
            correct: true,
            explanation:
              "Changing several settings at once makes it unclear which change caused the result.",
          },
          {
            text: "Always choose the largest value of k because more clusters are more accurate.",
            explanation:
              "More clusters can overfit and fragment meaningful groups; evidence must support the choice.",
          },
          {
            text: "Rename clusters until their numbers match the genre labels.",
            explanation:
              "Cluster identifiers are arbitrary; forcing them onto external labels changes the question being evaluated.",
          },
        ],
      },
    ],
  },
};
const lessonControllers = new Map();
const courseExamControllers = new Map();

if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

const views = {
  checking: document.querySelector("#checking-view"),
  found: document.querySelector("#found-view"),
  missing: document.querySelector("#missing-view"),
  error: document.querySelector("#error-view"),
};

let isChecking = false;
let isSelectingFolder = false;
let isCreatingEnvironment = false;
let isGeneratingRequirements = false;
let isCheckingRequirements = false;
let isRepairingRequirements = false;
let selectedProjectPath = null;
let libraryCatalog = [];
let libraryPipAvailable = false;
const selectedLibraries = new Set();
let hasInitializedLibrarySelection = false;
let activeCourseId = "setup";
let setupHeaderStatus = {
  state: headerStatus.dataset.state || "checking",
  text: headerStatusText.textContent || "Checking",
};

function setState(state) {
  card.dataset.state = state;

  for (const [viewState, view] of Object.entries(views)) {
    view.hidden = viewState !== state;
  }
}

function applyHeaderStatus(state, text) {
  headerStatus.dataset.state = state;
  headerStatus.setAttribute("aria-label", text);
  headerStatusText.textContent = text;
}

function setHeaderStatus(state, text) {
  setupHeaderStatus = { state, text };

  if (activeCourseId === "setup") {
    applyHeaderStatus(state, text);
  }
}

function createCourseExamController(page, config) {
  const courseId = page.dataset.coursePage;
  const panel = page.querySelector("[data-course-exam]");
  if (!panel || !config) {
    return null;
  }

  const questionsContainer = panel.querySelector(
    "[data-course-exam-questions]",
  );
  const checkButton = panel.querySelector('[data-exam-action="check"]');
  const retryButton = panel.querySelector('[data-exam-action="retry"]');
  const feedback = panel.querySelector("[data-course-exam-feedback]");
  const attemptLabel = panel.querySelector("[data-course-exam-attempt]");
  const answeredLabel = panel.querySelector("[data-course-exam-answered]");
  const jumpButton = page.querySelector("[data-course-exam-jump]");
  const total = config.questions.length;
  let savedAttempt = null;

  function readSavedAttempt() {
    try {
      const value = JSON.parse(
        localStorage.getItem(config.storageKey) || "null",
      );
      if (
        value &&
        Number.isInteger(value.score) &&
        Number.isInteger(value.total)
      ) {
        return value;
      }
    } catch {
      // The exam remains available when local storage cannot be read.
    }
    return null;
  }

  function saveAttempt(attempt) {
    try {
      localStorage.setItem(config.storageKey, JSON.stringify(attempt));
    } catch {
      // Attempt persistence is optional.
    }
  }

  function updateAnsweredCount() {
    const answered = config.questions.reduce(
      (count, _, index) =>
        count +
        (panel.querySelector(
          `input[name="${courseId}-final-exam-${index}"]:checked`,
        )
          ? 1
          : 0),
      0,
    );
    answeredLabel.textContent = `${answered} / ${total} answered`;
  }

  function setAttemptLabel(attempt) {
    if (!attempt) {
      attemptLabel.textContent = "Not attempted";
      attemptLabel.dataset.kind = "";
      return;
    }

    const passed = attempt.score >= config.passScore;
    attemptLabel.textContent = `${passed ? "Passed" : "Not passed"} · ${attempt.score} / ${attempt.total}`;
    attemptLabel.dataset.kind = passed ? "success" : "error";
  }

  function renderQuestions() {
    questionsContainer.replaceChildren();

    config.questions.forEach((question, questionIndex) => {
      const article = document.createElement("article");
      article.className = "course-exam-question";
      article.dataset.examQuestion = String(questionIndex);
      article.setAttribute(
        "aria-labelledby",
        `${courseId}-final-question-${questionIndex}`,
      );

      const header = document.createElement("header");
      const topic = document.createElement("span");
      topic.textContent = `Question ${questionIndex + 1} · ${question.topic}`;
      const prompt = document.createElement("h3");
      prompt.id = `${courseId}-final-question-${questionIndex}`;
      prompt.textContent = question.prompt;
      header.append(topic, prompt);

      const options = document.createElement("div");
      options.className = "course-exam-options";
      question.options.forEach((option, optionIndex) => {
        const label = document.createElement("label");
        const input = document.createElement("input");
        input.type = "radio";
        input.name = `${courseId}-final-exam-${questionIndex}`;
        input.value = String(optionIndex);
        input.dataset.examQuestion = String(questionIndex);
        const text = document.createElement("span");
        text.textContent = option.text;
        label.append(input, text);
        options.append(label);
      });

      const explanation = document.createElement("p");
      explanation.className = "course-exam-explanation";
      explanation.dataset.examExplanation = "";
      explanation.hidden = true;

      article.append(header, options, explanation);
      questionsContainer.append(article);
    });
  }

  function resetAnswerReview() {
    panel.dataset.state = "ready";
    for (const input of panel.querySelectorAll("input")) {
      input.disabled = false;
      input.checked = false;
    }

    for (const question of panel.querySelectorAll(
      ".course-exam-question",
    )) {
      question.removeAttribute("data-result");
      question.querySelector("[data-exam-explanation]").hidden = true;
    }

    checkButton.hidden = false;
    retryButton.hidden = true;
    feedback.dataset.kind = "";
    feedback.textContent = "";
    updateAnsweredCount();
  }

  function checkAnswers() {
    const answers = config.questions.map((_, questionIndex) =>
      panel.querySelector(
        `input[name="${courseId}-final-exam-${questionIndex}"]:checked`,
      ),
    );
    const missingIndex = answers.findIndex((answer) => !answer);

    if (missingIndex >= 0) {
      feedback.dataset.kind = "error";
      feedback.textContent = `Answer question ${missingIndex + 1} before submitting.`;
      panel
        .querySelector(
          `.course-exam-question[data-exam-question="${missingIndex}"] input`,
        )
        ?.focus();
      return;
    }

    let score = 0;
    config.questions.forEach((question, questionIndex) => {
      const selectedOption = question.options[Number(answers[questionIndex].value)];
      const isCorrect = Boolean(selectedOption?.correct);
      if (isCorrect) {
        score += 1;
      }

      const card = panel.querySelector(
        `.course-exam-question[data-exam-question="${questionIndex}"]`,
      );
      card.dataset.result = isCorrect ? "correct" : "incorrect";
      const explanation = card.querySelector("[data-exam-explanation]");
      explanation.textContent = `${isCorrect ? "Correct." : "Review."} ${selectedOption?.explanation || ""}`;
      explanation.hidden = false;
    });

    const passed = score >= config.passScore;
    panel.dataset.state = passed ? "passed" : "failed";
    for (const input of panel.querySelectorAll("input")) {
      input.disabled = true;
    }

    checkButton.hidden = true;
    retryButton.hidden = false;
    feedback.dataset.kind = passed ? "success" : "error";
    feedback.textContent = passed
      ? `Passed with ${score} / ${total}. You are ready to continue.`
      : `You scored ${score} / ${total}. Review the explanations, then try again; ${config.passScore} correct answers are required.`;

    savedAttempt = {
      score,
      total,
      passed,
      completedAt: new Date().toISOString(),
    };
    saveAttempt(savedAttempt);
    setAttemptLabel(savedAttempt);
  }

  function initialize() {
    panel.querySelector("[data-course-exam-label]").textContent = config.label;
    panel.querySelector("[data-course-exam-title]").textContent = config.title;
    panel.querySelector("[data-course-exam-description]").textContent =
      config.description;
    panel.querySelector("[data-course-exam-requirement]").textContent =
      `Pass score: ${config.passScore} / ${total}`;
    renderQuestions();
    resetAnswerReview();

    savedAttempt = readSavedAttempt();
    setAttemptLabel(savedAttempt);

    panel.addEventListener("change", (event) => {
      if (event.target.matches('input[type="radio"]')) {
        updateAnsweredCount();
        feedback.dataset.kind = "";
        feedback.textContent = "";
      }
    });

    panel.addEventListener("click", (event) => {
      const actionButton = event.target.closest("[data-exam-action]");
      if (!actionButton) {
        return;
      }

      if (actionButton.dataset.examAction === "check") {
        checkAnswers();
      } else if (actionButton.dataset.examAction === "retry") {
        resetAnswerReview();
      }
    });

    jumpButton?.addEventListener("click", () => {
      panel.hidden = false;
      panel.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  return { initialize };
}

function initializeCourseExams() {
  for (const page of coursePages) {
    const controller = createCourseExamController(
      page,
      courseExamConfigs[page.dataset.coursePage],
    );
    if (!controller) {
      continue;
    }

    courseExamControllers.set(page.dataset.coursePage, controller);
    controller.initialize();
  }
}

function setCourseExamVisible(courseId, isVisible) {
  const page = coursePages.find(
    (candidate) => candidate.dataset.coursePage === courseId,
  );
  const panel = page?.querySelector("[data-course-exam]");
  if (panel) {
    panel.hidden = !isVisible;
  }
}

function createLessonController(page, config) {
  const courseId = page.dataset.coursePage;
  const lessonSteps = [
    ...page.querySelectorAll(".lesson-step[data-lesson-step]"),
  ];
  const lessonProgressCount = page.querySelector(
    "[data-lesson-progress-count]",
  );
  const lessonProgressBar = page.querySelector("[data-lesson-progress-bar]");
  const lessonProgressTrack = page.querySelector(".lesson-progress-track");
  const lessonProgressDetail = page.querySelector(
    "[data-lesson-progress-detail]",
  );
  const lessonHistory = page.querySelector("[data-lesson-history]");
  const lessonFinish = page.querySelector("[data-lesson-finish]");
  const lessonFinishMark = page.querySelector("[data-lesson-finish-mark]");
  const lessonFinishTitle = page.querySelector("[data-lesson-finish-title]");
  const lessonFinishCopy = page.querySelector("[data-lesson-finish-copy]");
  const lessonProgressStorageKey = page.dataset.lessonStorageKey;
  const completedLessonSteps = new Set();
  const skippedLessonSteps = new Set();

function getLessonStepNumber(step) {
  return Number(step.dataset.lessonStep);
}

function getLessonStepName(step) {
  return step.querySelector(".lesson-step-heading h2")?.textContent || "";
}

function saveLessonProgress() {
  try {
    localStorage.setItem(
      lessonProgressStorageKey,
      JSON.stringify({
        completed: [...completedLessonSteps],
        skipped: [...skippedLessonSteps],
      }),
    );
  } catch {
    // Progress persistence is optional; the lesson still works in memory.
  }
}

function restoreLessonProgress() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(lessonProgressStorageKey) || "{}",
    );

    for (const value of saved.completed || []) {
      const stepNumber = Number(value);
      if (
        Number.isInteger(stepNumber) &&
        stepNumber >= 1 &&
        stepNumber <= lessonSteps.length
      ) {
        completedLessonSteps.add(stepNumber);
      }
    }

    for (const value of saved.skipped || []) {
      const stepNumber = Number(value);
      if (
        Number.isInteger(stepNumber) &&
        stepNumber >= 1 &&
        stepNumber <= lessonSteps.length &&
        !completedLessonSteps.has(stepNumber)
      ) {
        skippedLessonSteps.add(stepNumber);
      }
    }
  } catch {
    completedLessonSteps.clear();
    skippedLessonSteps.clear();
  }
}

function updateClassificationHeader() {
  if (activeCourseId !== courseId) {
    return;
  }

  const completed = completedLessonSteps.size;
  const skipped = skippedLessonSteps.size;
  const skippedText = skipped > 0 ? ` · ${skipped} skipped` : "";
  applyHeaderStatus(
    "course",
    `Course ${config.number} · ${completed} / ${lessonSteps.length} steps complete${skippedText}`,
  );
}

function renderLessonHistory() {
  lessonHistory.replaceChildren();

  const entries = [
    ...[...completedLessonSteps].map((stepNumber) => ({
      stepNumber,
      status: "complete",
    })),
    ...[...skippedLessonSteps].map((stepNumber) => ({
      stepNumber,
      status: "skipped",
    })),
  ].sort((a, b) => a.stepNumber - b.stepNumber);

  for (const entry of entries) {
    const step = lessonSteps.find(
      (candidate) => getLessonStepNumber(candidate) === entry.stepNumber,
    );
    const item = document.createElement("button");
    item.type = "button";
    item.className = `lesson-history-item is-${entry.status}`;
    item.dataset.reviewStep = String(entry.stepNumber);
    item.setAttribute(
      "aria-label",
      `Review step ${entry.stepNumber}: ${getLessonStepName(step)}`,
    );

    if (entry.status === "complete") {
      const mark = document.createElement("span");
      mark.className = "lesson-history-mark";
      mark.setAttribute("aria-hidden", "true");
      mark.textContent = "✓";
      item.append(mark);
    }

    const copy = document.createElement("span");
    copy.textContent =
      entry.status === "complete"
        ? `Step ${entry.stepNumber} · ${getLessonStepName(step)}`
        : `Step ${entry.stepNumber} · Skipped`;
    item.append(copy);
    lessonHistory.append(item);
  }
}

function renderLessonProgress() {
  const completed = completedLessonSteps.size;
  const skipped = skippedLessonSteps.size;
  const total = lessonSteps.length;
  const percentage = total > 0 ? (completed / total) * 100 : 0;
  const skippedText = skipped > 0 ? `, ${skipped} skipped` : "";

  lessonProgressCount.textContent = `${completed} / ${total} steps complete`;
  lessonProgressBar.style.width = `${percentage}%`;
  lessonProgressTrack.setAttribute("aria-valuenow", String(completed));
  lessonProgressDetail.textContent =
    skipped > 0
      ? `${completed} steps completed${skippedText}. Select a step record to review it.`
      : "Select a completed step record to review it without changing lesson progress.";
  renderLessonHistory();
  updateClassificationHeader();
}

function showLessonFinish() {
  clearLessonReviewModes();

  for (const step of lessonSteps) {
    step.hidden = true;
  }

  const completed = completedLessonSteps.size;
  const skipped = skippedLessonSteps.size;
  const allCompleted = completed === lessonSteps.length;

  lessonFinish.hidden = false;
  lessonFinishMark.hidden = !allCompleted;
  lessonFinishTitle.textContent = allCompleted
    ? config.allTitle
    : config.skippedTitle;
  lessonFinishCopy.textContent = allCompleted
    ? config.allCopy
    : config.skippedCopy(completed, lessonSteps.length, skipped);
  setCourseExamVisible(courseId, true);
}

function clearLessonReviewModes() {
  for (const step of lessonSteps) {
    step.classList.remove("is-review");
    step.querySelector("[data-lesson-review-bar]")?.remove();
    step.querySelectorAll("[data-review-target]").forEach((button) => {
      button.remove();
    });
  }
}

function createLessonReviewBar(step) {
  const body = step.querySelector(".lesson-step-body");
  if (!body) {
    return;
  }

  const stepNumber = getLessonStepNumber(step);
  const bar = document.createElement("div");
  bar.className = "lesson-review-bar";
  bar.dataset.lessonReviewBar = "";

  const copy = document.createElement("div");
  const label = document.createElement("span");
  label.textContent = "Review mode";
  const title = document.createElement("strong");
  title.textContent = `Step ${stepNumber} · ${getLessonStepName(step)}`;
  const description = document.createElement("small");
  description.textContent = "Reviewing this content does not change its completed or skipped status.";
  copy.append(label, title, description);

  const controls = document.createElement("div");
  controls.className = "lesson-review-controls";

  const previousNumber = stepNumber - 1;
  if (
    completedLessonSteps.has(previousNumber) ||
    skippedLessonSteps.has(previousNumber)
  ) {
    const previousButton = document.createElement("button");
    previousButton.type = "button";
    previousButton.className = "lesson-secondary-button";
    previousButton.dataset.reviewTarget = String(previousNumber);
    previousButton.textContent = "Previous step";
    controls.append(previousButton);
  }

  const nextNumber = stepNumber + 1;
  if (
    completedLessonSteps.has(nextNumber) ||
    skippedLessonSteps.has(nextNumber)
  ) {
    const nextButton = document.createElement("button");
    nextButton.type = "button";
    nextButton.className = "lesson-secondary-button";
    nextButton.dataset.reviewTarget = String(nextNumber);
    nextButton.textContent = "Next step";
    controls.append(nextButton);
  }

  const returnButton = document.createElement("button");
  returnButton.type = "button";
  returnButton.className = "lesson-primary-button";
  returnButton.dataset.lessonAction = "return-progress";
  returnButton.textContent = "Return to current progress";
  controls.append(returnButton);

  bar.append(copy, controls);
  body.prepend(bar);
}

function reviewLessonStep(stepNumber) {
  const step = lessonSteps.find(
    (candidate) => getLessonStepNumber(candidate) === stepNumber,
  );

  if (
    !step ||
    (!completedLessonSteps.has(stepNumber) &&
      !skippedLessonSteps.has(stepNumber))
  ) {
    return;
  }

  clearLessonReviewModes();

  for (const candidate of lessonSteps) {
    candidate.hidden = candidate !== step;
  }

  const stateLabel = step.querySelector(".lesson-step-state");
  step.classList.add("is-review");
  step.dataset.status = "review";
  step.hidden = false;
  lessonFinish.hidden = true;
  setCourseExamVisible(courseId, false);

  if (stateLabel) {
    stateLabel.textContent = "Reviewing";
  }

  step.querySelector("[data-lesson-actions]")?.setAttribute("hidden", "");
  step.querySelector("[data-lesson-quiz]")?.setAttribute("hidden", "");
  createLessonReviewBar(step);
  window.requestAnimationFrame(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    step.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  });
}

function returnToCurrentLessonProgress() {
  clearLessonReviewModes();
  const currentStep = lessonSteps.find((step) => {
    const stepNumber = getLessonStepNumber(step);
    return (
      !completedLessonSteps.has(stepNumber) &&
      !skippedLessonSteps.has(stepNumber)
    );
  });

  if (currentStep) {
    showCurrentLessonStep(currentStep);
  } else {
    showLessonFinish();
  }
}

function showCurrentLessonStep(step) {
  clearLessonReviewModes();

  for (const candidate of lessonSteps) {
    candidate.hidden = candidate !== step;
  }

  step.dataset.status = "current";
  const stateLabel = step.querySelector(".lesson-step-state");
  if (stateLabel) {
    stateLabel.textContent = "Current step";
  }

  lessonFinish.hidden = true;
  setCourseExamVisible(courseId, false);
  window.requestAnimationFrame(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    step.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  });
}

function advanceLessonFrom(step) {
  const currentNumber = getLessonStepNumber(step);
  const nextStep = lessonSteps.find(
    (candidate) => getLessonStepNumber(candidate) === currentNumber + 1,
  );

  if (nextStep) {
    showCurrentLessonStep(nextStep);
    return;
  }

  showLessonFinish();
}

function completeLessonStep(step) {
  const quiz = step.querySelector("[data-lesson-quiz]");
  const actions = step.querySelector("[data-lesson-actions]");
  const stateLabel = step.querySelector(".lesson-step-state");

  if (!quiz || !actions || !quiz.hidden) {
    return;
  }

  actions.hidden = true;
  quiz.hidden = false;
  step.dataset.status = "quiz";

  if (stateLabel) {
    stateLabel.textContent = "Knowledge check";
  }
}

function skipLessonStep(step) {
  const stepNumber = getLessonStepNumber(step);
  completedLessonSteps.delete(stepNumber);
  skippedLessonSteps.add(stepNumber);
  step.dataset.status = "skipped";
  saveLessonProgress();
  renderLessonProgress();
  advanceLessonFrom(step);
}

function checkLessonQuiz(step) {
  const quiz = step.querySelector("[data-lesson-quiz]");
  const selected = quiz?.querySelector("input:checked");
  const feedback = quiz?.querySelector(".lesson-quiz-feedback");
  const checkButton = quiz?.querySelector('[data-lesson-action="check"]');
  const nextButton = quiz?.querySelector('[data-lesson-action="next"]');
  const stateLabel = step.querySelector(".lesson-step-state");

  if (!quiz || !feedback || !checkButton || !nextButton) {
    return;
  }

  if (!selected) {
    feedback.dataset.kind = "error";
    feedback.textContent = "Select an answer before checking.";
    return;
  }

  if (selected.dataset.correct !== "true") {
    feedback.dataset.kind = "error";
    feedback.textContent = "Not quite. Revisit this step's goal and expected result, then compare the options again.";
    return;
  }

  const stepNumber = getLessonStepNumber(step);
  skippedLessonSteps.delete(stepNumber);
  completedLessonSteps.add(stepNumber);
  step.dataset.status = "completed";

  for (const input of quiz.querySelectorAll("input")) {
    input.disabled = true;
  }

  checkButton.hidden = true;
  nextButton.hidden = false;
  feedback.dataset.kind = "success";
  feedback.textContent = "Correct. You have achieved this step's goal.";

  if (stateLabel) {
    stateLabel.textContent = "Completed";
  }

  saveLessonProgress();
  renderLessonProgress();
}

function initializeLessonProgress() {
  restoreLessonProgress();

  let currentStep = null;
  for (const step of lessonSteps) {
    const stepNumber = getLessonStepNumber(step);
    const isProcessed =
      completedLessonSteps.has(stepNumber) ||
      skippedLessonSteps.has(stepNumber);

    step.hidden = isProcessed || Boolean(currentStep);
    step.dataset.status = isProcessed
      ? completedLessonSteps.has(stepNumber)
        ? "completed"
        : "skipped"
      : "locked";

    if (!isProcessed && !currentStep) {
      currentStep = step;
      step.dataset.status = "current";
    }
  }

  renderLessonProgress();

  if (currentStep) {
    currentStep.hidden = false;
    lessonFinish.hidden = true;
  } else {
    showLessonFinish();
  }
}

function initializeCourseLessonInteractions() {
  initializeLessonProgress();

  lessonHistory.addEventListener("click", (event) => {
    const reviewButton = event.target.closest("[data-review-step]");
    if (reviewButton) {
      reviewLessonStep(Number(reviewButton.dataset.reviewStep));
    }
  });

  for (const step of lessonSteps) {
    const stepNumber = getLessonStepNumber(step);
    const actions = step.querySelector("[data-lesson-actions]");
    if (actions) {
      const previousButton = document.createElement("button");
      previousButton.type = "button";
      previousButton.className = "lesson-secondary-button lesson-back-button";
      previousButton.dataset.lessonAction = "previous";
      previousButton.textContent = "View previous step";
      previousButton.hidden = stepNumber === 1;
      actions.prepend(previousButton);
    }

    step.addEventListener("click", (event) => {
      const reviewTarget = event.target.closest("[data-review-target]");
      const actionButton = event.target.closest("[data-lesson-action]");
      const copyButton = event.target.closest("[data-copy-target]");

      if (reviewTarget) {
        reviewLessonStep(Number(reviewTarget.dataset.reviewTarget));
        return;
      }

      if (copyButton) {
        copyLessonCode(copyButton);
        return;
      }

      if (!actionButton) {
        return;
      }

      const action = actionButton.dataset.lessonAction;

      if (
        step.classList.contains("is-review") &&
        action !== "return-progress"
      ) {
        return;
      }

      if (action === "complete") {
        completeLessonStep(step);
      } else if (action === "skip") {
        skipLessonStep(step);
      } else if (action === "check") {
        checkLessonQuiz(step);
      } else if (action === "next") {
        advanceLessonFrom(step);
      } else if (action === "previous") {
        reviewLessonStep(stepNumber - 1);
      } else if (action === "return-progress") {
        returnToCurrentLessonProgress();
      }
    });
  }
}

  return {
    page,
    initialize: initializeCourseLessonInteractions,
    updateHeader: updateClassificationHeader,
  };
}

function getCourseFromLocation() {
  return window.location.hash.replace(/^#course-/, "");
}

function activateCourse(courseId) {
  const validCourseId = coursePages.some(
    (page) => page.dataset.coursePage === courseId,
  )
    ? courseId
    : "setup";

  activeCourseId = validCourseId;

  for (const option of courseOptions) {
    const isActive = option.dataset.course === validCourseId;
    option.classList.toggle("is-active", isActive);

    if (isActive) {
      option.setAttribute("aria-current", "page");
    } else {
      option.removeAttribute("aria-current");
    }

    const detail = option.querySelector(".course-option-copy small");
    if (detail) {
      detail.dataset.defaultLabel ||= detail.textContent;
      detail.textContent = isActive
        ? "Current course"
        : detail.dataset.defaultLabel;
    }
  }

  for (const page of coursePages) {
    page.hidden = page.dataset.coursePage !== validCourseId;
  }

  const lessonController = lessonControllers.get(validCourseId);
  if (lessonController) {
    lessonController.updateHeader();
    document.title = lessonCourseConfigs[validCourseId].title;
  } else {
    applyHeaderStatus(setupHeaderStatus.state, setupHeaderStatus.text);
    document.title = "ML Generator · Project Setup";
  }

  window.scrollTo({ top: 0, behavior: "auto" });
  window.requestAnimationFrame(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  });
}

function navigateToCourse(courseId) {
  const nextHash = `#course-${courseId}`;
  if (window.location.hash !== nextHash) {
    window.history.pushState(null, "", nextHash);
  }
  activateCourse(courseId);
}

function initializeCourseNavigation() {
  for (const option of courseOptions) {
    option.addEventListener("click", (event) => {
      event.preventDefault();
      navigateToCourse(option.dataset.course);
    });
  }

  window.addEventListener("hashchange", () => {
    activateCourse(getCourseFromLocation());
  });
  window.addEventListener("popstate", () => {
    activateCourse(getCourseFromLocation());
  });

  activateCourse(getCourseFromLocation());
}

async function copyLessonCode(button) {
  const targetId = button.dataset.copyTarget;
  const target = targetId ? document.getElementById(targetId) : null;

  if (!target) {
    return;
  }

  try {
    await navigator.clipboard.writeText(target.textContent.trim());
    button.textContent = "Copied";
  } catch {
    button.textContent = "Copy failed";
  }

  window.setTimeout(() => {
    button.textContent = "Copy code";
  }, 1600);
}

function initializeAllLessonInteractions() {
  for (const page of coursePages) {
    const config = lessonCourseConfigs[page.dataset.coursePage];
    if (!config) {
      continue;
    }

    const controller = createLessonController(page, config);
    lessonControllers.set(page.dataset.coursePage, controller);
    controller.initialize();
  }
}

function initializeSetupExamVisibility() {
  const setupPage = coursePages.find(
    (page) => page.dataset.coursePage === "setup",
  );
  const panel = setupPage?.querySelector("[data-course-exam]");
  if (!panel) {
    return;
  }

  const syncVisibility = () => {
    panel.hidden = libraryComplete.hidden;
  };

  new MutationObserver(syncVisibility).observe(libraryComplete, {
    attributes: true,
    attributeFilter: ["hidden"],
  });
  syncVisibility();
}

function setCheckingState() {
  card.hidden = false;
  pythonComplete.hidden = true;
  venvCard.hidden = true;
  venvComplete.hidden = true;
  libraryCard.hidden = true;
  requirementsComplete.hidden = true;
  requirementsInstallCard.hidden = true;
  libraryComplete.hidden = true;
  setState("checking");
  setHeaderStatus("checking", "Checking");
  pageTitle.textContent = "Confirm your Python environment first.";
  introDescription.textContent =
    "We will check whether Python is installed on this computer and show its version.";
  stateLabel.textContent = "Checking";
  stateTitle.textContent = "Checking Python...";
  stateDescription.textContent =
    "Please wait while we look for an available Python installation.";
  redetectButton.disabled = true;
  redetectLabel.textContent = "Checking";
  checkedTime.textContent = "";
}

function renderFound(result) {
  const python = result.python;

  setState("found");
  setHeaderStatus("found", "Environment ready");
  pageTitle.textContent = "Your Python environment is ready.";
  introDescription.textContent =
    "Choose a project folder in the top bar. Your course files will be saved in that directory.";
  stateLabel.textContent = "Completed";
  stateTitle.textContent = "Python environment ready";
  stateDescription.textContent =
    "A usable Python installation was found. You can now use it to create a learning environment.";

  document.querySelector("#python-version").textContent = python.version;
  document.querySelector("#python-implementation").textContent =
    python.implementation;
  document.querySelector("#python-architecture").textContent =
    python.architecture || "Unknown architecture";
  document.querySelector("#python-path").textContent = python.executable;
  document.querySelector("#python-command").textContent = python.detectedBy;

  document.querySelector("#complete-version").textContent =
    `Python ${python.version}`;
  document.querySelector("#complete-architecture").textContent =
    python.architecture || "Unknown architecture";
  document.querySelector("#complete-python-path").textContent =
    python.executable;
  document.querySelector("#complete-python-command").textContent =
    python.detectedBy;

  card.hidden = true;
  pythonComplete.hidden = false;
  pythonComplete.open = false;
  venvCard.hidden = false;
  refreshEnvironmentStatus().catch(showEnvironmentError);
}

function renderMissing() {
  card.hidden = false;
  pythonComplete.hidden = true;
  venvCard.hidden = true;
  venvComplete.hidden = true;
  libraryCard.hidden = true;
  requirementsComplete.hidden = true;
  requirementsInstallCard.hidden = true;
  libraryComplete.hidden = true;
  setState("missing");
  setHeaderStatus("missing", "Python not found");
  pageTitle.textContent = "Confirm your Python environment first.";
  introDescription.textContent =
    "We will check whether Python is installed on this computer and show its version.";
  stateLabel.textContent = "Action needed";
  stateTitle.textContent = "Python was not detected";
  stateDescription.textContent =
    "No usable Python installation was found on this computer. Follow the steps below, then check again.";
}

function renderError(message) {
  card.hidden = false;
  pythonComplete.hidden = true;
  venvCard.hidden = true;
  venvComplete.hidden = true;
  libraryCard.hidden = true;
  requirementsComplete.hidden = true;
  requirementsInstallCard.hidden = true;
  libraryComplete.hidden = true;
  setState("error");
  setHeaderStatus("error", "Check failed");
  pageTitle.textContent = "Confirm your Python environment first.";
  introDescription.textContent =
    "We will check whether Python is installed on this computer and show its version.";
  stateLabel.textContent = "Check error";
  stateTitle.textContent = "Unable to complete the check";
  stateDescription.textContent =
    "The local detection service did not return a valid result. Check that the app is running, then try again.";
  document.querySelector("#error-message").textContent =
    message || "Select “Check again” to retry.";
}

function renderCheckedTime(checkedAt) {
  const date = checkedAt ? new Date(checkedAt) : new Date();
  checkedTime.textContent = `Checked at ${new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date)}`;
}

function getFolderName(directory) {
  const normalized = directory.replace(/[\\/]+$/, "");
  return normalized.split(/[\\/]/).filter(Boolean).at(-1) || directory;
}

function renderProjectSelection(directory) {
  selectedProjectPath = directory;
  topbarFolderName.textContent = getFolderName(directory);
  topbarFolderPath.textContent = directory;
  selectFolderButton.title = `Current project: ${directory}. Select to change folders.`;
  selectFolderLabel.textContent = "Change";
  venvProjectPath.textContent = directory;

  if (!venvCard.hidden) {
    refreshEnvironmentStatus().catch(showEnvironmentError);
  }
}

function renderProjectIdle() {
  selectedProjectPath = null;
  topbarFolderName.textContent = "Select project folder";
  topbarFolderPath.textContent = "Choose a project root directory";
  selectFolderButton.title = "Select project root folder";
  selectFolderLabel.textContent = "Select";
  venvProjectPath.textContent = "Not selected";

  if (!venvCard.hidden) {
    refreshEnvironmentStatus().catch(showEnvironmentError);
  }
}

function setEnvironmentVisibility({ working = false, ready = false }) {
  venvWorking.hidden = !working;
  venvReady.hidden = !ready;
}

function setEnvironmentButton(enabled, label) {
  createVenvButton.disabled = !enabled;
  createVenvLabel.textContent = label;
}

function updateEnvironmentIntro(state) {
  if (pythonComplete.hidden) {
    return;
  }

  if (state === "no-project") {
    pageTitle.textContent = "Choose a project folder first.";
    introDescription.textContent =
      "After you choose a project folder in the top bar, you can create an isolated Python virtual environment.";
  } else if (state === "ready") {
    pageTitle.textContent = "Generate the project dependency manifest first.";
    introDescription.textContent =
      "requirements.txt records the packages required by the course. Follow the instructions to install and check them.";
  } else {
    pageTitle.textContent = "Create a project virtual environment.";
    introDescription.textContent =
      "Create and activate an isolated .venv in the project folder without changing the global Python installation.";
  }
}

function renderEnvironmentReady(result) {
  const environment = result.environment || result;

  venvCard.dataset.state = "ready";
  venvStateLabel.textContent = "Completed";
  venvTitle.textContent = "Virtual environment activated";
  venvDescription.textContent =
    "The project now has an isolated Python environment. You can continue installing course dependencies.";
  venvProjectPath.textContent = result.projectRoot || selectedProjectPath || "--";
  venvPath.textContent = environment.venvPath || "--";
  venvPython.textContent = environment.pythonPath || "--";
  activationLabel.textContent = `${
    environment.activationShell || "Terminal"
  } activation command`;
  activationCommandValue.textContent =
    environment.activationCommand || "--";
  venvFeedback.textContent = "";
  venvHint.textContent = "Future Python commands will use this project environment";
  setEnvironmentButton(false, "Activated");
  setEnvironmentVisibility({ ready: true });
  venvCard.hidden = true;
  venvComplete.hidden = false;
  venvComplete.open = false;
  venvCompleteSummary.textContent = `Python ${
    environment.version || "--"
  } · Activated`;
  venvCompletePath.textContent = environment.venvPath || "--";
  venvCompletePython.textContent = environment.pythonPath || "--";
  venvCompleteActivation.textContent =
    environment.activationCommand || "--";
  updateEnvironmentIntro("ready");
  libraryCard.hidden = true;
  requirementsComplete.hidden = true;
  requirementsInstallCard.hidden = true;
  libraryComplete.hidden = true;
  loadLibraryStatus().catch(showLibraryError);
}

function renderEnvironmentMissing(result) {
  const isExisting = result.state === "existing";

  venvCard.dataset.state = result.state || "missing";
  venvStateLabel.textContent = "In progress";
  venvTitle.textContent = isExisting
    ? "Activate existing virtual environment"
    : "Create virtual environment";
  venvDescription.textContent = isExisting
    ? "This project already contains .venv. After validation, you can use it as the current learning environment."
    : "The app will create .venv and use the project's Python installation for future course code.";
  venvProjectPath.textContent = result.projectRoot || selectedProjectPath || "--";
  venvFeedback.textContent = "";
  venvHint.textContent = isExisting
    ? "An existing usable environment was detected"
    : "The global Python installation will not be changed";
  setEnvironmentButton(
    Boolean(result.projectRoot),
    isExisting ? "Activate existing environment" : "Create and activate",
  );
  setEnvironmentVisibility({});
  updateEnvironmentIntro(result.state || "missing");
  venvCard.hidden = false;
  venvComplete.hidden = true;
  libraryCard.hidden = true;
  requirementsComplete.hidden = true;
  requirementsInstallCard.hidden = true;
  libraryComplete.hidden = true;
}

function renderEnvironmentNoProject(result) {
  venvCard.dataset.state = "no-project";
  venvStateLabel.textContent = "Waiting";
  venvTitle.textContent = "Create virtual environment";
  venvDescription.textContent =
    "Select a project folder in the top bar. We will create an isolated Python environment here.";
  venvProjectPath.textContent = "Not selected";
  venvFeedback.textContent = "";
  venvHint.textContent = "Select a project folder in the top bar first";
  setEnvironmentButton(false, "Select a folder to begin");
  setEnvironmentVisibility({});
  updateEnvironmentIntro("no-project");
  venvCard.hidden = false;
  venvComplete.hidden = true;
  libraryCard.hidden = true;
  requirementsComplete.hidden = true;
  requirementsInstallCard.hidden = true;
  libraryComplete.hidden = true;
}

function showEnvironmentError(error) {
  if (venvCard.hidden) {
    return;
  }

  venvCard.dataset.state = "error";
  venvStateLabel.textContent = "Action needed";
  venvTitle.textContent = "Virtual environment creation failed";
  venvDescription.textContent =
    "The environment was not created. Resolve the error below, then try again.";
  venvFeedback.textContent =
    error.message || "Unable to read the virtual environment status. Please try again.";
  setEnvironmentButton(
    Boolean(selectedProjectPath) && !isCreatingEnvironment,
    selectedProjectPath ? "Retry creation" : "Select a folder to begin",
  );
  setEnvironmentVisibility({});
  venvCard.hidden = false;
  venvComplete.hidden = true;
  libraryCard.hidden = true;
  requirementsComplete.hidden = true;
  requirementsInstallCard.hidden = true;
  libraryComplete.hidden = true;
}

async function refreshEnvironmentStatus() {
  if (isCreatingEnvironment) {
    return;
  }

  const response = await fetch("/api/environment", {
    method: "GET",
    cache: "no-store",
  });
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "Unable to read the virtual environment status.");
  }

  if (result.state === "ready") {
    renderEnvironmentReady(result);
  } else if (result.state === "no-project") {
    renderEnvironmentNoProject(result);
  } else {
    renderEnvironmentMissing(result);
  }
}

async function createEnvironment() {
  if (isCreatingEnvironment || !selectedProjectPath) {
    return;
  }

  isCreatingEnvironment = true;
  venvCard.dataset.state = "creating";
  venvStateLabel.textContent = "In progress";
  venvTitle.textContent = "Creating virtual environment";
  venvDescription.textContent =
    "Creating .venv and validating its Python installation. The first run may take a moment.";
  venvFeedback.textContent = "";
  venvHint.textContent = "Keep the app running";
  setEnvironmentButton(false, "Creating...");
  setEnvironmentVisibility({ working: true });
  venvCard.hidden = false;
  venvComplete.hidden = true;
  libraryCard.hidden = true;
  requirementsComplete.hidden = true;
  requirementsInstallCard.hidden = true;
  libraryComplete.hidden = true;
  selectFolderButton.disabled = true;

  try {
    const response = await fetch("/api/environment", {
      method: "POST",
      cache: "no-store",
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.message || "Virtual environment creation failed.");
    }

    renderEnvironmentReady(result);
  } catch (error) {
    showEnvironmentError(error);
  } finally {
    isCreatingEnvironment = false;
    selectFolderButton.disabled = false;
  }
}

function updateLibraryControls() {
  const selectedCount = libraryCatalog.filter((library) =>
    selectedLibraries.has(library.id),
  ).length;
  const allSelected =
    libraryCatalog.length > 0 &&
    selectedCount === libraryCatalog.length;

  selectedLibraryCount.textContent =
    selectedCount > 0 ? `${selectedCount} selected` : "Nothing selected";
  selectAllLibrariesButton.textContent = allSelected ? "Clear" : "Select all";
  selectAllLibrariesButton.disabled =
    isGeneratingRequirements || libraryCatalog.length === 0;
  generateRequirementsButton.disabled =
    isGeneratingRequirements || selectedCount === 0;
  generateRequirementsLabel.textContent =
    selectedCount > 0
      ? `Generate requirements.txt (${selectedCount})`
      : "Generate requirements.txt";
}

function renderLibraryList(libraries) {
  libraryCatalog = libraries;
  libraryList.replaceChildren();

  if (!hasInitializedLibrarySelection && selectedLibraries.size === 0) {
    for (const library of libraries) {
      selectedLibraries.add(library.id);
    }
    hasInitializedLibrarySelection = true;
  }

  const knownIds = new Set(libraries.map((library) => library.id));

  for (const libraryId of selectedLibraries) {
    if (!knownIds.has(libraryId)) {
      selectedLibraries.delete(libraryId);
    }
  }

  for (const library of libraries) {
    const option = document.createElement("label");
    option.className = "library-option";
    option.classList.toggle("is-installed", library.installed);
    option.dataset.libraryId = library.id;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = library.id;
    checkbox.checked = selectedLibraries.has(library.id);
    checkbox.disabled = isGeneratingRequirements;
    checkbox.setAttribute("aria-label", `Select ${library.displayName}`);
    checkbox.addEventListener("change", () => {
      hasInitializedLibrarySelection = true;

      if (checkbox.checked) {
        selectedLibraries.add(library.id);
      } else {
        selectedLibraries.delete(library.id);
      }
      updateLibraryControls();
    });

    const copy = document.createElement("span");
    copy.className = "library-option-copy";

    const nameLine = document.createElement("span");
    nameLine.className = "library-name-line";
    const name = document.createElement("strong");
    name.textContent = library.displayName;
    const badge = document.createElement("span");
    badge.className = "library-badge";
    badge.textContent = library.badge;
    nameLine.append(name, badge);

    const description = document.createElement("p");
    description.textContent = library.description;
    copy.append(nameLine, description);

    const status = document.createElement("span");
    status.className = "library-status";
    status.textContent = library.installed
      ? `v${library.version}`
      : "Not installed";

    option.append(checkbox, copy, status);
    libraryList.append(option);
  }

  updateLibraryControls();
}

function renderLibraryComplete(libraries) {
  installedLibraryList.replaceChildren();

  for (const library of libraries) {
    const item = document.createElement("span");
    item.className = "installed-library-item";
    item.textContent = library.displayName;

    const version = document.createElement("span");
    version.textContent = library.version ? `v${library.version}` : "Installed";
    item.append(version);
    installedLibraryList.append(item);
  }

  libraryComplete.open = false;
}

function renderRequirementsComplete(requirements) {
  requirementsCompleteSummary.textContent =
    `${requirements.requirements.length} dependencies written to the manifest`;
  requirementsCompletePath.textContent = `${requirements.path} (project root)`;
  requirementsComplete.open = false;
}

function getRequirementStatusText(requirement) {
  if (requirement.installed) {
    return requirement.reason
      ? "Version mismatch"
      : requirement.version
        ? `v${requirement.version}`
        : "Installed";
  }

  if (requirement.reason === "VERSION_MISMATCH") {
    return `v${requirement.version} · Version mismatch`;
  }

  if (requirement.reason === "INVALID_OR_UNCHECKABLE") {
    return "Unable to verify";
  }

  return "Not installed";
}

function renderRequirementStatus(requirements, pipAvailable) {
  const items = requirements.requirements;
  const installedCount = items.filter((item) => item.installed).length;
  const remainingCount = items.length - installedCount;

  requirementsStatusList.replaceChildren();

  for (const requirement of items) {
    const item = document.createElement("div");
    item.className = "requirements-status-item";
    item.classList.toggle("is-installed", requirement.installed);

    const copy = document.createElement("span");
    copy.className = "requirements-status-copy";
    const name = document.createElement("strong");
    name.textContent = requirement.packageName;
    const raw = document.createElement("code");
    raw.textContent = requirement.requirement;
    copy.append(name, raw);

    const status = document.createElement("span");
    status.className = "requirements-status-value";
    status.textContent = getRequirementStatusText(requirement);

    item.append(copy, status);
    requirementsStatusList.append(item);
  }

  requirementsInstallProgress.textContent =
    `${installedCount}/${items.length} requirements satisfied`;
  requirementsInstallFeedback.dataset.kind =
    requirements.allInstalled ? "success" : "";

  if (items.length === 0) {
    requirementsInstallFeedback.textContent =
      "requirements.txt has no dependencies to check. Regenerate the manifest.";
  } else if (requirements.allInstalled) {
    requirementsInstallFeedback.textContent =
      "All dependencies in requirements.txt are installed.";
  } else {
    requirementsInstallFeedback.textContent =
      `${remainingCount} requirements are still unsatisfied. Finish the installation in your terminal, then select “Check installation.”`;
  }

  if (!pipAvailable) {
    requirementsInstallFeedback.dataset.kind = "error";
    requirementsInstallFeedback.textContent +=
      " pip is not available in the current virtual environment. Recreate the virtual environment.";
  }
}

function renderRequirementsInstallStep(result) {
  const requirements = result.requirements;

  requirementsInstallCard.hidden = false;
  requirementsInstallCard.dataset.state = "ready";
  requirementsInstallStateLabel.textContent = "In progress";
  requirementsInstallTitle.textContent = "Install project dependencies";
  requirementsInstallCommand.textContent =
    result.installCommand ||
    ".\\.venv\\Scripts\\python.exe -m pip install -r requirements.txt";
  requirementsCheckWorking.hidden = true;
  checkRequirementsButton.disabled = false;
  checkRequirementsLabel.textContent = "Check installation";
  repairRequirementsButton.disabled = false;
  renderRequirementStatus(requirements, result.pipAvailable);
  pageTitle.textContent = "Install the dependencies in requirements.txt.";
  introDescription.textContent =
    "Copy the command above into a project terminal. When installation finishes, return here and check that every dependency passes.";
}

function renderLibraryState(result) {
  libraryCatalog = result.libraries;
  libraryPipAvailable = Boolean(result.pipAvailable);
  libraryComplete.hidden = true;
  requirementsComplete.hidden = true;
  requirementsInstallCard.hidden = true;
  libraryCard.hidden = true;

  if (result.requirements?.exists) {
    renderRequirementsComplete(result.requirements);
    requirementsComplete.hidden = false;

    if (result.requirements.allInstalled) {
      renderLibraryComplete(
        result.requirements.requirements.map((requirement) => ({
          displayName: requirement.packageName,
          version: requirement.version,
        })),
      );
      libraryCompleteSummary.textContent =
        `All ${result.requirements.requirements.length} dependencies are installed and verified`;
      libraryComplete.hidden = false;
      pageTitle.textContent = "Dependency installation complete.";
      introDescription.textContent =
        "Every dependency in requirements.txt passed the check. You can continue learning.";
      return;
    }

    renderRequirementsInstallStep(result);
    return;
  }

  libraryCard.hidden = false;
  libraryCard.dataset.state = "ready";
  libraryStateLabel.textContent = "In progress";
  libraryTitle.textContent = "Create dependency manifest";
  libraryFeedback.textContent = "";
  libraryFeedback.dataset.kind = "";
  libraryWorking.hidden = true;
  renderLibraryList(result.libraries);
  pageTitle.textContent = "Generate the project dependency manifest first.";
  introDescription.textContent =
    "Select Generate requirements.txt to create the manifest in the current project, then follow the next instructions to install.";
}

function showLibraryError(error) {
  requirementsComplete.hidden = true;
  requirementsInstallCard.hidden = true;
  libraryComplete.hidden = true;
  libraryCard.hidden = false;
  libraryCard.dataset.state = "error";
  libraryStateLabel.textContent = "Action needed";
  libraryTitle.textContent = "Unable to load Python packages";
  libraryFeedback.dataset.kind = "error";
  libraryFeedback.textContent =
    error.message || "Unable to load Python package status. Please try again.";
  libraryWorking.hidden = true;
  generateRequirementsButton.disabled = true;
}

async function loadLibraryStatus() {
  const response = await fetch("/api/libraries", {
    method: "GET",
    cache: "no-store",
  });
  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "Unable to load Python package status.");
  }

  if (result.state !== "ready") {
    libraryCard.hidden = true;
    requirementsComplete.hidden = true;
    requirementsInstallCard.hidden = true;
    return;
  }

  renderLibraryState(result);
}

function toggleAllLibraries() {
  const libraries = libraryCatalog;

  if (libraries.length === 0 || isGeneratingRequirements) {
    return;
  }

  const allSelected = libraries.every((library) =>
    selectedLibraries.has(library.id),
  );

  hasInitializedLibrarySelection = true;

  for (const library of libraries) {
    if (allSelected) {
      selectedLibraries.delete(library.id);
    } else {
      selectedLibraries.add(library.id);
    }
  }

  for (const checkbox of libraryList.querySelectorAll("input:not(:disabled)")) {
    checkbox.checked = selectedLibraries.has(checkbox.value);
  }

  updateLibraryControls();
}

async function generateRequirements() {
  const libraryIds = new Set(libraryCatalog.map((library) => library.id));
  const libraries = [...selectedLibraries].filter((id) => libraryIds.has(id));

  if (libraries.length === 0 || isGeneratingRequirements) {
    return;
  }

  isGeneratingRequirements = true;
  libraryCard.dataset.state = "generating";
  libraryStateLabel.textContent = "In progress";
  libraryTitle.textContent = "Generating dependency manifest";
  libraryFeedback.textContent = "";
  libraryFeedback.dataset.kind = "";
  libraryWorking.hidden = false;
  generateRequirementsButton.disabled = true;
  selectAllLibrariesButton.disabled = true;

  for (const checkbox of libraryList.querySelectorAll("input")) {
    checkbox.disabled = true;
  }

  try {
    const response = await fetch("/api/libraries/requirements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ libraries }),
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.message || "Failed to generate requirements.txt.");
    }

    await loadLibraryStatus();
  } catch (error) {
    libraryCard.dataset.state = "error";
    libraryStateLabel.textContent = "Action needed";
    libraryTitle.textContent = "Unable to generate dependency manifest";
    libraryFeedback.dataset.kind = "error";
    libraryFeedback.textContent =
      error.message || "Unable to generate requirements.txt. Please try again.";
  } finally {
    isGeneratingRequirements = false;
    libraryWorking.hidden = true;
    updateLibraryControls();
  }
}

async function checkRequirementsInstallation() {
  if (isCheckingRequirements) {
    return;
  }

  isCheckingRequirements = true;
  requirementsCheckWorking.hidden = false;
  requirementsInstallFeedback.textContent = "";
  requirementsInstallFeedback.dataset.kind = "";
  checkRequirementsButton.disabled = true;
  repairRequirementsButton.disabled = true;
  checkRequirementsLabel.textContent = "Checking...";

  try {
    await loadLibraryStatus();
  } catch (error) {
    requirementsInstallCard.dataset.state = "error";
    requirementsInstallStateLabel.textContent = "Action needed";
    requirementsInstallTitle.textContent = "Unable to complete the check";
    requirementsInstallFeedback.dataset.kind = "error";
    requirementsInstallFeedback.textContent =
      error.message || "Unable to check installation status. Please try again.";
  } finally {
    isCheckingRequirements = false;
    requirementsCheckWorking.hidden = true;

    if (!requirementsInstallCard.hidden) {
      checkRequirementsButton.disabled = false;
      checkRequirementsLabel.textContent = "Check installation";
      repairRequirementsButton.disabled = false;
    }
  }
}

async function copyRequirementsCommand() {
  try {
    await navigator.clipboard.writeText(
      requirementsInstallCommand.textContent.trim(),
    );
    copyRequirementsCommandButton.textContent = "Copied";
    window.setTimeout(() => {
      copyRequirementsCommandButton.textContent = "Copy command";
    }, 1600);
  } catch {
    requirementsInstallFeedback.dataset.kind = "error";
    requirementsInstallFeedback.textContent =
      "Automatic copying failed. Select the command above and copy it manually.";
  }
}

async function repairRequirementsFile() {
  if (isRepairingRequirements) {
    return;
  }

  isRepairingRequirements = true;
  repairRequirementsButton.disabled = true;
  repairRequirementsButton.textContent = "Generating...";
  requirementsInstallFeedback.textContent = "";
  requirementsInstallFeedback.dataset.kind = "";

  try {
    const response = await fetch("/api/libraries/requirements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.message || "Failed to regenerate requirements.txt.");
    }

    await loadLibraryStatus();

    if (!requirementsInstallCard.hidden) {
      requirementsInstallFeedback.dataset.kind = "success";
      requirementsInstallFeedback.textContent =
        "requirements.txt was regenerated. Run the installation command above again.";
    }
  } catch (error) {
    requirementsInstallFeedback.dataset.kind = "error";
    requirementsInstallFeedback.textContent =
      error.message || "Failed to regenerate requirements.txt. Please try again.";
  } finally {
    isRepairingRequirements = false;

    if (!requirementsInstallCard.hidden) {
      repairRequirementsButton.disabled = false;
    }

    repairRequirementsButton.textContent = "Regenerate manifest";
  }
}

async function requestPythonDetection() {
  if (window.pywebview?.api?.detect_python) {
    return window.pywebview.api.detect_python();
  }

  const response = await fetch("/api/python", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Local detection service returned ${response.status}`);
  }

  return response.json();
}

async function loadProject() {
  const response = await fetch("/api/project", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Unable to load project state: ${response.status}`);
  }

  const result = await response.json();

  if (result.selected && result.path) {
    renderProjectSelection(result.path);
  } else {
    renderProjectIdle();
  }
}

async function chooseProjectFolderFromSystem() {
  if (isSelectingFolder) {
    return;
  }

  isSelectingFolder = true;
  selectFolderButton.disabled = true;
  selectFolderButton.setAttribute("aria-busy", "true");
  selectFolderLabel.textContent = "Opening...";

  try {
    const response = await fetch("/api/project/choose", {
      method: "POST",
      cache: "no-store",
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        result.message || `Unable to open the system folder picker: ${response.status}`,
      );
    }

    if (result.selected && result.path) {
      renderProjectSelection(result.path);
    }
  } catch (error) {
    const message =
      error.message || "Unable to open the system folder picker. Please try again.";
    console.error("Project folder selection failed:", error);
    window.alert(message);
  } finally {
    isSelectingFolder = false;
    selectFolderButton.disabled = false;
    selectFolderButton.removeAttribute("aria-busy");
    selectFolderLabel.textContent = selectedProjectPath ? "Change" : "Select";
  }
}

async function detectPython() {
  if (isChecking) {
    return;
  }

  isChecking = true;
  setCheckingState();

  try {
    const result = await requestPythonDetection();

    if (result.found) {
      renderFound(result);
    } else if (result.reason === "NO_PYTHON_FOUND") {
      renderMissing();
    } else {
      renderError(result.message || "The detection service returned an unknown result.");
    }

    renderCheckedTime(result.checkedAt);
  } catch (error) {
    renderError("Unable to connect to the local detection service. Confirm that the app is running.");
    console.error("Python detection failed:", error);
  } finally {
    isChecking = false;
    redetectButton.disabled = false;
    redetectLabel.textContent = "Check again";
  }
}

redetectButton.addEventListener("click", detectPython);
redetectCompleteButton.addEventListener("click", detectPython);
selectFolderButton.addEventListener("click", chooseProjectFolderFromSystem);
createVenvButton.addEventListener("click", createEnvironment);
selectAllLibrariesButton.addEventListener("click", toggleAllLibraries);
generateRequirementsButton.addEventListener("click", generateRequirements);
checkRequirementsButton.addEventListener(
  "click",
  checkRequirementsInstallation,
);
copyRequirementsCommandButton.addEventListener(
  "click",
  copyRequirementsCommand,
);
repairRequirementsButton.addEventListener(
  "click",
  repairRequirementsFile,
);
initializeAllLessonInteractions();
initializeCourseExams();
initializeSetupExamVisibility();
initializeCourseNavigation();
detectPython();
loadProject().catch((error) => {
  console.error("Unable to load project state:", error);
});
