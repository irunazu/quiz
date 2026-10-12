/* =================================================================
   ⚙️ НАСТРОЙКИ
   ================================================================= */
const TEACHER_EMAIL = "ilmiralove78@mail.ru"; // ← ЗАМЕНИТЕ НА СВОЙ EMAIL
const TEACHER_PASSWORD = "regfxcdgr";      // ← пароль учителя
const STORAGE_KEY = "quiz_results_6class_v1";

/* =================================================================
   📚 БАНК ВОПРОСОВ
   ================================================================= */
const QUESTIONS_BANK = [
  // --- Кубок ---
  {
    text: "Кто автор баллады «Кубок»?",
    keywords: ["жуковск"],
    correct: "В. А. Жуковский (перевод баллады Ф. Шиллера)"
  },
  // --- Илья Муромец и Соловей-разбойник ---
  {
    text: "Как звали богатыря, который победил Соловья-разбойника и привёз его в Киев к князю Владимиру?",
    keywords: ["илья", "муромец"],
    correct: "Илья Муромец"
  },
  {
    text: "Где сидел Соловей-разбойник, поджидая путников?",
    keywords: ["смородин", "дуб", "река", "реки", "дорог"],
    correct: "У реки Смородины, на дубах (на прямой дороге)"
  },
  // --- Песнь о Роланде ---
  {
    text: "Кто предал Роланда и его войско в «Песни о Роланде»?",
    keywords: ["ганелон"],
    correct: "Ганелон"
  },
  {
    text: "Как называется боевой рог рыцаря Роланда?",
    keywords: ["олифант"],
    correct: "Олифант"
  },
  // --- Вересковый мёд ---
  {
    text: "Какой древний народ варил вересковый мёд в балладе Р. Л. Стивенсона?",
    keywords: ["пикт"],
    correct: "Пикты"
  },
  {
    text: "Кого старик-пикт убил, чтобы тайна верескового мёда не досталась королю?",
    keywords: ["сын"],
    correct: "Своего сына"
  },
  // --- Перчатка ---
  {
    text: "Кто перевёл балладу «Перчатка» на русский язык?",
    keywords: ["жуковск"],
    correct: "В. А. Жуковский (перевод баллады Ф. Шиллера)"
  },
  {
    text: "Что сделал рыцарь Делорж, достав перчатку со дна ямы со львами?",
    keywords: ["бросил", "в лицо", "уехал", "покинул", "ушел", "ушёл", "отверг"],
    correct: "Бросил перчатку в лицо даме и уехал (отверг её)"
  },
  // --- Садко ---
  {
    text: "На каком музыкальном инструменте играл Садко?",
    keywords: ["гусл"],
    correct: "Гусли"
  },
  {
    text: "Кто спас Садко из подводного царства?",
    keywords: ["микола", "можайск", "николай"],
    correct: "Микола Можайский (святой Николай Угодник)"
  },
  // --- Вольга и Микула Селянинович ---
  {
    text: "Кем был Микула Селянинович в былине о Вольге?",
    keywords: ["пахарь", "крестьян", "землепаш", "оратай"],
    correct: "Пахарь (крестьянин-землепашец)"
  },
  // --- Теория: фольклор, баллада, былина ---
  {
    text: "Что такое фольклор?",
    keywords: ["устное народное", "народное творчество"],
    correct: "Устное народное творчество"
  },
  {
    text: "Как называется стихотворное произведение с напряжённым сюжетом, часто повествующее о трагических или фантастических событиях?",
    keywords: ["баллад"],
    correct: "Баллада"
  },
  {
    text: "Как называется русская народная эпическая песня о подвигах богатырей?",
    keywords: ["былин"],
    correct: "Былина"
  }
];

/* =================================================================
   🔀 ПЕРЕМЕШИВАНИЕ (алгоритм Фишера–Йетса)
   ================================================================= */
function shuffleArray(arr) {
  const a = arr.slice(); // не мутируем оригинал
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* =================================================================
   🎲 ФОРМИРУЕМ СЛУЧАЙНЫЙ НАБОР ВОПРОСОВ
   ================================================================= */
// Перемешиваем весь банк и берём все 15 (их ровно 15, поэтому выйдут все,
// но в разном порядке). Если в банке станет больше вопросов — можно взять
// только часть. Например, чтобы каждый раз было 10 вопросов из 15:
//   const questions = shuffleArray(QUESTIONS_BANK).slice(0, 10);
const QUESTIONS = shuffleArray(QUESTIONS_BANK);

/* =================================================================
   🧠 ПРОВЕРКА ОТВЕТОВ
   ================================================================= */
function normalize(str) {
  return String(str)
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/\s+/g, " ")
    .trim();
}

function isAnswerCorrect(userAnswer, keywords) {
  const norm = normalize(userAnswer);
  if (!norm) return false;
  return keywords.some(k => norm.includes(normalize(k)));
}

/* =================================================================
   🖼 РЕНДЕР ФОРМЫ
   ================================================================= */
const form = document.getElementById("quizForm");
const borderColors = ["#ff6ec4", "#7873f5", "#4ADEDE", "#FFD93D", "#ff2d95"];

QUESTIONS.forEach((q, i) => {
  const card = document.createElement("div");
  card.className = "card";
  card.style.borderLeftColor = borderColors[i % borderColors.length];
  card.style.animationDelay = (i * 0.05) + "s";
  card.innerHTML = `
    <div class="q-title">
      <span class="question-number">${i + 1}</span>
      <span>${q.text}</span>
    </div>
    <textarea id="q${i}" rows="2" placeholder="Ваш ответ..." maxlength="500"></textarea>
  `;
  form.appendChild(card);
});

/* =================================================================
   📨 ОТПРАВКА РЕЗУЛЬТАТА
   ================================================================= */
const submitBtn = document.getElementById("submitBtn");

submitBtn.addEventListener("click", async () => {
  const name = document.getElementById("studentName").value.trim();
  if (!name) {
    alert("Пожалуйста, введите ваше имя!");
    document.getElementById("studentName").focus();
    return;
  }

  let score = 0;
  const results = QUESTIONS.map((q, i) => {
    const userAnswer = document.getElementById("q" + i).value.trim();
    const correct = isAnswerCorrect(userAnswer, q.keywords);
    if (correct) score++;
    return {
      question: q.text,
      answer: userAnswer || "(нет ответа)",
      correct: q.correct,
      isCorrect: correct
    };
  });

  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  saved.push({
    name,
    score,
    total: QUESTIONS.length,
    answers: results,
    date: new Date().toLocaleString("ru-RU")
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

  showResults(name, score, results);
  sendEmailToTeacher(name, score, results);
});

/* =================================================================
   🎬 ЭКРАН РЕЗУЛЬТАТА
   ================================================================= */
function showResults(name, score, results) {
  document.getElementById("quizView").style.display = "none";
  document.getElementById("successView").style.display = "block";
  document.getElementById("successName").textContent = name;
  document.getElementById("scoreValue").textContent = score;
  document.querySelector(".score-total").textContent = "/ " + QUESTIONS.length;

  const total = QUESTIONS.length;
  const percent = Math.round((score / total) * 100);

  let message = "";
  if (percent === 100) message = "🏆 Блестяще! Ты настоящий знаток литературы!";
  else if (percent >= 80) message = "🌟 Отличный результат! Совсем немного до идеала.";
  else if (percent >= 60) message = "👍 Хорошо! Есть куда расти.";
  else if (percent >= 40) message = "📖 Неплохо, но стоит повторить материал.";
  else message = "💪 Не расстраивайся — перечитай тему и попробуй снова!";
  document.getElementById("scoreMessage").textContent = message;

  const review = document.getElementById("resultsReview");
  review.innerHTML = `
    <h3>Разбор ответов</h3>
    ${results.map((r, i) => `
      <div class="review-item ${r.isCorrect ? "correct" : "wrong"}">
        <span class="review-mark">${r.isCorrect ? "✅" : "❌"}</span>
        <div class="review-content">
          <div class="review-q">${i + 1}. ${r.question}</div>
          <div class="review-student">Ваш ответ: <strong>${escapeHtml(r.answer)}</strong></div>
          ${r.isCorrect ? "" : `<div class="review-correct">Правильно: ${escapeHtml(r.correct)}</div>`}
        </div>
      </div>
    `).join("")}
  `;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* =================================================================
   ✉️ ОТПРАВКА EMAIL УЧИТЕЛЮ
   ================================================================= */
async function sendEmailToTeacher(name, score, results) {
  const statusEl = document.getElementById("emailStatus");

  if (!TEACHER_EMAIL || TEACHER_EMAIL === "еуфсрук@mail.ru") {
    statusEl.textContent = "ℹ️ Email учителя не настроен (см. TEACHER_EMAIL в коде).";
    statusEl.className = "email-status error";
    return;
  }

  statusEl.textContent = "⏳ Отправляем результат учителю...";
  statusEl.className = "email-status sending";

  const total = QUESTIONS.length;
  let body = `Ученик: ${name}\n`;
  body += `Результат: ${score} из ${total} (${Math.round(score/total*100)}%)\n`;
  body += `Дата: ${new Date().toLocaleString("ru-RU")}\n`;
  body += "=".repeat(50) + "\n\n";

  results.forEach((r, i) => {
    body += `${i + 1}. ${r.question}\n`;
    body += `   Ответ ученика: ${r.answer}\n`;
    body += `   Правильный ответ: ${r.correct}\n`;
    body += `   ${r.isCorrect ? "✓ Верно" : "✗ Неверно"}\n\n`;
  });

  try {
    const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(TEACHER_EMAIL)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        _subject: `📚 Викторина 6 класс: ${name} — ${score}/${total}`,
        _template: "box",
        _captcha: "false",
        "Ученик": name,
        "Результат": `${score} из ${total}`,
        "Подробности": body
      })
    });

    if (response.ok) {
      statusEl.textContent = "✅ Результат отправлен учителю на email!";
      statusEl.className = "email-status sent";
    } else {
      throw new Error("Ошибка отправки");
    }
  } catch (err) {
    console.warn("Email error:", err);
    statusEl.textContent = "⚠️ Не удалось отправить email, но результат сохранён на сайте.";
    statusEl.className = "email-status error";
  }
}

/* =================================================================
   👩‍🏫 АДМИН-ПАНЕЛЬ
   ================================================================= */
const adminLink = document.getElementById("adminLink");
const pwdModal = document.getElementById("pwdModal");
const pwdInput = document.getElementById("pwdInput");
const pwdError = document.getElementById("pwdError");

adminLink.addEventListener("click", () => {
  if (sessionStorage.getItem("teacherAuth") === "1") {
    showAdmin();
  } else {
    pwdModal.classList.add("active");
    pwdInput.value = "";
    pwdError.classList.remove("show");
    setTimeout(() => pwdInput.focus(), 100);
  }
});

pwdInput.addEventListener("keydown", e => {
  if (e.key === "Enter") checkPassword();
});

function checkPassword() {
  if (pwdInput.value === TEACHER_PASSWORD) {
    sessionStorage.setItem("teacherAuth", "1");
    closeModal();
    showAdmin();
  } else {
    pwdError.classList.add("show");
    pwdInput.value = "";
    pwdInput.focus();
  }
}

function closeModal() { pwdModal.classList.remove("active"); }

function showAdmin() {
  document.getElementById("quizView").style.display = "none";
  document.getElementById("successView").style.display = "none";
  document.getElementById("adminPanel").style.display = "block";
  renderSubmissions();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function logout() {
  sessionStorage.removeItem("teacherAuth");
  location.reload();
}

function renderSubmissions() {
  const list = document.getElementById("submissionsList");
  const results = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

  if (results.length === 0) {
    list.innerHTML = '<div class="empty">Пока нет отправленных работ 📭</div>';
    return;
  }

  list.innerHTML = results.slice().reverse().map(r => {
    const percent = Math.round((r.score / r.total) * 100);
    const cls = percent >= 80 ? "good" : percent >= 50 ? "mid" : "bad";
    return `
      <div class="submission">
        <div class="meta">
          <span>👤 ${escapeHtml(r.name)}
            <span class="score-badge ${cls}">${r.score}/${r.total}</span>
          </span>
          <span class="date">🕒 ${r.date}</span>
        </div>
        <div class="answers">
          ${r.answers.map((a, i) => `
            <div class="a-item">
              <span class="q-label">${i + 1}.</span> ${escapeHtml(a.answer)}
              <div class="correct-line ${a.isCorrect ? "" : "wrong"}">
                ${a.isCorrect ? "✓ Верно" : "✗ Правильно: " + escapeHtml(a.correct)}
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }).join("");
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function clearAll() {
  if (confirm("Удалить все результаты? Это действие необратимо.")) {
    localStorage.removeItem(STORAGE_KEY);
    renderSubmissions();
  }
}

function exportResults() {
  const results = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  if (results.length === 0) { alert("Нет данных для экспорта."); return; }

  let text = "РЕЗУЛЬТАТЫ ВИКТОРИНЫ (6 класс)\n\n";
  results.forEach((r, i) => {
    text += `${i + 1}. ${r.name} — ${r.score}/${r.total} (${r.date})\n`;
    r.answers.forEach((a, j) => {
      text += `   ${j + 1}) ${a.question}\n`;
      text += `      Ответ: ${a.answer}\n`;
      text += `      Правильно: ${a.correct}\n`;
      text += `      ${a.isCorrect ? "✓" : "✗"}\n`;
    });
    text += "\n" + "-".repeat(50) + "\n\n";
  });

  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "результаты_викторины_6класс.txt";
  a.click();
}