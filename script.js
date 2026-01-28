/* =========================
   SPEICHERN / LADEN INPUTS
========================= */

function saveInputs() {
  let values = {};
  for (let i = 1; i <= 7; i++) {
    values["d" + i] = document.getElementById("d" + i).value;
  }
  localStorage.setItem("weightsInputs", JSON.stringify(values));
}

function loadInputs() {
  let saved = JSON.parse(localStorage.getItem("weightsInputs"));
  if (!saved) return;

  for (let i = 1; i <= 7; i++) {
    document.getElementById("d" + i).value = saved["d" + i] || "";
  }
}

/* =========================
   AUTO-WEITER / KOMMA
========================= */

function jumpNext(currentId) {
  const num = parseInt(currentId.replace("d", ""));
  const next = document.getElementById("d" + (num + 1));
  if (next) next.focus();
}

function autoComma(el) {
  // Punkt sofort zu Komma
  if (el.value.includes(".")) {
    el.value = el.value.replace(".", ",");
  }

  // 75 -> 75,0
  if (/^\d{2,3}$/.test(el.value)) {
    el.value = el.value + ",0";
  }

  saveInputs();
}

/* =========================
   RESET & NEUE WOCHE
========================= */

function resetAll() {
  if (!confirm("Alle eingetragenen Gewichte wirklich löschen?")) return;

  for (let i = 1; i <= 7; i++) {
    document.getElementById("d" + i).value = "";
  }

  localStorage.removeItem("weightsInputs");
  localStorage.removeItem("weekHistory");
  document.getElementById("result").innerText = "";
  document.getElementById("history").innerHTML = "";
}

function startNewWeek() {
  for (let i = 1; i <= 7; i++) {
    document.getElementById("d" + i).value = "";
  }
  saveInputs();
}

/* =========================
   WOCHEN-HISTORIE
========================= */

function loadHistory() {
  return JSON.parse(localStorage.getItem("weekHistory") || "[]");
}

function saveHistory(list) {
  localStorage.setItem("weekHistory", JSON.stringify(list));
}

function renderHistory() {
  const box = document.getElementById("history");
  if (!box) return;

  const history = loadHistory();
  if (history.length === 0) {
    box.innerHTML = "";
    return;
  }

  let html = "<h3 style='margin-top:10px'>📅 Verlauf</h3>";

  history.slice().reverse().forEach((w, i) => {
    html += `
      <div style="
        background:#1b1b1b;
        padding:10px;
        border-radius:8px;
        margin-bottom:8px;
      ">
        <div style="font-weight:bold">${w.ampel} Woche ${history.length - i}</div>
        <div>${w.text}</div>
        <div style="color:#aaa; font-size:14px">${w.weekly}</div>
        <div style="color:#666; font-size:12px">${w.date}</div>
      </div>
    `;
  });

  box.innerHTML = html;
}

/* =========================
   CHECK (WOCHE ABSCHLIESSEN)
========================= */

function check() {
  let weights = [];let avgWeek = weights.reduce((sum, w) => sum + w, 0) / weights.length;

  let avgWeek = weights.reduce((a, b) => a + b, 0) / 7;


  for (let i = 1; i <= 7; i++) {
    let v = document.getElementById("d" + i).value;
    if (!v) {
      alert("Bitte alle 7 Tage ausfüllen");
      return;
    }

    v = parseFloat(v.replace(",", "."));
    if (v < 30 || v > 300 || isNaN(v)) {
      alert("Bitte realistisches Gewicht eingeben");
      return;
    }

    weights.push(v);const avgWeek =
  weights.reduce((sum, w) => sum + w, 0) / weights.length;
  }

  let avgStart = (weights[0] + weights[1] + weights[2]) / 3;
  let avgEnd   = (weights[4] + weights[5] + weights[6]) / 3;

  let diff = avgEnd - avgStart;
  let percentChange = (diff / avgStart) * 100;

  let text = "";
  let ampel = "";

  if (percentChange <= -0.25) {
    ampel = "🟢";
    text = "🟢 Fettverlust läuft. Nichts ändern.";
  } else if (percentChange <= 0.1) {
    ampel = "🟡";
    text = "🟡 Gewicht schwankt. Noch zu früh für Änderungen.";
  } else {
    ampel = "🔴";
    text = "🔴 Kein Fettverlust. Kleine Anpassung nötig.";
  }
let weeklyText =
  (diff < 0
    ? "In dieser Woche ca. " + diff.toFixed(1) + " kg abgenommen."
    : diff > 0
    ? "In dieser Woche ca. +" + diff.toFixed(1) + " kg zugenommen."
    : "Gewicht im Schnitt unverändert.")
  + "\nØ Gewicht Woche: " + avgWeek.toFixed(1) + " kg";

 

  document.getElementById("result").innerText =
    text + "\n\n" + weeklyText;

  // 🔽 Historie speichern
  const history = loadHistory();
  history.push({
  date: new Date().toLocaleDateString("de-DE"),
  ampel: ampel,
  text: text,
  weekly: weeklyText,
  avgWeek: avgWeek.toFixed(1)
});

  saveHistory(history);
  renderHistory();

  // 🔽 Neue Woche starten
  startNewWeek();
}

/* =========================
   START
========================= */

loadInputs();
renderHistory();





