/****************************************************
 * SOLO'IA'TICO — CHATBOT LUXE
 * Version 1.7.6 — INTELLIGENCE DISCRÈTE (OPTION A)
 * - Tolérance aux fautes (fuzzy)
 * - Reformulation élégante (esprit Solo’IA’tico)
 * - KB = source de vérité
 ****************************************************/

(function () {

  const KB_BASE_URL = "https://solobotatico2026.vercel.app";
  const BOOKING_URL = "https://www.amenitiz.io/soloatico";

  console.log("Solo’IA’tico Chatbot v1.7.6 — OPTION A");

  document.addEventListener("DOMContentLoaded", async () => {

    /* ===== CSS ===== */
    if (!document.getElementById("soloia-css")) {
      const css = document.createElement("link");
      css.id = "soloia-css";
      css.rel = "stylesheet";
      css.href = `${KB_BASE_URL}/chatbot/chatbot.css`;
      document.head.appendChild(css);
    }

    /* ===== HTML ===== */
    if (!document.getElementById("chatWindow")) {
      const html = await fetch(`${KB_BASE_URL}/chatbot/chatbot.html`).then(r => r.text());
      document.body.insertAdjacentHTML("beforeend", html);
    }

    /* ===== DOM ===== */
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
      e.preventDefault();
      e.stopPropagation();
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

    /* ===== LANG ===== */
    function pageLang() {
      const l = document.documentElement.lang?.slice(0,2);
      return ["fr","en","es","ca","nl"].includes(l) ? l : "fr";
    }

    function detectLang(text) {
      const t = text.toLowerCase();

      if (/\b(what|how|book|available|price|have you|do you|is there|are there)\b/.test(t)) return "en";
      if (/\b(habitacion|reservar|piscina|barco)\b/.test(t)) return "es";
      if (/\b(habitacio|reservar|piscina|vaixell)\b/.test(t)) return "ca";
      if (/\b(kamer|reserveren|zwembad|boot)\b/.test(t)) return "nl";

      return pageLang();
    }

    function kbLang(lang) {
      return lang === "ca" ? "cat" : lang;
    }

    /* ===== NORMALISATION + FUZZY ===== */
    function normalize(text) {
      return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z\s]/g, "");
    }

    const FUZZY = {
      rooms: ["suite", "suites", "chambre", "room", "kamer"],
      boat: ["bateau", "batea", "bato", "boat", "boot", "vaixell"],
      reiki: ["reiki", "reiky", "riki"],
      pool: ["piscine", "piscina", "pool", "zwembad"]
    };

    function fuzzyIntent(text) {
      for (const key in FUZZY) {
        if (FUZZY[key].some(k => text.includes(k))) return key;
      }
      return "generic";
    }

    /* ===== INTENT ===== */
    function intent(text) {
      const t = normalize(text);
      return fuzzyIntent(t);
    }

    /* ===== KB ===== */
    async function loadKB(lang, path) {
      const dir = kbLang(lang);
      let r = await fetch(`${KB_BASE_URL}/kb/${dir}/${path}`);
      if (!r.ok && dir !== "fr") {
        r = await fetch(`${KB_BASE_URL}/kb/fr/${path}`);
      }
      if (!r.ok) throw "KB introuvable";
      return r.text();
    }

    function parseKB(txt) {
      return {
        short: (txt.match(/SHORT:\s*([\s\S]*?)\n/i) || ["",""])[1].trim(),
        long:  (txt.match(/LONG:\s*([\s\S]*)/i) || ["",""])[1].trim()
      };
    }

    /* ===== STYLE SOLO'IA'TICO ===== */
    const STYLE = {
      fr: {
        rooms: "🏨 **Nos hébergements**\nUn art de vivre à Solo’IA’tico :",
        boat: "⛵ **Tintorera**\nUne expérience exclusive :",
        reiki: "🧘‍♀️ **Reiki**\nUn moment pour soi :",
        pool: "🏊‍♀️ **Piscine rooftop**\nUn véritable atout de la maison :"
      },
      en: {
        rooms: "🏨 **Our accommodations**\nThe Solo’IA’tico way of living:",
        boat: "⛵ **Tintorera**\nAn exclusive experience:",
        reiki: "🧘‍♀️ **Reiki**\nA moment just for you:",
        pool: "🏊‍♀️ **Rooftop pool**\nOne of our highlights:"
      },
      es: {
        rooms: "🏨 **Nuestros alojamientos**\nEl arte de vivir en Solo’IA’tico:",
        boat: "⛵ **Tintorera**\nUna experiencia exclusiva:",
        reiki: "🧘‍♀️ **Reiki**\nUn momento para ti:",
        pool: "🏊‍♀️ **Piscina rooftop**\nUn gran atractivo de la casa:"
      },
      ca: {
        rooms: "🏨 **Els nostres allotjaments**\nL’art de viure a Solo’IA’tico:",
        boat: "⛵ **Tintorera**\nUna experiència exclusiva:",
        reiki: "🧘‍♀️ **Reiki**\nUn moment per a tu:",
        pool: "🏊‍♀️ **Piscina rooftop**\nUn gran atractiu de la casa:"
      },
      nl: {
        rooms: "🏨 **Onze accommodaties**\nDe Solo’IA’tico levensstijl:",
        boat: "⛵ **Tintorera**\nEen exclusieve ervaring:",
        reiki: "🧘‍♀️ **Reiki**\nEen moment voor jezelf:",
        pool: "🏊‍♀️ **Rooftop zwembad**\nEen van onze troeven:"
      }
    };

    /* ===== UI ===== */
    const UI = {
      fr:{ more:"Voir la description complète", book:"🏨 Réserver" },
      en:{ more:"View full description", book:"🏨 Book now" },
      es:{ more:"Ver la descripción completa", book:"🏨 Reservar" },
      ca:{ more:"Veure la descripció completa", book:"🏨 Reservar" },
      nl:{ more:"Volledige beschrijving bekijken", book:"🏨 Reserveren" }
    };

    function renderLong(bot, text) {
      const wrap = document.createElement("div");
      wrap.className = "kbLong";
      text.split("\n\n").forEach(p => {
        const el = document.createElement("p");
        el.innerHTML = p;
        wrap.appendChild(el);
      });
      bot.appendChild(wrap);
    }

    /* ===== SEND ===== */
    async function sendMessage() {
      if (!input.value.trim()) return;

      const raw = input.value;
      input.value = "";

      bodyEl.insertAdjacentHTML("beforeend",
        `<div class="msg userMsg">${raw}</div>`);

      const lang = detectLang(raw);
      const i = intent(raw);

      let files = [];
      if (i === "rooms") files = [
        "02_suites/suite-neus.txt",
        "02_suites/suite-bourlardes.txt",
        "02_suites/room-blue-patio.txt"
      ];
      if (i === "boat")  files = ["03_services/tintorera-bateau.txt"];
      if (i === "reiki") files = ["03_services/reiki.txt"];
      if (i === "pool")  files = ["03_services/piscine-rooftop.txt"];

      for (const f of files) {
        const kb = parseKB(await loadKB(lang, f));
        const bot = document.createElement("div");
        bot.className = "msg botMsg";

        const prefix = STYLE[lang]?.[i] || "";
        bot.innerHTML = `${prefix}<br>${kb.short}`;

        if (kb.long) {
          const moreBtn = document.createElement("button");
          moreBtn.className = "kbMoreBtn";
          moreBtn.textContent = UI[lang].more;
          moreBtn.onclick = e => {
            e.preventDefault(); e.stopPropagation();
            moreBtn.remove();
            renderLong(bot, kb.long);
          };
          bot.appendChild(document.createElement("br"));
          bot.appendChild(moreBtn);
        }

        if (i === "rooms") {
          const bookBtn = document.createElement("a");
          bookBtn.href = BOOKING_URL;
          bookBtn.target = "_blank";
          bookBtn.className = "kbBookBtn";
          bookBtn.textContent = UI[lang].book;
          bot.appendChild(document.createElement("br"));
          bot.appendChild(bookBtn);
        }

        bodyEl.appendChild(bot);
      }

      bodyEl.scrollTop = bodyEl.scrollHeight;
    }

    sendBtn.addEventListener("click", sendMessage);
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
      }
    });

  });

})();
