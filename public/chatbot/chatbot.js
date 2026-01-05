/****************************************************
 * SOLO'IA'TICO — CHATBOT LUXE
 * Version 1.6.2 — CONCIERGE FLOW REIKI
 * Coexists with Flow Bateau
 ****************************************************/

(function () {

  const KB_BASE_URL = "https://solobotatico2026.vercel.app";
  const STORAGE_KEY = "soloia_concierge_v16";

  console.log("Solo’IA’tico Chatbot v1.6.2 — Flow Reiki");

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

  memory.lang  = memory.lang || null;
  memory.state = memory.state || "INFO_MODE";
  memory.slots = memory.slots || {};
  saveMemory();

  /****************************************************
   * STATES
   ****************************************************/
  const STATES = {
    INFO_MODE: "INFO_MODE",

    // Bateau
    BATEAU_DATE: "BATEAU_DATE",
    BATEAU_PEOPLE: "BATEAU_PEOPLE",

    // Reiki
    REIKI_DATE: "REIKI_DATE",
    REIKI_PEOPLE: "REIKI_PEOPLE"
  };

  function setState(s) {
    memory.state = s;
    saveMemory();
    console.log("🔁 STATE →", s);
  }

  /****************************************************
   * I18N — FR / EN
   ****************************************************/
  const I18N = {
    fr: {
      // Reiki
      infoReiki:
        "Le Reiki est un soin énergétique japonais favorisant une détente profonde, l’apaisement mental et le relâchement des tensions 🌿",
      askReikiDate:
        "Avec plaisir 🌿 Pour quelle date souhaitez-vous la séance de Reiki ?",
      askReikiPeople:
        "Parfait 😊 Pour combien de personnes sera la séance ?",
      reikiSummary: (d, p) =>
        `Voici le récapitulatif de votre demande :\n\n• Soin : Reiki\n• Date : ${d}\n• Personnes : ${p}`,
      bookReiki: "🧘‍♀️ Réserver une séance de Reiki",

      // Generic
      clarify: "Pouvez-vous préciser votre demande ? 😊"
    },

    en: {
      // Reiki
      infoReiki:
        "Reiki is a Japanese energy healing treatment promoting deep relaxation and emotional balance 🌿",
      askReikiDate:
        "With pleasure 🌿 For which date would you like the Reiki session?",
      askReikiPeople:
        "Great 😊 How many people will attend the session?",
      reikiSummary: (d, p) =>
        `Here is the summary of your request:\n\n• Treatment: Reiki\n• Date: ${d}\n• People: ${p}`,
      bookReiki: "🧘‍♀️ Book a Reiki session",

      // Generic
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
    if (/what|when|how many|reiki/.test(text.toLowerCase())) return "en";
    return null;
  }

  function resolveLang(text) {
    if (memory.lang) return memory.lang;
    return getPageLang() || detectLangFromText(text) || "fr";
  }

  /****************************************************
   * INTENTS
   ****************************************************/
  function intentReikiInfo(text) {
    return /parle|info|c[’']est quoi|tell me|about/.test(text.toLowerCase())
           && /reiki/.test(text.toLowerCase());
  }

  function intentReikiBook(text) {
    return /je veux|réserver|séance reiki|book|reiki session/.test(text.toLowerCase());
  }

  function intentBateauInfo(text) {
    return /parle|info|about/.test(text.toLowerCase())
           && /bateau|boat|tintorera/.test(text.toLowerCase());
  }

  function intentBateauBook(text) {
    return /je veux|réserver|faire du bateau|boat trip|book/.test(text.toLowerCase());
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
     * SEND MESSAGE — FLOW ENGINE
     ****************************************************/
    async function sendMessage() {
      if (!input.value.trim()) return;

      const text = input.value.trim();
      input.value = "";

      bodyEl.insertAdjacentHTML(
        "beforeend",
        `<div class="msg userMsg">${text}</div>`
      );
      typing.style.display = "flex";

      const lang = resolveLang(text);
      memory.lang = lang;

      const bot = document.createElement("div");
      bot.className = "msg botMsg";

      try {

        /* INFO REIKI */
        if (intentReikiInfo(text)) {
          memory.slots = {};
          setState(STATES.INFO_MODE);
          bot.textContent = t(lang, "infoReiki");
        }

        /* START REIKI BOOKING */
        else if (memory.state === STATES.INFO_MODE && intentReikiBook(text)) {
          memory.slots = {};
          setState(STATES.REIKI_DATE);
          bot.textContent = t(lang, "askReikiDate");
        }

        /* REIKI DATE */
        else if (memory.state === STATES.REIKI_DATE) {
          memory.slots.date = text;
          setState(STATES.REIKI_PEOPLE);
          bot.textContent = t(lang, "askReikiPeople");
        }

        /* REIKI PEOPLE */
        else if (memory.state === STATES.REIKI_PEOPLE) {
          memory.slots.people = text;

          bot.textContent = t(
            lang,
            "reikiSummary",
            memory.slots.date,
            memory.slots.people
          );

          const bookBtn = document.createElement("a");
          bookBtn.className = "kbBookBtn";
          bookBtn.href = "https://koalendar.com/e/soloatico-reiki";
          bookBtn.target = "_blank";
          bookBtn.textContent = t(lang, "bookReiki");

          bot.appendChild(document.createElement("br"));
          bot.appendChild(bookBtn);

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

    console.log("✅ Concierge Flow Reiki v1.6.2 ready");
  });

})();
