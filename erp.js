// --- Données des domaines et tuiles ---
const tblInfoDomaine = [
  ["Serveurs MIS", "TitreTuile1"],
  ["Support", "TitreTuile2"],
  ["Développement", "TitreTuile3"],
  ["Qualité", "TitreTuile4"],
];

const tblInfoTuile = [
  [
    "Hermes (Exchange)",
    "img/test2.png",
    "G:\\GO_ERP\\Desktop\\7 - Heures",
    "ADMINISTRATEUR, SPI, CSP, BLO, MDE, RBR, DSE, DJA, PBR, RBI, FGR, LBA, MDG, LDE",
    "TitreTuile1",
  ],
  [
    "Léonardo (SQL)",
    "img/test2.png",
    "G:\\GO_ERP\\Desktop\\CRM",
    "tous",
    "TitreTuile1",
  ],
  [
    "Renoir (KLe)",
    "img/test2.png",
    "G:\\GO_ERP\\Desktop\\2 - Fabrication",
    "ADMINISTRATEUR, CSP, SPI, BLO, DMA, LBA, PBR, RBI, LDE, JHA",
    "TitreTuile3",
  ],
];

// --- Variable pour l'utilisateur ---
let currentUser = "";

// --- Récupérer l'utilisateur depuis le backend ---
function fetchCurrentUser() {
  fetch("http://localhost:5000/currentUser")
    .then((res) => res.json())
    .then(async (data) => {
      currentUser = data.user;
      document.getElementById("current-user").textContent =
        "Utilisateur connecté : " + currentUser;
      await renderApp();
    })
    .catch((err) => {
      console.error(err);
      document.getElementById("current-user").textContent =
        "Impossible de récupérer l'utilisateur";
    });
}

// --- Fonction pour lancer l'application ---
function runApp(command, allowedUsers) {
  const allowedList = allowedUsers.split(",").map((u) => u.trim());
  if (allowedList.includes("tous") || allowedList.includes(currentUser)) {
    fetch("http://localhost:5000/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command }),
    })
      .then((res) => res.json())
      .then((data) => alert(data.message))
      .catch((err) => alert(err.message));
  } else {
    alert("Accès refusé pour cet utilisateur");
  }
}

// --- Affichage des tuiles ---
function renderApp() {
  const appDiv = document.getElementById("app");
  appDiv.innerHTML = "";

  tblInfoDomaine.forEach(([libelle, cssId]) => {
    const domaineDiv = document.createElement("div");
    const titre = document.createElement("h2");
    titre.textContent = libelle;
    domaineDiv.appendChild(titre);

    const tuileContainer = document.createElement("div");
    tuileContainer.className = "tuile-container";

    tblInfoTuile
      .filter((t) => t[4] === cssId)
      .forEach(([name, img, command, users]) => {
        if (!name) return; // ignorer les lignes vides
        const btn = document.createElement("div");
        btn.className = "tuile";
        btn.textContent = name;
        btn.onclick = () => runApp(command, users);
        tuileContainer.appendChild(btn);
      });

    domaineDiv.appendChild(tuileContainer);
    appDiv.appendChild(domaineDiv);
  });
}

// --- Initialisation ---
fetchCurrentUser();
