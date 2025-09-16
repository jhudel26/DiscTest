const COLS = ["D", "I", "S", "C"];
const TYPE_INFO = {
  D: {
    name: "Dominance (D)",
    desc: "Bold, decisive, results-driven. Takes charge, moves fast, embraces challenges.",
    known: "Examples: Steve Jobs, Serena Williams",
    colorVar: "--d",
  },
  I: {
    name: "Influence (I)",
    desc: "Enthusiastic, social, inspiring. Energizes groups and communicates with optimism.",
    known: "Examples: Oprah Winfrey, Will Smith",
    colorVar: "--i",
  },
  S: {
    name: "Steadiness (S)",
    desc: "Patient, dependable, calm. Values harmony, empathy, and consistent support.",
    known: "Examples: Mahatma Gandhi, Mr. Rogers",
    colorVar: "--s",
  },
  C: {
    name: "Conscientious (C)",
    desc: "Analytical, precise, quality-focused. Seeks accuracy, logic, and clear standards.",
    known: "Examples: Marie Curie, Bill Gates",
    colorVar: "--c",
  },
};

const body = document.getElementById("disc-body");
const submitBtn = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");
const resultCard = document.getElementById("result-card");
const typeBadge = document.getElementById("type-badge");
const typeDesc = document.getElementById("type-desc");
const typeKnown = document.getElementById("type-known");
const scoreBar = document.getElementById("score-bar");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const rankInputs = document.querySelectorAll(".rank-input");
// theme toggle removed

// Build score bars
COLS.forEach((col) => {
  const wrapper = document.createElement("div");
  const bar = document.createElement("div");
  bar.className = "bar";
  bar.dataset.col = col;
  const fill = document.createElement("span");
  bar.appendChild(fill);
  const label = document.createElement("div");
  label.className = "label";
  label.textContent = col;
  wrapper.appendChild(bar);
  wrapper.appendChild(label);
  scoreBar.appendChild(wrapper);
});

// Validate row inputs: presence, range, and uniqueness of 1..4
function validateRow(rowEl) {
  const inputs = Array.from(rowEl.querySelectorAll("input.rank-input"));
  let valid = true;
  const values = [];
  for (const input of inputs) {
    input.classList.remove("invalid");
    const raw = input.value.trim();
    if (!raw) { valid = false; input.classList.add("invalid"); continue; }
    const num = Number(raw);
    if (!Number.isInteger(num) || num < 1 || num > 4) { valid = false; input.classList.add("invalid"); continue; }
    values.push(num);
  }
  if (values.length === 4) {
    const set = new Set(values);
    if (set.size !== 4) {
      valid = false;
      inputs.forEach((i) => i.classList.add("invalid"));
    }
  }
  return valid;
}

function updateProgressAndState() {
  const rows = Array.from(body.querySelectorAll("tr"));
  let filledInputs = 0;
  let totalInputs = 0;
  let allValid = true;
  rows.forEach((row) => {
    const inputs = Array.from(row.querySelectorAll("input.rank-input"));
    totalInputs += inputs.length;
    inputs.forEach((i) => { if (i.value.trim() !== "") filledInputs += 1; });
    if (!validateRow(row)) allValid = false;
  });
  const pct = Math.round((filledInputs / totalInputs) * 100);
  if (progressBar) progressBar.style.width = pct + "%";
  if (progressText) progressText.textContent = pct + "% complete";
  // Live score bars (treat blanks as 0)
  const totals = computeScores();
  updateScoreBars(totals);
  // Enable submit only when all rows are valid
  if (submitBtn) submitBtn.disabled = !allValid;
}

// Attach listeners
Array.from(body.querySelectorAll("tr")).forEach((row) => {
  row.addEventListener("input", updateProgressAndState);
});

function validateAllRows() {
  const rows = Array.from(body.querySelectorAll("tr"));
  for (const row of rows) {
    const ok = validateRow(row);
    if (!ok) return { ok: false, message: "Each row must use 1, 2, 3, and 4 exactly once." };
  }
  return { ok: true };
}

function computeScores() {
  const totals = { D: 0, I: 0, S: 0, C: 0 };
  Array.from(body.querySelectorAll("tr")).forEach((row) => {
    Array.from(row.querySelectorAll("td")).forEach((cell) => {
      const col = cell.dataset.col;
      const valueEl = cell.querySelector("input.rank-input");
      const value = Number(valueEl.value || 0);
      totals[col] += value;
    });
  });
  return totals;
}

function highestType(totals) {
  const entries = Object.entries(totals);
  entries.sort((a, b) => b[1] - a[1]);
  const top = entries[0];
  // Ties: prefer D > I > S > C order if equal
  const topScore = top[1];
  const tie = entries.filter((e) => e[1] === topScore).map((e) => e[0]);
  if (tie.length > 1) {
    const order = ["D", "I", "S", "C"];
    tie.sort((a, b) => order.indexOf(a) - order.indexOf(b));
    return tie[0];
  }
  return top[0];
}

function updateScoreBars(totals) {
  const maxPossible = 4 * 5; // 4 per row * 5 rows
  COLS.forEach((col) => {
    const bar = scoreBar.querySelector(`.bar[data-col="${col}"] > span`);
    const pct = Math.round((totals[col] / maxPossible) * 100);
    bar.style.width = pct + "%";
  });
}

function showResult(totals) {
  const type = highestType(totals);
  const params = new URLSearchParams({ type, D: String(totals.D), I: String(totals.I), S: String(totals.S), C: String(totals.C) });
  window.location.href = `result.html?${params.toString()}`;
}

submitBtn.addEventListener("click", () => {
  const valid = validateAllRows();
  if (!valid.ok) {
    alert(valid.message);
    return;
  }
  const totals = computeScores();
  showResult(totals);
});

resetBtn.addEventListener("click", () => {
  Array.from(document.querySelectorAll("input.rank-input")).forEach((i) => {
    i.value = "";
    i.classList.remove("invalid");
  });
  Array.from(body.querySelectorAll("tr")).forEach((row) => validateRow(row));
  resultCard.classList.add("hidden");
  updateScoreBars({ D: 0, I: 0, S: 0, C: 0 });
  typeBadge.textContent = "—";
  typeBadge.style.background = "white";
  typeDesc.textContent = "";
  typeKnown.textContent = "";
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (submitBtn) submitBtn.disabled = true;
  if (progressBar) progressBar.style.width = "0%";
  if (progressText) progressText.textContent = "0% complete";
});

// theme toggle removed

// initialize
function enforceRowUniqueness() {
  // Validation already enforces uniqueness; this function wires initial UI state
  updateProgressAndState();
}
enforceRowUniqueness();
updateScoreBars({ D: 0, I: 0, S: 0, C: 0 });


