const equipment = [
  {icon:"💧", name:"Eau / filtration", meta:"Réserve d'urgence", state:"OK", cls:""},
  {icon:"🩹", name:"Trousse de secours", meta:"Contrôle recommandé", state:"À vérifier", cls:"warn"},
  {icon:"🔦", name:"Lampe", meta:"Batterie chargée", state:"OK", cls:""},
  {icon:"🧣", name:"Couverture de survie", meta:"Présente", state:"OK", cls:""},
  {icon:"🥧", name:"Ration", meta:"Fonctionnelle", state:"OK", cls:""},
  {icon:"🛰️", name:"Balise de survie", meta:"Fonctionnelle", state:"OK", cls:""},
  {icon:"📖", name:"Livret gestes de secours", meta:"Fonctionnelle", state:"OK", cls:""},
  {icon:"🪢", name:"corde", meta:"Fonctionnelle", state:"OK", cls:""}
];

const risks = {
  flood: {
    title:"Inondation",
    icon:"" ,
    intro:"Priorité : vous éloigner de l'eau et rejoindre une zone sûre. Ne traversez jamais une zone inondée à pied ou en voiture.",
    steps:["Rejoignez un point en hauteur et suivez les consignes officielles.","Coupez l'électricité si cela peut être fait sans danger.","Prenez votre RESCUE+ et vos documents essentiels.","Évitez les sous-sols, parkings et routes submergées."],
    note:"En situation réelle, les consignes des autorités locales priment toujours."
  },
  fire: {
    title:"Incendie",
    icon:"" ,
    intro:"Priorité : évacuer rapidement et ne pas prendre de risque pour récupérer des objets.",
    steps:["Déclenchez l'alerte et appelez les secours si nécessaire.","Évacuez par les issues prévues sans utiliser l'ascenseur.","Si la fumée est présente, restez le plus bas possible.","Ne retournez jamais dans un bâtiment évacué."],
    note:"Ne tentez pas d'éteindre un incendie important vous-même."
  },
  storm: {
    title:"Tempête",
    icon:"" ,
    intro:"Priorité : vous abriter dans un bâtiment solide et rester informé des alertes.",
    steps:["Rentrez les objets exposés si vous êtes encore en sécurité.","Restez à l'intérieur, loin des fenêtres.","Chargez votre téléphone et gardez votre kit accessible.","Évitez les déplacements non indispensables."],
    note:"Consultez les alertes et recommandations officielles."
  },
  heat: {
    title:"Canicule",
    icon:"" ,
    intro:"Priorité : limiter l'exposition à la chaleur et maintenir une bonne hydratation.",
    steps:["Buvez régulièrement sans attendre d'avoir soif.","Restez dans un endroit frais pendant les heures les plus chaudes.","Fermez volets et fenêtres lorsque l'air extérieur est plus chaud.","Surveillez les personnes vulnérables autour de vous."],
    note:"En cas de malaise important, contactez rapidement les services d'urgence."
  }
};

const list = document.getElementById("equipmentList");
const score = document.getElementById("kitScore");
const panel = document.getElementById("emergencyPanel");
const toast = document.getElementById("toast");
const modal = document.getElementById("modal");

function renderKit() {
  list.innerHTML = equipment.map((item, i) => `
    <button class="equipment" data-index="${i}">
      <span class="equipment-icon">${item.icon}</span>
      <span><span class="equipment-name">${item.name}</span><span class="equipment-meta">${item.meta}</span></span>
      <span class="check ${item.cls}">${item.state}</span>
    </button>
  `).join("");
  const good = equipment.filter(x => x.state === "OK").length;
  score.textContent = Math.round(good / equipment.length * 100) + "%";
  document.querySelectorAll(".equipment").forEach(btn => {
    btn.addEventListener("click", () => {
      const i = Number(btn.dataset.index);
      if (equipment[i].state === "OK") {
        equipment[i].state = equipment[i].name === "Batterie externe" ? "Recharge" : "À vérifier";
        equipment[i].cls = "warn";
      } else {
        equipment[i].state = "OK";
        equipment[i].cls = "";
      }
      renderKit();
      showToast("Statut du matériel mis à jour.");
    });
  });
}
function renderRisk(key="flood") {
  const r = risks[key];
  panel.innerHTML = `
    <div>
      <span class="card-kicker">${r.icon} MODE ${r.title.toUpperCase()}</span>
      <h3>${r.title}</h3>
      <p>${r.intro}</p>
      <div class="emergency-note">⚠️ ${r.note}</div>
    </div>
    <div class="steps">${r.steps.map((s,i)=>`<div class="step"><span class="step-num">${i+1}</span><span>${s}</span></div>`).join("")}</div>
  `;
}
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(()=>toast.classList.remove("show"), 2500);
}
function openModal(){modal.classList.add("open")}
function closeModal(){modal.classList.remove("open")}

renderKit();
renderRisk();

document.querySelectorAll(".risk-card").forEach(card=>{
  card.addEventListener("click",()=>{
    document.querySelectorAll(".risk-card").forEach(c=>c.classList.remove("active"));
    card.classList.add("active");
    renderRisk(card.dataset.risk);
  });
});

document.getElementById("resetKit").addEventListener("click",()=>{
  equipment.forEach((x,i)=>{x.state =  "À vérifier" ; x.cls = x.state==="OK"?"":"warn"});
  renderKit(); showToast("Kit réinitialisé.");
});
document.getElementById("scanBtn").addEventListener("click",openModal);
document.getElementById("scanCardBtn").addEventListener("click",openModal);
document.getElementById("modalClose").addEventListener("click",closeModal);
modal.addEventListener("click",e=>{if(e.target===modal)closeModal()});
document.getElementById("goKit").addEventListener("click",()=>{closeModal();document.getElementById("kit").scrollIntoView({behavior:"smooth"});});
document.getElementById("goPassport").addEventListener("click",()=>{closeModal();document.getElementById("passport").scrollIntoView({behavior:"smooth"});});


document.getElementById("menuBtn").addEventListener("click",()=>showToast("Utilisez les sections Mon kit, Urgence et Passeport."));


// Soft reveal for the history/conception section.

const revealItems =
  document.querySelectorAll(".reveal");

if (
  "IntersectionObserver" in window &&
  revealItems.length
) {

  const observer =
    new IntersectionObserver(
      (entries, obs) => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            entry.target.classList.add(
              "is-visible"
            );

            obs.unobserve(entry.target);
          }

        });

      },
      {
        threshold:0.12
      }
    );

  revealItems.forEach(el =>
    observer.observe(el)
  );
}
