/****************************************************
 * SOLO'IA'TICO — CHATBOT LUXE
 * Version 1.6.5.2 — STABLE FIX
 * Multilingue FR / EN / ES / NL / CAT
 ****************************************************/

(function () {

  const KB_BASE_URL = "https://solobotatico2026.vercel.app";
  const STORAGE_KEY = "soloia_concierge_v1652";

  console.log("Solo’IA’tico Chatbot v1.6.5.2 — Stable Fix");

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
  saveMemory();

  /****************************************************
   * I18N — DÉCLARATION SÛRE
   ****************************************************/
  const I18N = {

    fr: {
      bateau: "Oui ⛵ Nous proposons des sorties privées à bord de la Tintorera.",
      reiki: "Le Reiki est un soin énergétique japonais favorisant la détente profonde 🌿",
      suitesTitle: "Voici nos hébergements ✨",
      suites: [
        "Suite Neus — élégante et lumineuse",
        "Suite Bourlardes — spacieuse et raffinée",
        "Chambre Blue Patio — cosy et intimiste"
      ],
      clarify: "Pouvez-vous préciser votre demande ? 😊"
    },

    en: {
      bateau: "Yes ⛵ We offer private boat trips aboard Tintorera.",
      reiki: "Reiki is a Japanese energy healing treatment promoting deep relaxation 🌿",
      suitesTitle: "Our accommodations ✨",
      suites: [
        "Suite Neus — elegant and bright",
        "Suite Bourlardes — spacious and refined",
        "Blue Patio Room — cosy and intimate"
      ],
      clarify: "Could you please clarify your request? 😊"
    },

    es: {
      bateau: "Sí ⛵ Ofrecemos salidas privadas en barco a bordo de la Tintorera.",
      reiki: "El Reiki es un tratamiento energético japonés que favorece la relajación profunda 🌿",
      suitesTitle: "Nuestros alojamientos ✨",
      suites: [
        "Suite Neus — elegante y luminosa",
        "Suite Bourlardes — amplia y sofisticada",
        "Habitación Blue Patio — acogedora e íntima"
      ],
      clarify: "¿Podría precisar su solicitud? 😊"
    },

    nl: {
      bateau: "Ja ⛵ Wij bieden privéboottochten aan met de Tintorera.",
      reiki: "Reiki is een Japanse energetische behandeling die diepe ontspanning bevordert 🌿",
      suitesTitle: "Onze accommodaties ✨",
      suites: [
        "Suite Neus — elegant en licht",
        "Suite Bourlardes — ruim en verfijnd",
        "Blue Patio Kamer — gezellig en intiem"
      ],
      clarify: "Kunt u uw vraag verduidelijken? 😊"
    },

    cat: {
      bateau: "Sí ⛵ Oferim sortides privades amb la Tintorera.",
      reiki: "El Reiki és un tractament energètic japonès que afavoreix la relaxació profunda 🌿",
      suitesTitle: "Els nostres allotjaments ✨",
      suites: [
        "Suite Neus — elegant i lluminosa",
        "Suite Bourlardes — espaiosa i refinada",
        "Habitació Blue Patio — acollidora i íntima"
      ],
      clarify: "Pots precisar una mica més la teva pregunta? 😊"
    }
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
  function isBateau(txt) { return /bateau|boat|tintorera/.test(txt); }
  function isReiki(txt)  { return /reiki|riki/.test(txt); }
  function isSuites(txt){ return /suite|suites|chambre|room|hebergement/.test(txt); }

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

    /* OPEN / CLOSE FIX */
    const chatWin = document.getElementById("chatWindow");
    const openBtn = document.getElementById("openChatBtn");

    if (chatWin && openBtn) {
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
      const txt = normalize(raw);

      const bot = document.createElement("div");
      bot.className = "msg botMsg";

      if (isBateau(txt)) bot.textContent = I18N[lang].bateau;
      else if (isReiki(txt)) bot.textContent = I18N[lang].reiki;
      else if (isSuites(txt)) {
        bot.innerHTML = `<b>${I18N[lang].suitesTitle}</b><br><br>`;
        I18N[lang].suites.forEach(s => bot.innerHTML += `• ${s}<br>`);
      }
      else bot.textContent = I18N[lang].clarify;

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

    console.log("✅ v1.6.5.2 loaded successfully");
  });

})();
