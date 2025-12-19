// --- 1. Vos Données (Intouchées ou presque) ---
const API_URL = "http://localhost:5000";
let currentUser = "";

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
  // Ajout de données fictives pour tester le rendu visuel
  ["Ticketing IT", "", "cmd", "tous", "TitreTuile2"],
  ["Documentation", "", "cmd", "tous", "TitreTuile2"],
  ["Audit Qualité", "", "cmd", "tous", "TitreTuile4"],

  [
    "GriGEST VD",
    "img/test2.png",
    "runApp('\\\\\\\\OMISFS05\\\\ERPLinks$\\\\GRIGEST_VD.lnk','tous')",
    "tous",
    "TitreTuile4",
  ],
  [
    "Admin QRY griGEST VD",
    "",
    "runApp('\\\\\\\\OMISFS05\\\\ERPLinks$\\\\AdminQry.lnk','tous')",
    "tous",
    "TitreTuile4",
  ],
  [
    "GriGEST GE",
    "",
    "runApp('\\\\\\\\OMISFS05\\\\ERPLinks$\\\\GRIGEST_GE.lnk','tous')",
    "tous",
    "TitreTuile4",
  ],
  [
    "GriGEST Membres",
    "",
    "runApp('\\\\\\\\OMISFS05\\\\ERPLinks$\\\\GRIGEST_Membres.lnk','tous')",
    "tous",
    "TitreTuile4",
  ],
  [
    "Admin QRY Membres",
    "",
    "runApp('\\\\\\\\OMISFS05\\\\ERPLinks$\\\\AdminQryGriMembres.lnk','tous')",
    "tous",
    "TitreTuile4",
  ],
  [
    "MyProspects",
    "",
    "runApp('\\\\\\\\OMISFS05\\\\ERPLinks$\\\\MyProspect.lnk','tous')",
    "tous",
    "TitreTuile4",
  ],
  [
    "WorkFlow",
    "img/test2.png",
    "runApp('\\\\\\\\OMISFS05\\\\ERPLinks$\\\\workflowGRI.lnk','tous')",
    "tous",
    "TitreTuile4",
  ],
];

// --- 2. Fonctions Utilitaires Design ---

// Choisit une icône et une classe couleur CSS selon le nom de l'app
function getStyleForApp(appName) {
  const name = appName.toLowerCase();
  if (name.includes("sql") || name.includes("data"))
    return { icon: "database", colorClass: "bg-green" };
  if (name.includes("exchange") || name.includes("mail"))
    return { icon: "mail", colorClass: "bg-blue" };
  if (name.includes("fabrication") || name.includes("renoir"))
    return { icon: "factory", colorClass: "bg-orange" };
  if (name.includes("support") || name.includes("ticket"))
    return { icon: "life-buoy", colorClass: "bg-red" };
  if (name.includes("qualité"))
    return { icon: "clipboard-check", colorClass: "bg-purple" };
  if (name.includes("dev")) return { icon: "code-2", colorClass: "bg-indigo" };

  return { icon: "layout", colorClass: "bg-slate" }; // Défaut
}

// --- 3. Logique Métier (Vos fonctions) ---

function fetchCurrentUser() {
  fetch(API_URL + "/currentUser")
    .then((res) => res.json())
    .then(async (data) => {
      currentUser = await data.user;
      await updateUserUI(currentUser);
      renderApp();
    });
}

async function updateUserUI(name) {
  document.getElementById("current-user-display").textContent =
    "Bonjour " + name;
}

function runApp(command, allowedUsers) {
  const allowedList = allowedUsers
    .split(",")
    .map((u) => u.trim().toLowerCase());

  // Logique de permission
  // Note: j'ajoute une condition "Invité" pour le test hors ligne
  if (
    allowedList.includes("tous") ||
    allowedList.includes(currentUser.toLowerCase()) ||
    currentUser.includes("Invité")
  ) {
    const data = { action: "launch", target: command };

    // Appel API
    fetch(API_URL + "/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.message);
      })
      .catch((err) => {
        // Si l'API échoue, on affiche juste une alerte pour confirmer le clic
        console.error("Erreur API:", err);
        alert("Commande envoyée vers : " + command);
      });
  } else {
    alert("⛔ Accès refusé pour cet utilisateur.");
  }
}

// --- 4. Rendu de l'Interface (Adapté CSS Pur) ---

function renderApp(filterText = "") {
  const container = document.getElementById("app-container");
  container.innerHTML = "";
  let hasResults = false;

  // Pour chaque Domaine (Catégorie)
  tblInfoDomaine.forEach(([libelle, cssId]) => {
    // Filtrer les tuiles
    const domainTiles = tblInfoTuile.filter((t) => {
      const [name, img, cmd, users, catId] = t;
      const matchesCategory = catId === cssId;
      const matchesSearch = name
        .toLowerCase()
        .includes(filterText.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (domainTiles.length === 0) return;
    hasResults = true;

    // Création de la Section
    const section = document.createElement("section");
    section.className = "section";

    // En-tête de section
    const headerDiv = document.createElement("div");
    headerDiv.className = "section-header";
    headerDiv.innerHTML = `
        <div class="section-indicator"></div>
        <h2 class="section-title">${libelle}</h2>
      `;
    section.appendChild(headerDiv);

    // Grille de cartes
    const gridDiv = document.createElement("div");
    gridDiv.className = "grid";

    // Génération des cartes
    domainTiles.forEach(([name, imgPath, command, users]) => {
      const style = getStyleForApp(name);
      const accessLabel = users === "tous" ? "Accès Public" : "Accès Restreint";

      const card = document.createElement("div");
      card.className = "card";
      card.onclick = () => runApp(command, users);

      // Structure HTML de la carte
      card.innerHTML = `
        <div class="card-header">
          <div class="icon-wrapper ${style.colorClass}">
              <i data-lucide="${style.icon}"></i>
          </div>
          <i data-lucide="external-link" style="color: var(--text-light); width: 16px;"></i>
        </div>
        <div class="card-body">
          <h3 class="card-title" title="${name}">${name}</h3>
          <p class="card-subtitle">${accessLabel}</p>
        </div>
      `;

      gridDiv.appendChild(card);
    });

    section.appendChild(gridDiv);
    container.appendChild(section);
  });

  // État vide
  if (!hasResults) {
    container.innerHTML = `
            <div class="empty-state">
                <h3>Aucun résultat trouvé</h3>
                <p>Essayez un autre terme de recherche</p>
            </div>
        `;
  }

  // Rafraîchir les icônes Lucide
  lucide.createIcons();
}
// Lancement initial
fetchCurrentUser();
