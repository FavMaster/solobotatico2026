/****************************************************
 * SOLO'IA'TICO — CHATBOT LUXE
 * Version 1.6.1.1 — FLOW BATEAU FIXED
 * Distinction INFO vs BOOK
 ****************************************************/

(function () {

  const KB_BASE_URL = "https://solobotatico2026.vercel.app";
  const STORAGE_KEY = "soloia_concierge_v16";

  console.log("Solo’IA’tico Chatbot v1.6.1.1 — Flow Bateau Fixed");

  /****************************************************
   * MEMORY ENGINE (PERSISTENT)
   ****************************************************/
  const memory = (() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  })();

  function saveMemory() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
  }

  memory.lang = memory.lang || null;
  memory.state = memory.state || "INFO_MODE";
  memory.slots = memory.slots || {};
  saveMemory();

  /****************************************************
   * STATES
   ****************************************************/
  const STATES = {
    INFO_MODE: "INFO_MODE",
    BATEAU_DATE: "BATEAU_DATE",
    BATEAU_PEOPLE: "BATEAU_PEOPLE"
  };

  function setState(s) {
    memory.state = s;
    saveMemory();
    console.log("🔁 STATE →", s);
  }

  /****************************************************
   * I18N
   ****************************************************/
  const I18N = {
    fr: {
      askDate: "Avec plaisir ⛵ Pour quelle date souhaitez-vous la sortie en mer ?",
      askPeople: "Parfait 😊 Combien de personnes participeront à la sortie ?",
      infoBateau:
        "La Tintorera est une sortie en bateau privée à bord d’un llaut catalan traditionnel, idéale pour baignades, couchers de soleil et découvertes marines sur la Costa Brava ⛵",
      summary: (d, p) =>
        `Parfait ! Voici le récapitulatif :\n\n• Activité : Sortie bateau Tintorera\n• Date : ${d}\n• Personnes : ${p}`,
      book: "⛵ Réserver la sortie Tintorera",
      clarify: "Pouvez-vous préciser votre demande ? 😊"
    },

    en: {
      askDate: "With pleasure ⛵ For which date would you like the boat trip?",
      askPeople: "Great 😊 How many people will join the trip?",
      infoBateau:
        "Tintorera is a private boat experience aboard a traditional Catalan llaut, perfect for swimming, sunset cruises and coastal discovery ⛵",
      summary: (d, p) =>
        `Perfect! Here is the summary:\n\n• Activity: Tintorera boat trip\n• Date: ${d}\n• People: ${p}`,
      book: "⛵ Book the Tintorera boat trip",
      clarify: "Could you please clarify your request? 😊"
    }
  };

  function t(lang, key, ...args) {
    const v = I18N[lang]?.[key] || I18N.fr[key];
    return typeof v === "function" ? v(...args) : v;
  }

  /****************************************************
   * LANGUAGE
   ****************************************************/
  function getPageLang() {
    return document.documentElement.lang?.split("-")[0] || "fr";
  }

  function detectLangFromText(text) {
    if (/what|when|how many|boat/.test(text.toLowerCase())) return "en";
    return null;
  }

  function resolveLang(text) {
    if (memory.lang) return memory.lang;
    return getPageLang() || detectLangFromText(text) || "fr";
  }

  /****************************************************
   * INTENTS
   ****************************************************/
  function intentBateauBook(text) {
    return /je veux|réserver|faire du bateau|boat trip|book/.test(text.toLowerCase());
  }

  function intentBateauInfo(text) {
    return /parle|info|c[’']est quoi|tell me|about/.test(text.toLowerCase())
           && /bateau|boat|tintorera/.test(text.toLowerCase());
  }

  /****************************************************
   * DOM READY
   ****************************************************/
  document.addEventListener("DOMContentLoaded", async () => {

    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = `${KB_BASE_URL}/chatbot/chatbot.css`;
    document.head.appendChild(css);

    const html = await fetch(`${KB_BASE_URL}/chatbot/chatbot.html`).then(r => r.text());
    document.body.insertAdjacentHTML("beforeend", html);

    const chatWin = document.getElementById("chatWindow");
    const openBtn = document.getElementById("openChatBtn");
    const sendBtn = document.getElementById("sendBtn");
    const input   = document.getElementById("userInput");
    const bodyEl  = document.getElementById("chatBody");
    const typing  = document.getElementById("typing");

    chatWin.style.display = "none";
    let isOpen = false;

    openBtn.addEventListener("click", e => {
      e.stopPropagation();
      isOpen = !isOpen;
      chatWin.style.display = isOpen ? "flex" : "none";
    });

    /****************************************************
     * SEND MESSAGE — FIXED FLOW
     ****************************************************/
    async function sendMessage() {
      if (!input.value.trim()) return;

      const text = input.value.trim();
      input.value = "";

      bodyEl.insertAdjacentHTML("beforeend", `<div class="msg userMsg">${text}</div>`);
      typing.style.display = "flex";

      const lang = resolveLang(text);
      memory.lang = lang;

      const bot = document.createElement("div");
      bot.className = "msg botMsg";

      try {

        /* INFO BATEAU */
        if (intentBateauInfo(text)) {
          setState(STATES.INFO_MODE);
          memory.slots = {};
          bot.textContent = t(lang, "infoBateau");
        }

        /* START BOOKING */
        else if (memory.state === STATES.INFO_MODE && intentBateauBook(text)) {
          memory.slots = {};
          setState(STATES.BATEAU_DATE);
          bot.textContent = t(lang, "askDate");
        }

        /* DATE */
        else if (memory.state === STATES.BATEAU_DATE) {
          memory.slots.date = text;
          setState(STATES.BATEAU_PEOPLE);
          bot.textContent = t(lang, "askPeople");
        }

        /* PEOPLE */
        else if (memory.state === STATES.BATEAU_PEOPLE) {
          memory.slots.people = text;

          bot.textContent = t(
            lang,
            "summary",
            memory.slots.date,
            memory.slots.people
          );

          const bookBtn = document.createElement("a");
          bookBtn.className = "kbBookBtn";
          bookBtn.href = "https://koalendar.com/e/tintorera";
          bookBtn.target = "_blank";
          bookBtn.textContent = t(lang, "book");

          bot.appendChild(document.createElement("br"));
          bot.appendChild(bookBtn);

          // Reset propre
          memory.slots = {};
          setState(STATES.INFO_MODE);
        }

        /* FALLBACK */
        else {
          bot.textContent = t(lang, "clarify");
        }

        saveMemory();

      } catch (e) {
        console.error(e);
        bot.textContent = t(lang, "clarify");
        setState(STATES.INFO_MODE);
      }

      typing.style.display = "none";
      bodyEl.appendChild(bot);
      bodyEl.scrollTop = bodyEl.scrollHeight;
    }

    sendBtn.addEventListener("click", e => {
      e.preventDefault();
      sendMessage();
    });

    input.addEventListener("keydown", e => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    console.log("✅ Concierge Flow Bateau v1.6.1.1 ready");
  });

})();
