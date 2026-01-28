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

function jumpNext(currentId) {
  const num = parseInt(currentId.replace("d", ""));
  const next = document.getElementById("d" + (num + 1));
  if (next) next.focus();
}

function autoComma(el) {
  if (el.value.includes(".")) {
    el.value = el.value.replace(".", ",");
  }

  if (/^\d{2,3}$/.test(el.value)) {
    el.value = el.value + ",0";
  }

  saveInputs();
}

function resetAll() {
  if (!confirm("Alle eingetragenen Gewichte wirklich löschen?")) return;

  for (let i = 1; i <= 7; i++) {
    document.getElementById("d" + i).value = "";
  }

  localStorage.removeItem("weightsInputs");
  document.getElementById("result").innerText = "";
}

function startNewWeek() {
  for (let i = 1; i <= 7; i++) {
    document.getElementById("d" + i).value = "";
  }
  saveInputs();
}

function check() {
  let weights = [];

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

    weights.push(v);
  }

  let avgStart = (weights[0] + weights[1] + weights[2]) / 3;
  let avgEnd   = (weights[4] + weights[5] + weights[6]) / 3;

  let diff = avgEnd - avgStart;
  let percentChange = (diff / avgStart) * 100;

  let text = "";
  if (percentChange <= -0.25) {
    text = "🟢 Fettverlust läuft. Nichts ändern.";
  } else if (percentChange <= 0.1) {
    text = "🟡 Gewicht schwankt. Noch zu früh für Änderungen.";
  } else {
    text = "🔴 Kein Fettverlust. Kleine Anpassung nötig.";
  }

  let weeklyText =
    diff < 0
      ? "In dieser Woche ca. " + diff.toFixed(1) + " kg abgenommen."
      : diff > 0
      ? "In dieser Woche ca. +" + diff.toFixed(1) + " kg zugenommen."
      : "Gewicht im Schnitt unverändert.";

  document.getElementById("result").innerText =
    text + "\n\n" + weeklyText;

  startNewWeek();
}
