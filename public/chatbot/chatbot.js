/****************************************************
 * SOLO'IA'TICO — CHATBOT LUXE
 * Version 1.6.7.1 — KB OFFICIELLE SOLOÁTICO
 * Respect strict de l’arborescence KB
 ****************************************************/

(function SoloIATico() {

  const KB_BASE_URL = "https://solobotatico2026.vercel.app";

  console.log("Solo’IA’tico Chatbot v1.6.7.1 — KB real paths");

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
      return document.documentElement.lang?.slice(0,2) || "fr";
    }

    /* ================= KB PARSER ================= */
    function parseKB(text) {
      const short = text.match(/SHORT:\s*([\s\S]*?)\n/i);
      const long  = text.match(/LONG:\s*([\s\S]*)/i);

      return {
        short: short ? short[1].trim() : "",
        long:  long  ? long[1].trim()  : ""
      };
    }

    /* ================= NLP ================= */
    function normalize(t) {
      return t.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s]/g, "");
    }

    function isBateau(t) {
      return /bateau|tintorera|boat/.test(t);
    }

    /* ================= RENDER TINTO ================= */
    async function renderTintorera() {
      const lang = detectLang();

      const kbPath =
        `${KB_BASE_URL}/kb/${lang}/03_services/tintorera-bateau.txt`;

      const res = await fetch(kbPath);
      if (!res.ok) throw new Error("KB Tintorera introuvable");

      const kb = parseKB(await res.text());

      const bot = document.createElement("div");
      bot.className = "msg botMsg";

      /* SHORT */
      const shortDiv = document.createElement("div");
      shortDiv.className = "kbShort";
      shortDiv.textContent = kb.short;
      bot.appendChild(shortDiv);

      /* LONG (hidden) */
      const longDiv = document.createElement("div");
      longDiv.className = "kbLong";
      longDiv.style.display = "none";
      longDiv.innerHTML = kb.long.replace(/\n/g, "<br>");
      bot.appendChild(longDiv);

      /* ACTIONS */
      const actions = document.createElement("div");
      actions.className = "kbActions";

      const moreBtn = document.createElement("button");
      moreBtn.className = "kbMoreBtn";
      moreBtn.textContent = "Voir la description complète";

      moreBtn.onclick = e => {
        e.stopPropagation();
        longDiv.style.display = "block";
        moreBtn.remove();
      };

      const bookBtn = document.createElement("a");
      bookBtn.href = "https://koalendar.com/e/tintorera";
      bookBtn.target = "_blank";
      bookBtn.className = "kbBookBtn";
      bookBtn.textContent = "⛵ Réserver la sortie Tintorera";

      actions.appendChild(moreBtn);
      actions.appendChild(bookBtn);
      bot.appendChild(actions);

      bodyEl.appendChild(bot);
      bodyEl.scrollTop = bodyEl.scrollHeight;
    }

    /* ================= SEND ================= */
    async function sendMessage() {
      if (!input.value.trim()) return;

      const raw = input.value.trim();
      input.value = "";

      bodyEl.insertAdjacentHTML("beforeend",
        `<div class="msg userMsg">${raw}</div>`
      );

      typing.style.display = "flex";

      const t = normalize(raw);

      if (isBateau(t)) {
        try {
          await renderTintorera();
        } catch {
          bodyEl.insertAdjacentHTML("beforeend",
            `<div class="msg botMsg">Désolé, les informations du bateau sont momentanément indisponibles.</div>`
          );
        }
      } else {
        bodyEl.insertAdjacentHTML("beforeend",
          `<div class="msg botMsg">Pouvez-vous préciser votre demande ? 😊</div>`
        );
      }

      typing.style.display = "none";
    }

    sendBtn.onclick = e => {
      e.preventDefault();
      sendMessage();
    };

    input.onkeydown = e => {
      if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
      }
    };

    console.log("✅ Solo’IA’tico v1.6.7.1 — KB Soloático OK");
  });

})();
