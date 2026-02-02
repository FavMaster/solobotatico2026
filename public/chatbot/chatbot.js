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
      if (/\b(hello|what|where)\b/.test(t)) return "en";
      if (/\b(que hacer)\b/.test(t)) return "es";
      if (/\b(que fer)\b/.test(t)) return "ca";
      if (/\b(wat te doen)\b/.test(t)) return "nl";
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

function renderLong(bot, text, autoOpenKeyword = null) {
  let currentContent = null;

  text.split("\n").forEach(line => {
    const l = line.trim();
    if (!l) return;

    // 🔹 Détection des titres numérotés (1. / 2. / 3.)
    if (/^\d+\.\s/.test(l)) {
      const title = document.createElement("div");
      title.className = "kbSectionTitle";
      title.textContent = l;

      const content = document.createElement("div");
      content.className = "kbSectionContent";
      content.style.display = "none";

      title.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        content.style.display =
          content.style.display === "none" ? "block" : "none";
      };

      // ✅ OUVERTURE AUTOMATIQUE si mot-clé détecté
      if (
        autoOpenKeyword &&
        l.toLowerCase().includes(autoOpenKeyword.toLowerCase())
      ) {
        content.style.display = "block";
      }

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


/* ===== MICRO PATCH : THEME RUINES ===== */
const RUINS_KEYWORDS = [
  "ruine", "ruines",
  "vestige", "vestiges",
  "empurie", "empuries",
  "romain", "romaine",
  "grec", "grecque",
  "archeologique", "archéologique",
  "site historique", "site archeologique"
];

function detectRuinsIntent(t) {
  return RUINS_KEYWORDS.some(w => t.includes(w));
}



/* ===== SEND ===== */
async function sendMessage() {
  if (!input.value.trim()) return;
  const raw = input.value;
  input.value = "";
  bodyEl.insertAdjacentHTML(
    "beforeend",
    `<div class="msg userMsg">${raw}</div>`
  );

  const lang = detectLang(raw);
  const typoIntent = detectTypoIntent(normalize(raw));
  let intentFinal = typoIntent || intent(raw);

  /* ===== MICRO PATCH : QUESTION SUR LES RUINES ===== */
  const isRuinsQuestion = detectRuinsIntent(normalize(raw));

  if (isRuinsQuestion && intentFinal === "unknown") {
    intentFinal = "activities";
  }

  /* ===== MICRO PATCH : CRITÈRE IMPLICITE VUE MER ===== */
  const implicitSeaView =
    /\b(mer|la mer|sea|mar|vue mer|vue sur la mer|sea view|vista mar|vista al mar)\b/
      .test(normalize(raw));

  if (implicitSeaView && intentFinal === "unknown") {
    const files = Object.keys(ROOM_META).filter(f => ROOM_META[f].vue_mer);

    if (files.length) {
      for (const f of files) {
        const kb = parseKB(await loadKB(lang, f));
        const bot = document.createElement("div");
        bot.className = "msg botMsg";

        bot.insertAdjacentHTML("beforeend", `<div>${kb.short}</div>`);

        if (kb.long) {
          const btn = document.createElement("button");
          btn.className = "kbMoreBtn";
          btn.textContent = "➕";
          btn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            btn.remove();
            renderLong(bot, kb.long);
          };
          bot.appendChild(btn);
        }

        const a = document.createElement("a");
        a.href = BOOKING_URLS[lang];
        a.target = "_blank";
        a.className = "kbBookBtn";
        a.textContent = "🛎️";
        bot.appendChild(a);

        bodyEl.appendChild(bot);
      }

      bodyEl.scrollTop = bodyEl.scrollHeight;
      return;
    }
  }

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

  let files = [];

  if (intentFinal === "suite_named") {
    for (const k in SUITES_BY_NAME) {
      if (normalize(raw).includes(k)) files = [SUITES_BY_NAME[k]];
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

    if (kb.long) {
      const btn = document.createElement("button");
      btn.className = "kbMoreBtn";
      btn.textContent = "➕";
      btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        btn.remove();
        renderLong(bot, kb.long);
      };
      bot.appendChild(btn);
    }

    if (["rooms", "boat", "reiki"].includes(intentFinal)) {
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

  bodyEl.scrollTop = bodyEl.scrollHeight;
}


    sendBtn.addEventListener("click",sendMessage);
    input.addEventListener("keydown",e=>{
      if(e.key==="Enter"){e.preventDefault();sendMessage();}
    });

  });

})();
