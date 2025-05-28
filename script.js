function openModal(id) {
  document.getElementById(id).style.display = "block";
}

function closeModal(id) {
  document.getElementById(id).style.display = "none";
}

window.onclick = function(event) {
  const modals = document.querySelectorAll(".custom-modal");
  modals.forEach(modal => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });
}

function includeHTML() {
  const elements = document.querySelectorAll('[include-html]');
  elements.forEach(el => {
    const file = el.getAttribute('include-html');
    fetch(file)
      .then(response => {
        if (response.ok) return response.text();
        throw new Error(`Could not load ${file}`);
      })
      .then(data => {
        el.innerHTML = data;
        el.removeAttribute('include-html');
        includeHTML(); // Recursiv, dacă în interior există și alte includeri
      })
      .catch(err => console.error(err));
  });
}

// ✅ Listă de fișiere PDF care există pe server
const existingPDFs = [
  "program-2025-s01.pdf",
  "program-2025-s02.pdf",
  "program-2025-s03.pdf",
  "program-2025-s04.pdf",
  "program-2025-s05.pdf"
];

function generateProgramRows() {
  const tbody = document.getElementById("program-tbody");
  if (!tbody) return;

  const year = new Date().getFullYear();
  const weeks = getWeeksInYear(year);

  for (let week = 1; week <= weeks; week++) {
    const startDate = getDateOfISOWeek(week, year);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 4); // luni–vineri

    const label = formatDate(startDate) + "–" + formatDate(endDate) + "." + year;
    const fileName = `program-${year}-s${String(week).padStart(2, '0')}.pdf`;
    const filePath = `/pdf-uri/${fileName}`;

    const tr = document.createElement("tr");
    const tdWeek = document.createElement("td");
    tdWeek.textContent = week;

    const tdProgram = document.createElement("td");

    if (existingPDFs.includes(fileName)) {
      const a = document.createElement("a");
      a.href = filePath;
      a.target = "_blank";
      a.textContent = label;
      tdProgram.appendChild(a);
    } else {
      tdProgram.textContent = label;
    }

    tr.appendChild(tdWeek);
    tr.appendChild(tdProgram);
    tbody.appendChild(tr);
  }
}

function formatDate(date) {
  return `${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function getWeeksInYear(year) {
  const d = new Date(year, 11, 31);
  const day = d.getDay();
  return (day === 4 || (isLeapYear(year) && day === 3)) ? 53 : 52;
}

function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function getDateOfISOWeek(week, year) {
  const simple = new Date(year, 0, 1 + (week - 1) * 7);
  const dow = simple.getDay();
  const ISOweekStart = simple;
  if (dow <= 4)
    ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
  else
    ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
  return ISOweekStart;
}

// ✅ Rulează la încărcarea paginii
document.addEventListener("DOMContentLoaded", generateProgramRows);
// ✅ Include HTML din fișiere externe

window.addEventListener('DOMContentLoaded', includeHTML);
