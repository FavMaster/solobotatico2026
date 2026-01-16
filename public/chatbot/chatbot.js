/****************************************************
 * SOLO'IA'TICO — CHATBOT LUXE
 * Version 1.7.11 — AFFICHAGE PROGRESSIF
 ****************************************************/

(function () {

  const KB_BASE_URL = "https://solobotatico2026.vercel.app";

  const BOOKING_URLS = {
    fr: "https://soloatico.amenitiz.io/fr/booking/room#DatesGuests-BE",
    es: "https://soloatico.amenitiz.io/es/booking/room#DatesGuests-BE",
    nl: "https://soloatico.amenitiz.io/nl/booking/room#DatesGuests-BE",
    ca: "https://soloatico.amenitiz.io/ca/booking/room#DatesGuests-BE",
    en: "https://soloatico.amenitiz.io/en/booking/room#DatesGuests-BE"
  };

  console.log("Solo’IA’tico Chatbot v1.7.11 — Progressive UX");

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

    /* ===== UTILS ===== */
    const sleep = ms => new Promise(r => setTimeout(r, ms));

    function normalize(text) {
      return text.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z\s]/g, "");
    }

    function pageLang() {
      const l = document.documentElement.lang?.slice(0,2);
      return ["fr","en","es","ca","nl"].includes(l) ? l : "fr";
    }

    function detectLang(text) {
      const t = normalize(text);
      if (/\b(hello|hi|what|where|how)\b/.test(t)) return "en";
      if (/\b(hola|habitacion|reservar)\b/.test(t)) return "es";
      if (/\b(bon dia|habitacio)\b/.test(t)) return "ca";
      if (/\b(hallo|kamer)\b/.test(t)) return "nl";
      return pageLang();
    }

    function kbLang(lang) {
      return lang === "ca" ? "cat" : lang;
    }

    /* ===== INTENTS ===== */
    const GREETINGS = ["bonjour","salut","hello","hi","hola","bon dia"];
    const FUZZY = {
      rooms: [
        "suite","suites","chambre","room","kamers",
        "logement","logements","hebergement","hebergements",
        "accommodation","accommodations","stay","where to stay"
      ],
      boat: ["tintorera","bateau","batea","boat","boot","vaixell"],
      pool: ["piscine","piscina","pool","swimming","zwembad"],
      reiki: ["reiki","reiky","riki"]
    };

    function intent(text) {
      const t = normalize(text);
      if (GREETINGS.some(g => t.includes(g))) return "greeting";
      for (const key in FUZZY) {
        if (FUZZY[key].some(k => t.includes(k))) return key;
      }
      return "unknown";
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

    /* ===== KB LONG PRO ===== */
    function renderLongPro(bot, text) {
      const wrapper = document.createElement("div");
      wrapper.className = "kbLongWrapper";

      text.split("\n").forEach(line => {
        const l = line.trim();
        if (!l) return;

        const el = document.createElement("div");
        el.className = l.startsWith("-") || l.startsWith("•")
          ? "kbLongBullet"
          : "kbLongParagraph";
        el.textContent = l.replace(/^[-•]\s*/, "");
        wrapper.appendChild(el);
      });

      bot.appendChild(wrapper);
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

      if (files.length === 0) return;

      for (const f of files) {
        const kb = parseKB(await loadKB(lang, f));
        const bot = document.createElement("div");
        bot.className = "msg botMsg";

        bot.innerHTML = `<div class="kbLongTitle">${kb.short}</div>`;
        bodyEl.appendChild(bot);
        bodyEl.scrollTop = bodyEl.scrollHeight;

        if (kb.long) {
          await sleep(400); // 🌙 douceur
          renderLongPro(bot, kb.long);
        }

        const bookBtn = document.createElement("a");
        bookBtn.href = BOOKING_URLS[lang] || BOOKING_URLS.fr;
        bookBtn.target = "_blank";
        bookBtn.className = "kbBookBtn";
        bookBtn.textContent = "🏨 Réserver";
        bot.appendChild(bookBtn);

        bodyEl.scrollTop = bodyEl.scrollHeight;
        await sleep(500); // 🌙 respiration entre les bulles
      }
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
