/****************************************************
 * SOLO'IA'TICO — CHATBOT LUXE
 * Version 1.6.2.1 — NLP SMART
 * Tolérance fautes & formulations naturelles
 ****************************************************/

(function () {

  const KB_BASE_URL = "https://solobotatico2026.vercel.app";
  const STORAGE_KEY = "soloia_concierge_v16";

  console.log("Solo’IA’tico Chatbot v1.6.2.1 — NLP SMART");

  /****************************************************
   * MEMORY ENGINE
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
   * I18N
   ****************************************************/
  const I18N = {
    fr: {
      infoReiki:
        "Le Reiki est un soin énergétique japonais favorisant une détente profonde, l’apaisement mental et le relâchement des tensions 🌿",
      askReikiDate:
        "Avec plaisir 🌿 Pour quelle date souhaitez-vous la séance de Reiki ?",
      askReikiPeople:
        "Parfait 😊 Pour combien de personnes sera la séance ?",
      reikiSummary: (d, p) =>
        `Voici le récapitulatif de votre demande :\n\n• Soin : Reiki\n• Date : ${d}\n• Personnes : ${p}`,
      bookReiki: "🧘‍♀️ Réserver une séance de Reiki",

      infoBateau:
        "Oui ⛵ Nous proposons des sorties en bateau privé à bord de la Tintorera, idéales pour baignades, couchers de soleil et découvertes marines sur la Costa Brava.",
      askBateauDate:
        "Avec plaisir ⛵ Pour quelle date souhaitez-vous la sortie en mer ?",
      askBateauPeople:
        "Parfait 😊 Combien de personnes participeront à la sortie ?",
      bateauSummary: (d, p) =>
        `Parfait ! Voici le récapitulatif :\n\n• Activité : Sortie bateau Tintorera\n• Date : ${d}\n• Personnes : ${p}`,
      bookBateau: "⛵ Réserver la sortie Tintorera",

      clarify: "Pouvez-vous préciser votre demande ? 😊"
    },

    en: {
      infoReiki:
        "Reiki is a Japanese energy healing treatment promoting deep relaxation and emotional balance 🌿",
      askReikiDate:
        "With pleasure 🌿 For which date would you like the Reiki session?",
      askReikiPeople:
        "Great 😊 How many people will attend the session?",
      reikiSummary: (d, p) =>
        `Here is the summary of your request:\n\n• Treatment: Reiki\n• Date: ${d}\n• People: ${p}`,
      bookReiki: "🧘‍♀️ Book a Reiki session",

      infoBateau:
        "Yes ⛵ We offer private boat trips aboard Tintorera, perfect for swimming, sunset cruises and coastal discovery.",
      askBateauDate:
        "With pleasure ⛵ For which date would you like the boat trip?",
      askBateauPeople:
        "Great 😊 How many people will join the trip?",
      bateauSummary: (d, p) =>
        `Perfect! Here is the summary:\n\n• Activity: Tintorera boat trip\n• Date: ${d}\n• People: ${p}`,
      bookBateau: "⛵ Book the Tintorera boat trip",

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

  function resolveLang(text) {
    if (memory.lang) return memory.lang;
    return getPageLang() || "fr";
  }

  /****************************************************
   * NLP — NORMALISATION
   ****************************************************/
  function normalize(text) {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s?]/g, "")
      .trim();
  }

  function hasQuestion(text) {
    return text.includes("?");
  }

  /****************************************************
   * INTENT DETECTION — SMART
   ****************************************************/
  function isInfoIntent(txt) {
    return /quest ce que|qu est ce que|cest quoi|avez vous|y a t il|parle moi|parlez|info/.test(txt)
           || hasQuestion(txt);
  }

  function isReiki(txt) {
    return /reiki|riki/.test(txt);
  }

  function isBateau(txt) {
    return /bateau|boat|tintorera/.test(txt);
  }

  function isBooking(txt) {
    return /je veux|reserver|reservation|book|faire/.test(txt);
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

    const sendBtn = document.getElementById("sendBtn");
    const input   = document.getElementById("userInput");
    const bodyEl  = document.getElementById("chatBody");
    const typing  = document.getElementById("typing");

    async function sendMessage() {
      if (!input.value.trim()) return;

      const raw = input.value.trim();
      input.value = "";

      bodyEl.insertAdjacentHTML("beforeend", `<div class="msg userMsg">${raw}</div>`);
      typing.style.display = "flex";

      const lang = resolveLang(raw);
      memory.lang = lang;

      const text = normalize(raw);
      const bot = document.createElement("div");
      bot.className = "msg botMsg";

      try {

        /* INFO REIKI */
        if (isInfoIntent(text) && isReiki(text)) {
          setState(STATES.INFO_MODE);
          bot.textContent = t(lang, "infoReiki");
        }

        /* BOOK REIKI */
        else if (isBooking(text) && isReiki(text) && memory.state === STATES.INFO_MODE) {
          setState(STATES.REIKI_DATE);
          bot.textContent = t(lang, "askReikiDate");
        }

        else if (memory.state === STATES.REIKI_DATE) {
          memory.slots.date = raw;
          setState(STATES.REIKI_PEOPLE);
          bot.textContent = t(lang, "askReikiPeople");
        }

        else if (memory.state === STATES.REIKI_PEOPLE) {
          memory.slots.people = raw;
          bot.textContent = t(lang, "reikiSummary", memory.slots.date, memory.slots.people);

          const btn = document.createElement("a");
          btn.className = "kbBookBtn";
          btn.href = "https://koalendar.com/e/soloatico-reiki";
          btn.target = "_blank";
          btn.textContent = t(lang, "bookReiki");

          bot.appendChild(document.createElement("br"));
          bot.appendChild(btn);

          memory.slots = {};
          setState(STATES.INFO_MODE);
        }

        /* INFO BATEAU */
        else if (isInfoIntent(text) && isBateau(text)) {
          setState(STATES.INFO_MODE);
          bot.textContent = t(lang, "infoBateau");
        }

        /* BOOK BATEAU */
        else if (isBooking(text) && isBateau(text) && memory.state === STATES.INFO_MODE) {
          setState(STATES.BATEAU_DATE);
          bot.textContent = t(lang, "askBateauDate");
        }

        else if (memory.state === STATES.BATEAU_DATE) {
          memory.slots.date = raw;
          setState(STATES.BATEAU_PEOPLE);
          bot.textContent = t(lang, "askBateauPeople");
        }

        else if (memory.state === STATES.BATEAU_PEOPLE) {
          memory.slots.people = raw;
          bot.textContent = t(lang, "bateauSummary", memory.slots.date, memory.slots.people);

          const btn = document.createElement("a");
          btn.className = "kbBookBtn";
          btn.href = "https://koalendar.com/e/tintorera";
          btn.target = "_blank";
          btn.textContent = t(lang, "bookBateau");

          bot.appendChild(document.createElement("br"));
          bot.appendChild(btn);

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

    console.log("✅ NLP SMART active — v1.6.2.1");
  });

})();
