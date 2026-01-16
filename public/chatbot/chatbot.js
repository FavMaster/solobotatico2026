/****************************************************
 * SOLO'IA'TICO — CHATBOT LUXE
 * Version 1.6.9.6 — STABLE + SHORT/LONG + BOOKING
 ****************************************************/

(function () {

  const KB_BASE_URL = "https://solobotatico2026.vercel.app";

  console.log("Solo’IA’tico Chatbot v1.6.9.6 — STABLE FULL");

  document.addEventListener("DOMContentLoaded", async () => {

    /* ==================================================
       FIX KB — empêcher la fermeture au clic
       sur "Voir la description complète"
       ================================================== */
    document.addEventListener("click", function (e) {
      if (
        e.target.closest(".readMoreBtn") ||
        e.target.closest(".kbMoreBtn")
      ) {
        e.stopPropagation();
      }
    });

    /* ===== CSS ===== */
    if (!document.getElementById("soloia-css")) {
      const css = document.createElement("link");
      css.id = "soloia-css";
      css.rel = "stylesheet";
      css.href = "https://soloatico.es/bot2026/chatbot.css";
      document.head.appendChild(css);
    }

    /* ===== HTML ===== */
    if (!document.getElementById("openChatBtn")) {
      const container = document.createElement("div");
      container.innerHTML = await (await fetch("https://soloatico.es/bot2026/chatbot.html")).text();
      document.body.appendChild(container);
    }

    const openBtn = document.getElementById("openChatBtn");
    const chatWindow = document.getElementById("chatWindow");
    const sendBtn = document.getElementById("sendBtn");
    const input = document.getElementById("userInput");
    const chatBody = document.getElementById("chatBody");
    const typing = document.getElementById("typing");

    /* ===== OPEN / CLOSE ===== */
    openBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      chatWindow.style.display =
        chatWindow.style.display === "flex" ? "none" : "flex";
    });

    document.addEventListener("click", (e) => {
      if (
        chatWindow.style.display === "flex" &&
        !chatWindow.contains(e.target) &&
        !openBtn.contains(e.target)
      ) {
        chatWindow.style.display = "none";
      }
    });

    chatWindow.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    /* ===== MESSAGE HANDLING ===== */
    async function sendMessage() {
      const text = input.value.trim();
      if (!text) return;

      appendMessage(text, "userMsg");
      input.value = "";

      typing.style.display = "flex";

      setTimeout(async () => {
        const response = await getKBResponse(text);
        typing.style.display = "none";
        appendMessage(response, "botMsg");
      }, 600);
    }

    function appendMessage(content, className) {
      const msg = document.createElement("div");
      msg.className = `msg ${className}`;
      msg.innerHTML = content;
      chatBody.insertBefore(msg, typing);
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    /* ===== KB ===== */
    async function getKBResponse(query) {
      try {
        const res = await fetch(`${KB_BASE_URL}/kb.json`);
        const kb = await res.json();

        const q = query.toLowerCase();
        for (const item of kb) {
          if (item.keywords.some(k => q.includes(k))) {
            return item.short + (item.long ? renderLong(item.long) : "");
          }
        }
        return "Je peux vous renseigner sur nos suites, le bateau Tintorera, le bien-être ou L’Escala 🌊";
      } catch (e) {
        return "Une erreur est survenue. Merci de réessayer.";
      }
    }

    function renderLong(long) {
      return `
        <div class="kbLongWrapper">
          ${long}
        </div>
      `;
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
