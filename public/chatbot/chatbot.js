/****************************************************
 * SOLO'IA'TICO — CHATBOT LUXE
 * Version 1.6.5.1 — STABLE
 * Multilingue FR / EN / ES / NL / CAT
 * Patch ouverture chatbot inclus
 ****************************************************/

(function () {

  const KB_BASE_URL = "https://solobotatico2026.vercel.app";
  const STORAGE_KEY = "soloia_concierge_v165";

  console.log("Solo’IA’tico Chatbot v1.6.5.1 — Stable");

  /****************************************************
   * MEMORY ENGINE
   ****************************************************/
  const memory = (() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch { return {}; }
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

    BATEAU_DATE: "BATEAU_DATE",
    BATEAU_PEOPLE: "BATEAU_PEOPLE",

    REIKI_DATE: "REIKI_DATE",
    REIKI_PEOPLE: "REIKI_PEOPLE",

    SUITES_DATES: "SUITES_DATES",
    SUITES_PEOPLE: "SUITES_PEOPLE"
  };

  function setState(s) {
    memory.state = s;
    saveMemory();
  }

  /****************************************************
   * I18N — SINGLE SOURCE
   ****************************************************/
  const I18N = {
    fr: {
      bateau: {
        info: "Oui ⛵ Nous proposons des sorties privées à bord de la Tintorera, idéales pour baignades, couchers de soleil et découvertes marines.",
        askDate: "Avec plaisir ⛵ Pour quelle date souhaitez-vous la sortie en mer ?",
        askPeople: "Parfait 😊 Combien de personnes participeront à la sortie ?",
        summary: (d, p) => `Récapitulatif :\n\n• Sortie bateau Tintorera\n• Date : ${d}\n• Personnes : ${p}`,
        book: "⛵ Réserver la sortie Tintorera"
      },
      reiki: {
        info: "Le Reiki est un soin énergétique japonais favorisant la détente profonde et l’équilibre émotionnel 🌿",
        askDate: "Avec plaisir 🌿 Pour quelle date souhaitez-vous la séance de Reiki ?",
        askPeople: "Parfait 😊 Pour combien de personnes sera la séance ?",
        summary: (d, p) => `Récapitulatif :\n\n• Soin Reiki\n• Date : ${d}\n• Personnes : ${p}`,
        book: "🧘‍♀️ Réserver une séance de Reiki"
      },
      suites: {
        listTitle: "Voici nos hébergements ✨",
        list: [
          "Suite Neus — élégante et lumineuse",
          "Suite Bourlardes — spacieuse et raffinée",
          "Chambre Blue Patio — cosy et intimiste"
        ],
        infoNeus: "La Suite Neus est élégante et lumineuse, idéale pour un séjour paisible.",
        infoBourlardes: "La Suite Bourlardes offre de beaux volumes et un confort haut de gamme.",
        infoBlue: "La Chambre Blue Patio est parfaite pour un séjour cosy.",
        askDates: "Quelles dates souhaitez-vous pour votre séjour ?",
        askPeople: "Pour combien de personnes sera le séjour ?",
        summary: (d, p) => `Récapitulatif :\n\n• Séjour à Solo Ático\n• Dates : ${d}\n• Personnes : ${p}`,
        book: "🏨 Vérifier les disponibilités"
      },
      clarify: "Pouvez-vous préciser votre demande ? 😊"
    },

    /* EN / ES / NL / CAT IDENTIQUES À 1.6.5 */
    en: { ...I18N?.en },
    es: { ...I18N?.es },
    nl: { ...I18N?.nl },
    cat:{ ...I18N?.cat }
  };

  /****************************************************
   * LANGUAGE
   ****************************************************/
  function getPageLang() {
    return document.documentElement.lang?.split("-")[0] || "fr";
  }
  function resolveLang() {
    return memory.lang || getPageLang() || "fr";
  }

  /****************************************************
   * NLP HELPERS
   ****************************************************/
  function normalize(txt) {
    return txt.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s?]/g, "")
      .trim();
  }

  function isQuestion(txt) { return txt.includes("?"); }
  function isBooking(txt) {
    return /je veux|reserver|book|stay|disponibil|dates|venir/.test(txt);
  }

  function isBateau(txt) { return /bateau|boat|tintorera/.test(txt); }
  function isReiki(txt)  { return /reiki|riki/.test(txt); }
  function isSuites(txt){ return /suite|suites|chambre|room|hebergement|stay/.test(txt); }
  function isNeus(txt) { return /neus/.test(txt); }
  function isBourlardes(txt) { return /bourlard/.test(txt); }
  function isBlue(txt) { return /blue/.test(txt); }

  /****************************************************
   * DOM READY
   ****************************************************/
  document.addEventListener("DOMContentLoaded", async () => {

    /* CSS */
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = `${KB_BASE_URL}/chatbot/chatbot.css`;
    document.head.appendChild(css);

    /* HTML */
    const html = await fetch(`${KB_BASE_URL}/chatbot/chatbot.html`).then(r => r.text());
    document.body.insertAdjacentHTML("beforeend", html);

    /* PATCH OUVERTURE CHAT */
    const chatWin = document.getElementById("chatWindow");
    const openBtn = document.getElementById("openChatBtn");

    if (chatWin && openBtn) {
      let isOpen = false;
      chatWin.style.display = "none";

      openBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        isOpen = !isOpen;
        chatWin.style.display = isOpen ? "flex" : "none";
      });

      document.addEventListener("click", (e) => {
        if (isOpen && !chatWin.contains(e.target) && !openBtn.contains(e.target)) {
          chatWin.style.display = "none";
          isOpen = false;
        }
      });
    }

    /* CHAT CORE */
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

      const lang = resolveLang();
      memory.lang = lang;
      const txt = normalize(raw);

      const bot = document.createElement("div");
      bot.className = "msg botMsg";

      try {

        if (isBateau(txt) && isQuestion(txt) && !isBooking(txt)) {
          bot.textContent = I18N[lang].bateau.info;
        }
        else if (isReiki(txt) && isQuestion(txt) && !isBooking(txt)) {
          bot.textContent = I18N[lang].reiki.info;
        }
        else if (isSuites(txt) && isQuestion(txt) && !isBooking(txt)) {
          bot.innerHTML = `<b>${I18N[lang].suites.listTitle}</b><br><br>`;
          I18N[lang].suites.list.forEach(s => bot.innerHTML += `• ${s}<br>`);
        }
        else if (isNeus(txt)) bot.textContent = I18N[lang].suites.infoNeus;
        else if (isBourlardes(txt)) bot.textContent = I18N[lang].suites.infoBourlardes;
        else if (isBlue(txt)) bot.textContent = I18N[lang].suites.infoBlue;
        else bot.textContent = I18N[lang].clarify;

      } catch (e) {
        console.error(e);
        bot.textContent = I18N[lang].clarify;
      }

      typing.style.display = "none";
      bodyEl.appendChild(bot);
      bodyEl.scrollTop = bodyEl.scrollHeight;
      saveMemory();
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

    console.log("✅ v1.6.5.1 ready & stable");
  });

})();
