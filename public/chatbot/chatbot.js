/****************************************************
 * SOLO'IA'TICO — CHATBOT LUXE
 * Version 1.6.9.0 — AUTO LANGUAGE ONLY (FINAL)
 ****************************************************/

(function SoloIATico() {

  const KB_BASE_URL = "https://solobotatico2026.vercel.app";

  console.log("Solo’IA’tico Chatbot v1.6.9.0 — AUTO LANG");

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(async function () {

    /* ================= CSS ================= */
    if (!document.getElementById("soloia-css")) {
      const css = document.createElement("link");
      css.id = "soloia-css";
      css.rel = "stylesheet";
      css.href = `${KB_BASE_URL}/chatbot/chatbot.css`;
      document.head.appendChild(css);
    }

    /* ================= HTML ================= */
    if (!document.getElementById("chatWindow")) {
      const html = await fetch(`${KB_BASE_URL}/chatbot/chatbot.html`).then(r => r.text());
      document.body.insertAdjacentHTML("beforeend", html);
    }

    /* ================= DOM ================= */
    const chatWin = document.getElementById("chatWindow");
    const openBtn = document.getElementById("openChatBtn");
    const sendBtn = document.getElementById("sendBtn");
    const input   = document.getElementById("userInput");
    const bodyEl  = document.getElementById("chatBody");

    /* ================= LANG ================= */
    function pageLang() {
      return document.documentElement.lang?.slice(0,2) || "fr";
    }

    function detectLangFromMessage(t) {
      if (/\b(is er|zwembad|boot)\b/.test(t)) return "nl";
      if (/\b(what|how|is|are|pool|boat)\b/.test(t)) return "en";
      if (/\b(piscina|barco)\b/.test(t)) return "es";
      if (/\b(piscina|vaixell)\b/.test(t)) return "ca";
      return null;
    }

    function resolveLang(t = "") {
      return detectLangFromMessage(t) || pageLang() || "fr";
    }

    /* ================= WELCOME ================= */
    const WELCOME = {
      fr:`👋 <b>Bonjour et bienvenue !</b><br>
          Je suis <b>Solo’IA’tico Assistant</b>.<br><br>
          Posez-moi vos questions concernant :<br>
          • Suites & Réservation<br>
          • Bateau Tintorera<br>
          • Reiki & Bien-être<br>
          • Que faire à L’Escala<br><br>
          <b>Comment puis-je vous aider ?</b>`,

      en:`👋 <b>Hello and welcome!</b><br>
          I’m <b>Solo’IA’tico Assistant</b>.<br><br>
          You can ask me about:<br>
          • Suites & Booking<br>
          • Tintorera Boat<br>
          • Reiki & Wellness<br>
          • Things to do in L’Escala<br><br>
          <b>How can I help you?</b>`,

      es:`👋 <b>¡Hola y bienvenido!</b><br>
          Soy <b>Solo’IA’tico Assistant</b>.<br><br>
          Puedes preguntarme sobre:<br>
          • Suites y Reservas<br>
          • Barco Tintorera<br>
          • Reiki y Bienestar<br>
          • Qué hacer en L’Escala<br><br>
          <b>¿En qué puedo ayudarte?</b>`,

      ca:`👋 <b>Hola i benvingut!</b><br>
          Sóc <b>Solo’IA’tico Assistant</b>.<br><br>
          Em pots preguntar sobre:<br>
          • Suites i Reserves<br>
          • Vaixell Tintorera<br>
          • Reiki i Benestar<br>
          • Què fer a L’Escala<br><br>
          <b>Com et puc ajudar?</b>`,

      nl:`👋 <b>Hallo en welkom!</b><br>
          Ik ben <b>Solo’IA’tico Assistant</b>.<br><br>
          Je kunt mij vragen stellen over:<br>
          • Suites & Reserveren<br>
          • Tintorera boottocht<br>
          • Reiki & Welzijn<br>
          • Wat te doen in L’Escala<br><br>
          <b>Waarmee kan ik je helpen?</b>`
    };

    /* ================= OPEN / CLOSE ================= */
    let isOpen = false;
    chatWin.style.display = "none";

    openBtn.onclick = e => {
      e.preventDefault();
      e.stopPropagation();
      isOpen = !isOpen;
      chatWin.style.display = isOpen ? "flex" : "none";

      if (isOpen && !chatWin.dataset.welcomed) {
        const lang = resolveLang();
        const w = document.createElement("div");
        w.className = "msg botMsg welcomeMsg";
        w.innerHTML = WELCOME[lang] || WELCOME.fr;
        bodyEl.prepend(w);
        chatWin.dataset.welcomed = "1";
      }
    };

    /* ================= BASIC SEND (flows inchangés ailleurs) ================= */
    function norm(t) {
      return t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
    }

    function route(t) {
      if(/bateau|tintorera|boat/.test(t)) return "tintorera";
      if(/reiki|riki/.test(t)) return "reiki";
      if(/piscine|pool|zwembad/.test(t)) return "piscine";
      return null;
    }

    async function sendMessage() {
      if (!input.value.trim()) return;
      const raw = input.value;
      input.value = "";

      bodyEl.insertAdjacentHTML("beforeend", `<div class="msg userMsg">${raw}</div>`);

      const lang = resolveLang(norm(raw));
      const intent = route(norm(raw));

      if (!intent) {
        bodyEl.insertAdjacentHTML("beforeend",
          `<div class="msg botMsg">${WELCOME[lang]}</div>`);
      }
    }

    sendBtn.onclick = e => { e.preventDefault(); sendMessage(); };
    input.onkeydown = e => { if (e.key === "Enter") { e.preventDefault(); sendMessage(); } };

  });

})();
