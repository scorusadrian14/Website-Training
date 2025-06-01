// --- Funcții pentru modale ---
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = "block";
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = "none";
}

window.onclick = function (event) {
  const modals = document.querySelectorAll(".custom-modal");
  modals.forEach(modal => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
};

// --- Sidebar: toggle submenu + închidere la click în afară ---
function toggleSubmenu(event) {
  event.preventDefault();
  event.stopPropagation();

  const link = event.currentTarget;
  const submenu = link.nextElementSibling;
  const icon = link.querySelector('.submenu-icon');

  // Închide celelalte
  document.querySelectorAll('.submenu-right').forEach(el => el.classList.remove('show'));


  const isOpen = submenu.classList.contains('show');

  if (!isOpen) {
    // Poziționare fixă, dar bazată pe click
    const rect = link.getBoundingClientRect();
    submenu.style.top = `${rect.top}px`;          // aliniere verticală cu linkul
    submenu.style.left = `${rect.right + 15}px`;        // plasare în dreapta

    submenu.classList.add('show');
  }
}


document.addEventListener('click', () => {
  document.querySelectorAll('.submenu-right').forEach(el => el.classList.remove('show'));
  document.querySelectorAll('.submenu-icon').forEach(el => el.classList.remove('rotate'));
});

// --- Generare meniu lunar dinamic ---
async function genereazaMeniuLunar() {
  const year = new Date().getFullYear();
  const luni = [
    "Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie",
    "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"
  ];

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
    } catch (err) {
      // Fără link dacă fișierul nu există
    }

    li.appendChild(a);
    container.appendChild(li);
  }
}
//Genereaza oferta cursuri

function genereazaOfertaCursuri() {
  const year = 2025; // sau: new Date().getFullYear();
  const luni = [
    "Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie",
    "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"
  ];

  const container = document.getElementById("meniu-oferta-cursuri");
  if (!container) return;

  // Link static: Oferta anuală
  const liAnual = document.createElement("li");
  const aAnual = document.createElement("a");
  aAnual.className = "nav-link";
  aAnual.textContent = "📄 Oferta anuală";
  aAnual.href = `oferta_cursuri/${year}/oferta_anuala.pdf`;
  aAnual.target = "_blank";
  liAnual.appendChild(aAnual);
  container.appendChild(liAnual);

  // Linkuri lunare dinamice
  luni.forEach((luna, i) => {
    const filePath = `oferta_cursuri/${year}/oferta_cursuri_${i + 1}.pdf`;
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.className = "nav-link";
    a.textContent = luna;

    // Verifică dacă fișierul există
    fetch(filePath, { method: "HEAD" })
      .then(response => {
        if (response.ok) {
          a.href = filePath;
          a.target = "_blank";
        }
      })
      .catch(() => {
        // fișierul nu există — linkul rămâne inactiv
      });

    li.appendChild(a);
    container.appendChild(li);
  });
}


// --- Generare tabel activități pe săptămâni ---
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
    const week = Math.ceil((((lastDay - new Date(year, 0, 1)) / 86400000) + new Date(year, 0, 1).getDay() + 1) / 7);
    return week;
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

// --- Include HTML dinamic pentru navbar/sidebar ---
async function includeHTML(id, url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Nu s-a putut încărca ${url}`);
    const html = await response.text();

    document.getElementById(id).innerHTML = html;

    // Inițializează meniul lunar după ce sidebar-ul e încărcat
    if (id === "sidebar-placeholder") {
      genereazaMeniuLunar();
      genereazaOfertaCursuri();
    }
  } catch (err) {
    console.error(err);
  }


}

// --- Inițializare generală ---
window.addEventListener('DOMContentLoaded', () => {
  // Încarcă componentele reutilizabile
  includeHTML("navbar-placeholder", "navbar.html");
  includeHTML("sidebar-placeholder", "sidebar.html");



  // Generează tabel dacă există pe pagină
  genereazaTabelActivitati();
});
