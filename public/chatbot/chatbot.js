/****************************************************
 * SOLO'IA'TICO — CHATBOT LUXE
 * Version 1.6.7.5 — PISCINE + MULTILINGUE
 ****************************************************/

(function SoloIATico() {

  const KB_BASE_URL = "https://solobotatico2026.vercel.app";
  console.log("Solo’IA’tico Chatbot v1.6.7.5 — Piscine OK");

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
    const typing  = document.getElementById("typing");

    /* ================= OPEN / CLOSE ================= */
    let isOpen = false;
    chatWin.style.display = "none";

    openBtn.onclick = e => {
      e.preventDefault();
      e.stopPropagation();
      isOpen = !isOpen;
      chatWin.style.display = isOpen ? "flex" : "none";
    };

    document.addEventListener("click", e => {
      if (isOpen && !chatWin.contains(e.target) && !openBtn.contains(e.target)) {
        chatWin.style.display = "none";
        isOpen = false;
      }
    });

    /* ================= WHATSAPP ================= */
    const waLaurent = document.getElementById("waLaurent");
    const waSophia  = document.getElementById("waSophia");

    if (waLaurent) waLaurent.onclick = () =>
      window.open("https://wa.me/34621210642", "_blank");

    if (waSophia) waSophia.onclick = () =>
      window.open("https://wa.me/34621128303", "_blank");

    /* ================= LANG ================= */
    function detectLang() {
      const l = document.documentElement.lang?.slice(0,2);
      return ["fr","es","en","ca","nl"].includes(l) ? l : "fr";
    }

    /* ================= UI TEXT ================= */
    const UI = {
      fr: { more: "Voir la description complète", clarify: "Pouvez-vous préciser votre demande ? 😊" },
      es: { more: "Ver la descripción completa", clarify: "¿Podría precisar su solicitud? 😊" },
      en: { more: "View full description", clarify: "Could you please clarify your request? 😊" },
      ca: { more: "Veure la descripció completa", clarify: "Podeu precisar la vostra sol·licitud? 😊" },
      nl: { more: "Volledige beschrijving bekijken", clarify: "Kunt u uw vraag verduidelijken? 😊" }
    };

    /* ================= KB ================= */
    function parseKB(text) {
      const short = text.match(/SHORT:\s*([\s\S]*?)\n/i);
      const long  = text.match(/LONG:\s*([\s\S]*)/i);
      return {
        short: short ? short[1].trim() : "",
        long:  long  ? long[1].trim()  : ""
      };
    }

    async function loadKB(lang, path) {
      let res = await fetch(`${KB_BASE_URL}/kb/${lang}/${path}`);
      if (!res.ok && lang !== "fr") {
        res = await fetch(`${KB_BASE_URL}/kb/fr/${path}`);
      }
      if (!res.ok) throw new Error("KB introuvable");
      return parseKB(await res.text());
    }

    /* ================= NLP ================= */
    function normalize(t) {
      return t.toLowerCase().normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s]/g, "");
    }

    function isPiscine(t) {
      return /piscine|piscina|pool|zwembad|rooftop/.test(t);
    }

    /* ================= RENDER ================= */
    function renderKBBlock(lang, kb) {
      const bot = document.createElement("div");
      bot.className = "msg botMsg";

      const shortDiv = document.createElement("div");
      shortDiv.className = "kbShort";
      shortDiv.textContent = kb.short;
      bot.appendChild(shortDiv);

      const longDiv = document.createElement("div");
      longDiv.className = "kbLong";
      longDiv.style.display = "none";
      longDiv.innerHTML = kb.long.replace(/\n/g, "<br>");
      bot.appendChild(longDiv);

      const moreBtn = document.createElement("button");
      moreBtn.className = "kbMoreBtn";
      moreBtn.textContent = UI[lang].more;

      moreBtn.onclick = () => {
        longDiv.style.display = "block";
        moreBtn.remove();
      };

      bot.appendChild(moreBtn);
      bodyEl.appendChild(bot);
      bodyEl.scrollTop = bodyEl.scrollHeight;
    }

    /* ================= SEND ================= */
    async function sendMessage() {
      if (!input.value.trim()) return;

      const raw = input.value.trim();
      input.value = "";
      bodyEl.insertAdjacentHTML("beforeend", `<div class="msg userMsg">${raw}</div>`);

      typing.style.display = "flex";
      const t = normalize(raw);
      const lang = detectLang();

      try {
        if (isPiscine(t)) {
          const kb = await loadKB(lang, "03_services/piscine-rooftop.txt");
          renderKBBlock(lang, kb);
        } else {
          bodyEl.insertAdjacentHTML("beforeend",
            `<div class="msg botMsg">${UI[lang].clarify}</div>`);
        }
      } catch {
        bodyEl.insertAdjacentHTML("beforeend",
          `<div class="msg botMsg">${UI[lang].clarify}</div>`);
      }

      typing.style.display = "none";
    }

    sendBtn.onclick = e => { e.preventDefault(); sendMessage(); };
    input.onkeydown = e => { if (e.key === "Enter") { e.preventDefault(); sendMessage(); } };

    console.log("✅ Solo’IA’tico v1.6.7.5 — Piscine multilingue OK");
  });

})();
