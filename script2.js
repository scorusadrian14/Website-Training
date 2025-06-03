const themes = [
  { name: "Albastru", sidebar: "rgb(79,97,172)", navbar: "assets/navbar-bg-images/navbar-bg1.jpg" },
  { name: "Lila", sidebar: "rgb(175,132,172)", navbar: "assets/navbar-bg-images/navbar-bg2.png" },
  { name: "Portocaliu Rosiatic", sidebar: "rgb(243,118,34)", navbar: "assets/navbar-bg-images/navbar-bg3.png" },
  { name: "Portocaliu", sidebar: "rgb(237,140,35)", navbar: "assets/navbar-bg-images/navbar-bg4.png" },
  { name: "Rosu", sidebar: "rgb(203,61,46)", navbar: "assets/navbar-bg-images/navbar-bg5.png" },
  { name: "Verde", sidebar: "rgb(25,129,65)", navbar: "assets/navbar-bg-images/navbar-bg6.png" }
];

function applyTheme(index) {
  const sidebar = document.querySelector(".sidebar");
  const navbar = document.querySelector(".navbar");
  if (!sidebar || !navbar) return;

  const culoare = themes[index].sidebar;

  sidebar.style.backgroundColor = themes[index].sidebar;
  sidebar.style.padding = "1rem";
  sidebar.style.height = "100%";
  sidebar.style.position = "fixed";
  sidebar.style.top = "56px";
  sidebar.style.left = index === 0 ? "1px" : "0px";
  sidebar.style.width = "250px";
  sidebar.style.overflowY = "auto";

  navbar.style.backgroundImage = `url('${themes[index].navbar}')`;
  navbar.style.backgroundSize = "cover";
  navbar.style.backgroundRepeat = "no-repeat";
  navbar.style.backgroundPosition = "top center";

  document.documentElement.style.setProperty("--tema-color", culoare);

  localStorage.setItem("selectedThemeIndex", index);
}

function setupThemeDropdown() {
  const container = document.getElementById("themeOptions");
  if (!container) return;

  themes.forEach((theme, index) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.className = "dropdown-item";
    btn.textContent = theme.name;
    btn.addEventListener("click", () => {
      applyTheme(index);
    });
    li.appendChild(btn);
    container.appendChild(li);
  });
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }
}

window.onclick = function (event) {
  const modals = document.querySelectorAll(".custom-modal");
  modals.forEach(modal => {
    if (event.target === modal) {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  });
};

// --- Submeniu lateral ---
function toggleSubmenu(event) {
  event.preventDefault();
  event.stopPropagation();

  const link = event.currentTarget;
  const submenu = link.nextElementSibling;

  document.querySelectorAll(".submenu-right").forEach(el => el.classList.remove("show"));
  const rect = link.getBoundingClientRect();
  submenu.style.top = `${rect.top}px`;
  submenu.style.left = `${rect.right + 15}px`;
  submenu.classList.add("show");
}

document.addEventListener("click", () => {
  document.querySelectorAll(".submenu-right").forEach(el => el.classList.remove("show"));
});

// --- Meniu lunar ---
async function genereazaMeniuLunar() {
  const year = new Date().getFullYear();
  const luni = ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie",
                "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"];
  const container = document.getElementById("meniu-luni");
  if (!container) return;

  for (let i = 0; i < 12; i++) {
    const filePath = `program_lunar/${year}/program_lunar_${i + 1}.pdf`;
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.className = "nav-link";
    a.textContent = luni[i];

    try {
      const response = await fetch(filePath, { method: "HEAD" });
      if (response.ok) {
        a.href = filePath;
        a.target = "_blank";
      }
    } catch (err) {}

    li.appendChild(a);
    container.appendChild(li);
  }
}

// --- Oferta cursuri ---
function genereazaOfertaCursuri() {
  const year = 2025;
  const luni = ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie",
                "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"];
  const container = document.getElementById("meniu-oferta-cursuri");
  if (!container) return;

  const liAnual = document.createElement("li");
  const aAnual = document.createElement("a");
  aAnual.className = "nav-link";
  aAnual.textContent = "📄 Oferta anuală";
  aAnual.href = `oferta_cursuri/${year}/oferta_anuala.pdf`;
  aAnual.target = "_blank";
  liAnual.appendChild(aAnual);
  container.appendChild(liAnual);

  luni.forEach((luna, i) => {
    const filePath = `oferta_cursuri/${year}/oferta_cursuri_${i + 1}.pdf`;
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.className = "nav-link";
    a.textContent = luna;

    fetch(filePath, { method: "HEAD" })
      .then(response => {
        if (response.ok) {
          a.href = filePath;
          a.target = "_blank";
        }
      })
      .catch(() => {});

    li.appendChild(a);
    container.appendChild(li);
  });
}

// --- Activități pe săptămâni ---
function getWorkWeekRange(year, week) {
  const firstDay = new Date(year, 0, 1 + (week - 1) * 7);
  const day = firstDay.getDay();
  const mondayOffset = day <= 4 ? 1 - day : 8 - day;
  const monday = new Date(firstDay.setDate(firstDay.getDate() + mondayOffset));
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);

  const formatDate = d =>
    `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;

  return `${formatDate(monday)}-${formatDate(friday)}`;
}

async function genereazaTabelActivitati() {
  const tbody = document.getElementById("tabel-saptamani");
  if (!tbody) return;

  const year = new Date().getFullYear();
  const totalSaptamani = (() => {
    const lastDay = new Date(year, 11, 31);
    return Math.ceil((((lastDay - new Date(year, 0, 1)) / 86400000) + new Date(year, 0, 1).getDay() + 1) / 7);
  })();

  for (let sapt = 1; sapt <= totalSaptamani; sapt++) {
    const perioada = getWorkWeekRange(year, sapt);
    const filePath = `activitati_simulator/${year}/activitati_simulator_${sapt}.pdf`;

    const tr = document.createElement("tr");
    const tdSapt = document.createElement("td");
    tdSapt.textContent = `S${sapt}`;
    const tdProg = document.createElement("td");

    try {
      const response = await fetch(filePath, { method: "HEAD" });
      if (response.ok) {
        const a = document.createElement("a");
        a.href = filePath;
        a.textContent = perioada;
        a.target = "_blank";
        tdProg.appendChild(a);
      } else {
        tdProg.textContent = perioada;
      }
    } catch {
      tdProg.textContent = perioada;
    }

    tr.appendChild(tdSapt);
    tr.appendChild(tdProg);
    tbody.appendChild(tr);
  }
}

// --- includeHTML async ---
async function includeHTML(id, url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Nu s-a putut încărca ${url}`);
    const html = await response.text();
    document.getElementById(id).innerHTML = html;
  } catch (err) {
    console.error(err);
  }
}

// --- Inițializare sincronizată ---
window.addEventListener('DOMContentLoaded', () => {
  const index = parseInt(localStorage.getItem("selectedThemeIndex"));
  const themeIndex = !isNaN(index) ? index : 0;

  Promise.all([
    includeHTML("navbar-placeholder", "navbar.html"),
    includeHTML("sidebar-placeholder", "sidebar.html")
  ]).then(() => {
    setupThemeDropdown();
    applyTheme(themeIndex);
    genereazaMeniuLunar();
    genereazaOfertaCursuri();
    genereazaTabelActivitati();
  });
});