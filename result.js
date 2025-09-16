const COLS = ["D", "I", "S", "C"];
const TYPE_INFO = {
  D: {
    name: "Dominance (D)",
    desc: "Bold, Decisive, Results-driven. Takes charge, Moves fast, Persistent, Adventurous, Problem Solver, Direct and Embraces challenges.",
    people: [
      { name: "Steve Jobs", img: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Steve_Jobs_Headshot_2010-CROP.jpg" },
      { name: "Serena Williams", img: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Serena_Williams_2013_US_Open_%289658609997%29.jpg" }
    ],
    colorVar: "--d",
    illustration: "d",
  },
  I: {
    name: "Influence (I)",
    desc: "Enthusiastic, Social, Inspiring. Energizes groups, Charming, Confident, Convincing, Sociable, Trusting and Communicates with optimism.",
    people: [
      { name: "Oprah Winfrey", img: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Oprah_in_2014.jpg" },
      { name: "Will Smith", img: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Will_Smith_by_Gage_Skidmore_2.jpg" }
    ],
    colorVar: "--i",
    illustration: "i",
  },
  S: {
    name: "Steadiness (S)",
    desc: "Patient, Dependable, Calm. Values harmony, Empathy, Understanding, Friendly, Good listener, Relaxed, Sincere, Stable, Team Player and Consistent support.",
    people: [
      { name: "Mahatma Gandhi", img: "https://upload.wikimedia.org/wikipedia/commons/d/d1/Portrait_Gandhi.jpg" },
      { name: "Fred Rogers", img: "https://upload.wikimedia.org/wikipedia/commons/2/20/Fred_Rogers_%281969_publicity_photo%29.jpg" }
    ],
    colorVar: "--s",
    illustration: "s",
  },
  C: {
    name: "Conscientious (C)",
    desc: "Analytical, Precise, Quality-focused, Logical, Accurate, Compliant, Courteous, Detailed, Diplomatic, Fact-finder, Objective and Clear standards.",
    people: [
      { name: "Marie Curie", img: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Marie_Curie_c1920.jpg" },
      { name: "Bill Gates", img: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Bill_Gates_2018.jpg" }
    ],
    colorVar: "--c",
    illustration: "c",
  },
};

function parseQuery() {
  const params = new URLSearchParams(location.search);
  const scores = {};
  for (const col of COLS) {
    const v = Number(params.get(col) || 0);
    scores[col] = Number.isFinite(v) ? v : 0;
  }
  let type = params.get("type");
  if (!COLS.includes(type)) {
    type = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
  }
  return { type, scores };
}

function updateScoreBars(scores) {
  const barsWrap = document.getElementById("traits-bars");
  barsWrap.innerHTML = "";
  const maxPossible = 4 * 5;
  const colorVars = { D: "--d", I: "--i", S: "--s", C: "--c" };
  const labels = { D: "Dominance", I: "Influence", S: "Steadiness", C: "Conscientious" };
  COLS.forEach((col) => {
    const row = document.createElement("div");
    row.className = "trait";

    const left = document.createElement("div");
    left.className = "trait__label";
    const dot = document.createElement('span');
    dot.className = 'trait__dot';
    dot.style.background = getComputedStyle(document.documentElement).getPropertyValue(colorVars[col]) || '#fff';
    const label = document.createElement('span');
    label.textContent = labels[col];
    left.appendChild(dot);
    left.appendChild(label);

    const bar = document.createElement("div");
    bar.className = "trait__bar";
    const fill = document.createElement("span");
    const pct = Math.round((scores[col] / maxPossible) * 100);
    fill.style.width = pct + "%";
    fill.style.background = getComputedStyle(document.documentElement).getPropertyValue(colorVars[col]) || "#fff";
    bar.appendChild(fill);

    const right = document.createElement("div");
    right.className = "trait__value";
    right.textContent = pct + "%";

    row.appendChild(left);
    row.appendChild(bar);
    row.appendChild(right);
    barsWrap.appendChild(row);
  });
}

async function renderPeople(type) {
  const wrap = document.getElementById("people");
  wrap.innerHTML = "";
  const info = TYPE_INFO[type];
  const entries = await resolveLocalPeopleByName(info.people);
  entries.forEach((p) => {
    if (!p.url) return;
    const card = document.createElement("div");
    card.className = "person";
    const img = document.createElement("img");
    img.src = p.url;
    img.alt = p.name;
    const name = document.createElement("div");
    name.className = "person__name";
    name.textContent = p.name || "";
    card.appendChild(img);
    card.appendChild(name);
    wrap.appendChild(card);
  });
}

function init() {
  const { type, scores } = parseQuery();
  const info = TYPE_INFO[type];
  document.getElementById("type-title").textContent = info.name.replace(/\s*\(.+\)/, "");
  const color = getComputedStyle(document.documentElement).getPropertyValue(info.colorVar) || "white";
  const chip = document.getElementById("type-chip");
  chip.textContent = info.name;
  chip.style.background = color;
  chip.style.color = "#0b1020";
  // Nickname under title
  const nickMap = { D: 'The Winner', I: 'The Enthusiast', S: 'The Peacekeeper', C: 'The Analyst' };
  const nick = document.getElementById('type-nickname');
  if (nick) {
    nick.textContent = nickMap[type];
    nick.style.color = color.trim() || '#fff';
  }
  // Page glow by type color
  const app = document.getElementById('result-app');
  if (app) {
    app.style.setProperty('--glow', color.trim() || '#ffffff');
  }
  // Illustration: try user images first, then fallback to generated SVG
  trySetIllustration(type, color.trim() || "#fff");
  updateScoreBars(scores);
  // Side highlight: show the top trait with percentage
  const maxPossible = 4 * 5;
  const entries = Object.entries(scores).sort((a,b)=>b[1]-a[1]);
  const top = entries[0];
  const pct = Math.round((top[1] / maxPossible) * 100);
  const titleMap = { D: "Dominance", I: "Influence", S: "Steadiness", C: "Conscientious" };
  document.getElementById("side-title").textContent = titleMap[top[0]];
  document.getElementById("side-percent").textContent = pct + "%";
  document.getElementById("side-blurb").textContent = info.desc;
  renderPeople(type);
}

function buildIllustrationSVG(type, color) {
  const bg = encodeURIComponent(color);
  const accent = {
    D: '#ff6b6b',
    I: '#feca57',
    S: '#1dd1a1',
    C: '#54a0ff'
  }[type] || '#888888';
  const ac = encodeURIComponent(accent);
  return `<?xml version="1.0" encoding="UTF-8"?>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 300">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${bg}" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="${bg}" stop-opacity="0.05"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <circle cx="120" cy="150" r="70" fill="${ac}" opacity="0.85"/>
    <rect x="210" y="110" width="280" height="80" rx="16" fill="${ac}" opacity="0.25"/>
    <rect x="230" y="125" width="200" height="18" rx="9" fill="${ac}" opacity="0.6"/>
    <rect x="230" y="155" width="140" height="14" rx="7" fill="${ac}" opacity="0.6"/>
  </svg>`;
}

function imageExists(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

async function trySetIllustration(type, color) {
  const ill = document.getElementById('type-illustration');
  const explicitMap = { D: 'dominance.png', I: 'Influence.png', S: 'Steadiness.png', C: 'conscientiousness.png' };
  const mapped = explicitMap[type];
  const candidates = [
    mapped ? `img/${mapped}` : null,
    `img/profile_illustration_${type}.webp`,
    `img/profile_illustration_${type}.png`,
    `img/profile_illustration_${type}.jpg`,
    `img/profile_illustration_${type}.jpeg`,
    `img/profile_illustration.webp`,
    `img/profile_illustration.png`,
    `img/profile_illustration.jpg`,
    `img/profile_illustration.jpeg`,
  ].filter(Boolean);
  for (const url of candidates) {
    // eslint-disable-next-line no-await-in-loop
    if (await imageExists(url)) {
      ill.style.backgroundImage = `url('${url}')`;
      ill.style.backgroundSize = 'cover';
      ill.style.backgroundPosition = 'center';
      return;
    }
  }
  const svg = buildIllustrationSVG(type, color);
  ill.style.backgroundImage = `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
}

async function resolveLocalKnownImages(type, count) {
  const baseNames = {
    D: ["d1", "d2", "d3", "d4"],
    I: ["i1", "i2", "i3", "i4"],
    S: ["s1", "s2", "s3", "s4"],
    C: ["c1", "c2", "c3", "c4"],
  }[type] || [];
  const results = [];
  for (let i = 0; i < count; i++) {
    const name = baseNames[i] || `p${i+1}`;
    const candidates = [
      `img/${name}.webp`,
      `img/${name}.png`,
      `img/${name}.jpg`,
      `img/${name}.jpeg`,
      `img/${type}_${i+1}.webp`,
      `img/${type}_${i+1}.png`,
      `img/${type}_${i+1}.jpg`,
      `img/${type}_${i+1}.jpeg`,
    ];
    // eslint-disable-next-line no-await-in-loop
    const found = await firstExisting(candidates);
    results.push(found);
  }
  return results;
}

async function firstExisting(candidates) {
  for (const url of candidates) {
    // eslint-disable-next-line no-await-in-loop
    if (await imageExists(url)) return url;
  }
  return null;
}

async function resolveLocalPeopleByName(defaultPeople) {
  const normalized = defaultPeople.map((p) => ({ name: p.name, slug: slugifyName(p.name) }));
  const results = [];
  for (const p of normalized) {
    const candidates = [
      `img/${p.slug}.png`,
      `img/${p.slug}.jpg`,
      `img/${p.slug}.jpeg`,
    ];
    // eslint-disable-next-line no-await-in-loop
    const found = await firstExisting(candidates);
    results.push({ name: p.name, url: found || null });
  }
  // If none found, fall back to remote defaults
  if (!results.some((r) => r.url)) {
    return defaultPeople.map((p) => ({ name: p.name, url: p.img }));
  }
  return results;
}

function slugifyName(name) {
  const fixes = {
    'steave jobs': 'steve jobs',
    'ophra winfrey': 'oprah winfrey',
    'mahatma gabdhi': 'mahatma gandhi',
  };
  const lower = name.toLowerCase();
  const fixed = fixes[lower] || lower;
  return fixed.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

init();


