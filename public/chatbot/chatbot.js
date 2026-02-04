/****************************************************
 * SOLO'IA'TICO — CHATBOT LUXE
 * Version 1.7.31A — VOCABULARY MICRO PATCH -  QUE FAIRE PATCH (NO REGRESSION)
 ****************************************************/

(function () {

  const KB_BASE_URL = "https://solobotatico2026.vercel.app";

  const WEATHER_URL =
    "https://marine.meteoconsult.fr/meteo-marine/bulletin-detaille/spot-perso-644139/previsions-meteo-soloatico-es-solo-atico-guest-suites-aujourdhui";

  const BOOKING_URLS = {
    fr: "https://soloatico.amenitiz.io/fr/booking/room#DatesGuests-BE",
    es: "https://soloatico.amenitiz.io/es/booking/room#DatesGuests-BE",
    nl: "https://soloatico.amenitiz.io/nl/booking/room#DatesGuests-BE",
    ca: "https://soloatico.amenitiz.io/ca/booking/room#DatesGuests-BE",
    en: "https://soloatico.amenitiz.io/en/booking/room#DatesGuests-BE",
    "zh-cn": "https://soloatico.amenitiz.io/en/booking/room#DatesGuests-BE"
  };

  const SERVICE_BOOKING = {
    boat: "https://koalendar.com/e/tintorera",
    reiki: "https://koalendar.com/e/soloatico-reiki"
  };

  const BOOKING_INTRO = {
    fr: "✅ **Oui, bien sûr 🙂 Vous pouvez réserver dès maintenant.**",
    en: "✅ **Yes, of course 🙂 You can book right now.**",
    es: "✅ **Sí, por supuesto 🙂 Puedes reservar ahora mismo.**",
    ca: "✅ **Sí, és clar 🙂 Pots reservar ara mateix.**",
    nl: "✅ **Ja, natuurlijk 🙂 Je kunt nu reserveren.**",
    "zh-cn": "✅ **当然可以 🙂 您现在可以直接预订。**"
  };

  const BOOKING_GUIDE = {
    fr: "✨ **Bien sûr 🙂 Que souhaitez-vous réserver ?**<br>– Une suite<br>– Un soin Reiki<br>– Une balade en bateau",
    en: "✨ **Of course 🙂 What would you like to book?**<br>– A suite<br>– A Reiki treatment<br>– A boat trip",
    es: "✨ **Por supuesto 🙂 ¿Qué te gustaría reservar?**<br>– Una suite<br>– Un tratamiento Reiki<br>– Un paseo en barco",
    ca: "✨ **És clar 🙂 Què t’agradaria reservar?**<br>– Una suite<br>– Un tractament Reiki<br>– Una sortida en vaixell",
    nl: "✨ **Natuurlijk 🙂 Wat wil je reserveren?**<br>– Een suite<br>– Een Reiki-behandeling<br>– Een boottocht",
    "zh-cn": "✨ **当然可以 🙂 您想预订什么？**<br>– 套房<br>– 灵气疗程<br>– 海上游船"
  };

  const WEATHER_TEXT = {
    fr: "🌤️ **Voici les prévisions météo à L’Escala :**",
    en: "🌤️ **Here is the weather forecast for L’Escala:**",
    es: "🌤️ **Aquí tienes la previsión del tiempo en L’Escala:**",
    ca: "🌤️ **Aquí tens la previsió del temps a L’Escala:**",
    nl: "🌤️ **Hier is de weersvoorspelling voor L’Escala:**",
    "zh-cn": "🌤️ **以下是 L’Escala 的天气预报：**"
  };

  const FALLBACK = {
    fr: "✨ Excellente question 🙂 Vous pouvez contacter Sophia ou Laurent via WhatsApp.",
    en: "✨ Great question 🙂 You can contact Sophia or Laurent via WhatsApp.",
    es: "✨ Excelente pregunta 🙂 Puedes contactar con Sophia ou Laurent via WhatsApp.",
    ca: "✨ Bona pregunta 🙂 Pots contactar amb la Sophia ou en Laurent via WhatsApp.",
    nl: "✨ Goede vraag 🙂 Je kunt contact opnemen met Sophia ou Laurent via WhatsApp.",
    "zh-cn": "✨ 很好的问题 🙂 您可以通过 WhatsApp 联系 Sophia 或 Laurent。"
  };


/* ===== FULL PALACE — PRIX (MULTI-LANGUE) ===== */

const PRICE_REGEX =
  /(prix|tarif|tarifs|price|prices|rate|rates|precio|precios|preu|tarifa|preise|kosten|prijs)/;

const PRICE_MESSAGE = {
  fr: "✨ Les tarifs varient selon la suite et les dates choisies.<br><br>Pour connaître les disponibilités et les meilleurs prix en temps réel, je vous invite à consulter notre moteur de réservation sécurisé.",
  en: "✨ Rates vary depending on the suite and selected dates.<br><br>To check availability and the best prices in real time, please use our secure booking engine.",
  es: "✨ Las tarifas varían según la suite y las fechas seleccionadas.<br><br>Para consultar disponibilidad y los mejores precios en tiempo real, le invitamos a utilizar nuestro motor de reservas seguro.",
  ca: "✨ Les tarifes varien segons la suite i les dates seleccionades.<br><br>Per consultar disponibilitat i els millors preus en temps real, us convidem a utilitzar el nostre motor de reserves segur.",
  nl: "✨ Tarieven variëren afhankelijk van de suite en de gekozen data.<br><br>Bekijk beschikbaarheid en actuele prijzen via onze beveiligde reserveringsmodule.",
  "zh-cn": "✨ 房价会根据套房类型和所选日期而有所不同。<br><br>请通过我们的安全预订系统查看实时房价和可用情况。"
};

const PRICE_BTN_LABEL = {
  fr: "🛎️ Voir disponibilités & tarifs",
  en: "🛎️ Check availability & rates",
  es: "🛎️ Ver disponibilidad y tarifas",
  ca: "🛎️ Veure disponibilitat i tarifes",
  nl: "🛎️ Beschikbaarheid & prijzen",
  "zh-cn": "🛎️ 查看房价与可用性"
};





/* =====================================================
   FULL PALACE — SCORING INTENTION (V1 SAFE)
   ===================================================== */

let palaceScore = 0;

/* Augmente l'intention de réservation */
function addPalaceScore(value) {
  palaceScore += value;
  if (palaceScore > 10) palaceScore = 10;
}

/* Réinitialisation (nouvelle session / retour calme) */
function resetPalaceScore() {
  palaceScore = 0;
}

/* Seuil luxe : prêt à orienter vers réservation */
function isPalaceReady() {
  return palaceScore >= 5;
}


  console.log("Solo’IA’tico Chatbot v1.7.31 — vocabulary micro patch");

  document.addEventListener("DOMContentLoaded", async () => {

    /* ===== CSS / HTML ===== */
    if (!document.getElementById("soloia-css")) {
      const css = document.createElement("link");
      css.id = "soloia-css";
      css.rel = "stylesheet";
      css.href = `${KB_BASE_URL}/chatbot/chatbot.css`;
      document.head.appendChild(css);
    }

    if (!document.getElementById("chatWindow")) {
      const html = await fetch(`${KB_BASE_URL}/chatbot/chatbot.html`).then(r => r.text());
      document.body.insertAdjacentHTML("beforeend", html);
    }

    const chatWin = document.getElementById("chatWindow");
    const openBtn = document.getElementById("openChatBtn");
    const sendBtn = document.getElementById("sendBtn");
    const input   = document.getElementById("userInput");
    const bodyEl  = document.getElementById("chatBody");

    if (!chatWin || !openBtn || !sendBtn || !input || !bodyEl) return;

/* ===== PATCH SCROLL DOUX LUXE (AJOUT SAFE) ===== */
function smoothScrollChat() {
  bodyEl.scrollTo({
    top: bodyEl.scrollHeight,
    behavior: "smooth"
  });
}

function progressiveScrollLastBot() {
  const lastBot = bodyEl.querySelector(".botMsg:last-child");
  if (!lastBot) return;

  Array.from(lastBot.children).forEach((_, i) => {
    setTimeout(() => {
      smoothScrollChat();
    }, i * 140);
  });
}
/* ===== FIN PATCH SCROLL ===== */



    /* ===== OPEN / CLOSE ===== */
    let isOpen = false;
    chatWin.style.display = "none";

    openBtn.addEventListener("click", e => {
      e.preventDefault(); e.stopPropagation();
      isOpen = !isOpen;
      chatWin.style.display = isOpen ? "flex" : "none";
    });

    document.addEventListener("click", e => {
      if (isOpen && !chatWin.contains(e.target) && !openBtn.contains(e.target)) {
        chatWin.style.display = "none";
        isOpen = false;
      }
    });

    /* ===== WHATSAPP ===== */
    document.getElementById("waLaurent")?.addEventListener("click", e => {
      e.preventDefault(); e.stopPropagation();
      window.open("https://wa.me/34621210642", "_blank");
    });

    document.getElementById("waSophia")?.addEventListener("click", e => {
      e.preventDefault(); e.stopPropagation();
      window.open("https://wa.me/34621128303", "_blank");
    });

    /* ===== NORMALISATION ===== */
    function normalize(text) {
      return text.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z\s]/g, "");
    }

    function wantsToBook(text) {
      return /(reserv|book|pued|puis|kan ik|can i)/.test(normalize(text));
    }

    /* ===== MICRO PATCH : VOCABULAIRE ===== */
    const TYPO_ROOMS = [
      "uite","uites","suit","suites",
      "chamre","chambres","rom","rooom","roomm",
      "abitacion","abitacio","kameer"
    ];

    function detectTypoIntent(t) {
      for (const w of TYPO_ROOMS) {
        if (t.includes(w)) return "rooms";
      }
      return null;
    }

    /* ===== LANG ===== */
    function pageLang() {
      const l = document.documentElement.lang;
      if (l === "zh-Hans") return "zh-cn";
      return ["fr","en","es","ca","nl","zh-cn"].includes(l) ? l : "fr";
    }

 function detectLang(text) {
  const t = normalize(text);

  // 🇳🇱 Néerlandais (important)
  if (/\b(prijs|kosten|boeken|kamer|kamers|suite|overnachting)\b/.test(t)) {
    return "nl";
  }

  // 🇬🇧 Anglais
  if (/\b(price|prices|rate|rates|book|booking|room|rooms)\b/.test(t)) {
    return "en";
  }

  // 🇪🇸 Espagnol
  if (/\b(precio|precios|reservar|habitacion|habitaciones)\b/.test(t)) {
    return "es";
  }

  // 🇨🇦 Catalan
  if (/\b(preu|reserva|habitacio|habitacions)\b/.test(t)) {
    return "ca";
  }

  // 🇫🇷 Français
  if (/\b(prix|tarif|tarifs|reserver|chambre|chambres|suite|suites)\b/.test(t)) {
    return "fr";
  }

  // Fallback langue de la page
  return pageLang();
}


    function kbLang(lang) {
      if (lang === "ca") return "cat";
      if (lang === "zh-Hans") return "zh-cn";
      return lang;
    }

    /* ===== INTENTS ===== */
    const GREETINGS = ["bonjour","bonsoir","salut","hello","hola","bon dia"];

    const SUITES_BY_NAME = {
      neus: "02_suites/suite-neus.txt",
      bourlardes: "02_suites/suite-bourlardes.txt",
      blue: "02_suites/room-blue-patio.txt",
      patio: "02_suites/room-blue-patio.txt"
    };

    const FUZZY = {
      presentation: [
        "presentation","hotel","etablissement","soloatico","solo atico",
        "votre hotel","plage"
      ],
      rooms: ["suite","suites","chambre","room"],
      boat: ["bateau","boat","tintorera"],
      reiki: ["reiki"],
      pool: ["piscine","pool"],
      activities: ["que faire","things to do"],
      weather: ["meteo","météo","weather"]
    };

    function intent(text) {
      const t = normalize(text);
      for (const s in SUITES_BY_NAME) {
        if (t.includes(s)) return "suite_named";
      }
      if (GREETINGS.some(g => t.includes(g))) return "greeting";
      for (const k in FUZZY) {
        if (FUZZY[k].some(w => t.includes(w))) return k;
      }
      return "unknown";
    }

    /* ===== ROOMS META ===== */
    const ROOM_META = {
      "02_suites/suite-neus.txt": { vue_mer:true },
      "02_suites/suite-bourlardes.txt": { vue_mer:true },
      "02_suites/room-blue-patio.txt": { vue_mer:false }
    };

    function extractRoomCriteria(text) {
      return { vue_mer: /(vue mer|sea view)/.test(normalize(text)) };
    }

    /* ===== KB ===== */
    async function loadKB(lang, path) {
      let r = await fetch(`${KB_BASE_URL}/kb/${kbLang(lang)}/${path}`);
      if (!r.ok) r = await fetch(`${KB_BASE_URL}/kb/fr/${path}`);
      return r.text();
    }

    function parseKB(txt) {
      return {
        short: (txt.match(/SHORT:\s*([\s\S]*?)\n/i)||["",""])[1].trim(),
        long:  (txt.match(/LONG:\s*([\s\S]*)/i)||["",""])[1].trim()
      };
    }

function renderLong(bot, text, autoOpenSectionIndex = null) {
  let currentContent = null;
  let sectionIndex = 0;

  text.split("\n").forEach(line => {
    const l = line.trim();
    if (!l) return;


    // 🔹 Détection des titres numérotés (1. / 2. / 3.)
    if (/^\d+\.\s/.test(l)) {
      sectionIndex++;

      const title = document.createElement("div");
      title.className = "kbSectionTitle";
      title.textContent = l;

      const content = document.createElement("div");
      content.className = "kbSectionContent";

      // ✅ ouverture automatique UNIQUEMENT de la bonne section
      const shouldAutoOpen =
        autoOpenSectionIndex !== null &&
        sectionIndex === autoOpenSectionIndex;

      content.style.display = shouldAutoOpen ? "block" : "none";

      title.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        content.style.display =
          content.style.display === "none" ? "block" : "none";
      };

      bot.appendChild(title);
      bot.appendChild(content);

      currentContent = content;
      return;
    }

    // 🔹 Contenu de section
    const p = document.createElement("div");
    p.className = "kbLongParagraph";
    p.textContent = l;

    if (currentContent) {
      currentContent.appendChild(p);
    } else {
      bot.appendChild(p);
    }
  });
}



/* =====================================================
   MICRO PATCH — INTENTS "QUE FAIRE À L’ESCALA"
   MULTI-LANGUES — SAFE — NO REGRESSION
   ===================================================== */

/* ===== RUINES / CULTURE ===== */
const RUINS_KEYWORDS = [
  "ruine", "ruines", "vestige", "vestiges",
  "empurie", "empuries", "romain", "romaine",
  "grec", "grecque", "archeologique", "archeologique",
  "site historique", "site archeologique"
];
function detectRuinsIntent(t) {
  return RUINS_KEYWORDS.some(w => t.includes(w));
}

/* ===== PLAGES & NAUTIQUE ===== */
const BEACH_KEYWORDS = [
  "plage","plages","mer","baignade","snorkeling","paddle",
  "playa","playas","mar","snorkel",
  "platja","platges",
  "beach","beaches","sea","swimming","kayak",
  "strand","stranden","zee",
  "riells","montgo","medes","estartit"
];
function detectBeachIntent(t) {
  return BEACH_KEYWORDS.some(w => t.includes(w));
}

/* ===== NATURE & RANDONNÉES ===== */
const NATURE_KEYWORDS = [
  "nature","randonnee","randonnée","marche","balade",
  "naturaleza","senderismo","caminar",
  "natura","senderisme","passeig",
  "hiking","walk","trail",
  "natuur","wandelen",
  "montgri","aiguamolls","parc naturel","natural park"
];
function detectNatureIntent(t) {
  return NATURE_KEYWORDS.some(w => t.includes(w));
}

/* ===== VILLAGES ===== */
const VILLAGE_KEYWORDS = [
  "village","villages","medieval","medieval",
  "pueblo","pueblos",
  "poble","pobles",
  "dorp","dorpen",
  "pals","peratallada","begur","palau","sant marti","empuries"
];
function detectVillageIntent(t) {
  return VILLAGE_KEYWORDS.some(w => t.includes(w));
}

/* ===== SPORTS & LOISIRS ===== */
const SPORT_KEYWORDS = [
  "sport","sports","velo","vélo","vtt","bike","cycling",
  "golf","cheval","equitation","kayak","paddle",
  "plongee","plongée","snorkeling","voile","sailing"
];
function detectSportIntent(t) {
  return SPORT_KEYWORDS.some(w => t.includes(w));
}

/* ===== GASTRONOMIE & ŒNOTOURISME ===== */
const FOOD_KEYWORDS = [
  "restaurant","restaurants","gastronomie","cuisine",
  "vino","vin","vins","wine","wines",
  "degustation","tasting",
  "anchois","anxoves","emporda","empordà",
  "marche","marché","marches","marchés"
];
function detectFoodIntent(t) {
  return FOOD_KEYWORDS.some(w => t.includes(w));
}


/* =====================================================
   SEND MESSAGE — VERSION STABLE PALACE (SAFE)
   ===================================================== */

async function sendMessage() {
  if (!input.value.trim()) return;

  const raw = input.value;
  input.value = "";

  bodyEl.insertAdjacentHTML(
    "beforeend",
    `<div class="msg userMsg">${raw}</div>`
  );

  const n = normalize(raw);
  const lang = detectLang(raw);
  const typoIntent = detectTypoIntent(n);
  let intentFinal = typoIntent || intent(raw);
  let autoOpenSectionIndex = null;

  /* =====================================================
     FULL PALACE — SCORING INTENTION
     ===================================================== */

  if (/(suite|suites|chambre|room|rooms|kamer|kamers)/.test(n)) {
    addPalaceScore(2);
  }

  if (/(vue mer|sea view|vista mar|mar|mer)/.test(n)) {
    addPalaceScore(1);
  }

  if (/(bateau|boat|tintorera|reiki|massage|soin)/.test(n)) {
    addPalaceScore(2);
  }

  if (/(reserver|réserver|booking|book|disponibilite|dates|prix|tarif|price|prijs)/.test(n)) {
    addPalaceScore(3);
  }

  console.log("🏰 Palace score:", palaceScore);

/* =====================================================
   CRITÈRE IMPLICITE VUE MER — VERSION PALACE SAFE
   ===================================================== */

const implicitSeaView =
  /\b(vue mer|sea view|vista mar|vista al mar)\b/.test(n);

if (
  implicitSeaView &&
  isPalaceReady() &&
  intentFinal === "unknown"
) {
  intentFinal = "rooms";
}

  /* =====================================================
     QUESTION PRIX — MULTI-LANGUE (PRIORITÉ ABSOLUE)
     ===================================================== */

  if (PRICE_REGEX.test(n)) {
    const bot = document.createElement("div");
    bot.className = "msg botMsg";

    bot.innerHTML = `<div>${PRICE_MESSAGE[lang] || PRICE_MESSAGE.fr}</div>`;

    const a = document.createElement("a");
    a.href = BOOKING_URLS[lang] || BOOKING_URLS.fr;
    a.target = "_blank";
    a.className = "kbBookBtn";
    a.textContent = PRICE_BTN_LABEL[lang] || PRICE_BTN_LABEL.fr;

    bot.appendChild(a);
    bodyEl.appendChild(bot);

    progressiveScrollLastBot();
    return;
  }

  /* =====================================================
     PRIORITÉ PALACE (NE JAMAIS CASSER BOAT / REIKI)
     ===================================================== */

  if (isPalaceReady() && intentFinal === "activities") {
    intentFinal = "presentation";
  }

  /* =====================================================
     MICRO PATCH — QUE FAIRE À L’ESCALA
     ===================================================== */

  if (detectRuinsIntent(n) && intentFinal === "unknown") {
    intentFinal = "activities";
    autoOpenSectionIndex = 1;
  }

  if (detectBeachIntent(n) && intentFinal === "unknown") {
    intentFinal = "activities";
    autoOpenSectionIndex = 2;
  }

  if (detectNatureIntent(n) && intentFinal === "unknown") {
    intentFinal = "activities";
    autoOpenSectionIndex = 3;
  }

  if (detectVillageIntent(n) && intentFinal === "unknown") {
    intentFinal = "activities";
    autoOpenSectionIndex = 4;
  }

  if (detectSportIntent(n) && intentFinal === "unknown") {
    intentFinal = "activities";
    autoOpenSectionIndex = 5;
  }

  if (detectFoodIntent(n) && intentFinal === "unknown") {
    intentFinal = "activities";
    autoOpenSectionIndex = 6;
  }

  /* =====================================================
     INTENTS SIMPLES
     ===================================================== */

  if (intentFinal === "greeting") {
    bodyEl.insertAdjacentHTML(
      "beforeend",
      `<div class="msg botMsg">👋</div>`
    );
    return;
  }

  if (intentFinal === "weather") {
    bodyEl.insertAdjacentHTML(
      "beforeend",
      `<div class="msg botMsg">${WEATHER_TEXT[lang]}<br>
       <a class="kbBookBtn" href="${WEATHER_URL}" target="_blank">🌦️</a></div>`
    );
    return;
  }

  if (wantsToBook(raw) && intentFinal === "unknown") {
    bodyEl.insertAdjacentHTML(
      "beforeend",
      `<div class="msg botMsg">${BOOKING_GUIDE[lang]}</div>`
    );
    return;
  }

  /* =====================================================
     FICHIERS KB
     ===================================================== */

  let files = [];

  if (intentFinal === "suite_named") {
    for (const k in SUITES_BY_NAME) {
      if (n.includes(k)) files = [SUITES_BY_NAME[k]];
    }
  }

  if (intentFinal === "rooms") {
    files = Object.keys(ROOM_META);
    if (extractRoomCriteria(raw).vue_mer) {
      files = files.filter(f => ROOM_META[f].vue_mer);
    }
  }

  if (intentFinal === "presentation")
    files = ["01_presentation/presentation-generale.txt"];
  if (intentFinal === "boat")
    files = ["03_services/tintorera-bateau.txt"];
  if (intentFinal === "reiki")
    files = ["03_services/reiki.txt"];
  if (intentFinal === "pool")
    files = ["03_services/piscine-rooftop.txt"];
  if (intentFinal === "activities")
    files = ["04_que-faire/que-faire-escala.txt"];

  if (!files.length) {
    bodyEl.insertAdjacentHTML(
      "beforeend",
      `<div class="msg botMsg">${FALLBACK[lang]}</div>`
    );
    return;
  }

  /* =====================================================
     RENDU FINAL KB
     ===================================================== */

  for (const f of files) {
    const kb = parseKB(await loadKB(lang, f));
    const bot = document.createElement("div");
    bot.className = "msg botMsg";

    if (wantsToBook(raw)) {
      bot.insertAdjacentHTML(
        "beforeend",
        `<div>${BOOKING_INTRO[lang]}</div>`
      );
    }

    bot.insertAdjacentHTML("beforeend", `<div>${kb.short}</div>`);

    /* 🌟 SURCOUCHE PALACE (NE CASSE PAS LE +) */
    if (isPalaceReady() && ["boat","reiki"].includes(intentFinal)) {
      bot.insertAdjacentHTML(
        "beforeend",
        `<div style="margin-top:10px;opacity:.85">
          ✨ Cette expérience s’intègre parfaitement dans un séjour à Solo Ático.
        </div>`
      );
    }

    if (kb.long) {
      if (autoOpenSectionIndex !== null) {
        renderLong(bot, kb.long, autoOpenSectionIndex);
      } else {
        const btn = document.createElement("button");
        btn.className = "kbMoreBtn";
        btn.textContent = "➕";
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          btn.remove();
          renderLong(bot, kb.long, null);
        });
        bot.appendChild(btn);
      }
    }

    if (["rooms","boat","reiki"].includes(intentFinal)) {
      const a = document.createElement("a");
      a.href =
        intentFinal === "rooms"
          ? BOOKING_URLS[lang]
          : SERVICE_BOOKING[intentFinal];
      a.target = "_blank";
      a.className = "kbBookBtn";
      a.textContent = "🛎️";
      bot.appendChild(a);
    }

    bodyEl.appendChild(bot);
  }

  progressiveScrollLastBot();
}


console.log("🏰 Palace score:", palaceScore);


    sendBtn.addEventListener("click",sendMessage);
    input.addEventListener("keydown",e=>{
      if(e.key==="Enter"){e.preventDefault();sendMessage();}
    });

  });

})();
