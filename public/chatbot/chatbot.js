/****************************************************
 * SOLO'IA'TICO — CHATBOT LUXE
 * Version 1.6.6.5 — UI CLEAN FINAL
 * Flow Bateau — Short / Long / Booking / WhatsApp OK
 ****************************************************/

(function () {

  const KB_BASE_URL = "https://solobotatico2026.vercel.app";

  console.log("Solo’IA’tico Chatbot v1.6.6.5");

  document.addEventListener("DOMContentLoaded", async () => {

    /* ================= CSS ================= */
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = `${KB_BASE_URL}/chatbot/chatbot.css`;
    document.head.appendChild(css);

    /* ================= HTML ================= */
    const html = await fetch(`${KB_BASE_URL}/chatbot/chatbot.html`).then(r => r.text());
    document.body.insertAdjacentHTML("beforeend", html);

    /* ================= OPEN / CLOSE ================= */
    const chatWin = document.getElementById("chatWindow");
    const openBtn = document.getElementById("openChatBtn");

    let isOpen = false;
    chatWin.style.display = "none";

    openBtn.addEventListener("click", e => {
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

    /* ================= WHATSAPP ================= */
    const waLaurent = document.getElementById("waLaurent");
    const waSophia  = document.getElementById("waSophia");

    if (waLaurent) {
      waLaurent.addEventListener("click", e => {
        e.preventDefault();
        window.open("https://wa.me/34621210642", "_blank");
      });
    }

    if (waSophia) {
      waSophia.addEventListener("click", e => {
        e.preventDefault();
        window.open("https://wa.me/34621128303", "_blank");
      });
    }

    /* ================= CHAT CORE ================= */
    const sendBtn = document.getElementById("sendBtn");
    const input   = document.getElementById("userInput");
    const bodyEl  = document.getElementById("chatBody");
    const typing  = document.getElementById("typing");

    const TEXT = {
      short: "La Tintorera vous propose des sorties en mer inoubliables ⛵",
      long: "Tintorera est une balade en bateau privée à bord d’un llaut catalan traditionnel. Idéale pour baignades, couchers de soleil, découvertes marines et moments inoubliables sur la Costa Brava.",
      more: "Voir la description complète",
      book: "⛵ Réserver la sortie Tintorera",
      clarify: "Pouvez-vous préciser votre demande ? 😊"
    };

    function normalize(t) {
      return t.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s]/g, "");
    }

    function isBateau(t) {
      return /bateau|tintorera/.test(t);
    }

    function renderBateau() {
      const bot = document.createElement("div");
      bot.className = "msg botMsg";

      /* SHORT */
      const shortDiv = document.createElement("div");
      shortDiv.className = "kbShort";
      shortDiv.innerHTML = `<strong>${TEXT.short}</strong>`;
      bot.appendChild(shortDiv);

      /* LONG (hidden) */
      const longDiv = document.createElement("div");
      longDiv.className = "kbLong";
      longDiv.style.display = "none";
      longDiv.innerHTML = `<p>${TEXT.long}</p>`;
      bot.appendChild(longDiv);

      /* ACTIONS */
      const actions = document.createElement("div");
      actions.className = "kbActions";

      const moreBtn = document.createElement("button");
      moreBtn.className = "kbMoreBtn";
      moreBtn.textContent = TEXT.more;

      moreBtn.addEventListener("click", e => {
        e.stopPropagation();
        longDiv.style.display = "block";
        moreBtn.remove();
        bodyEl.scrollTop = bodyEl.scrollHeight;
      });

      const bookBtn = document.createElement("a");
      bookBtn.href = "https://koalendar.com/e/tintorera";
      bookBtn.target = "_blank";
      bookBtn.className = "kbBookBtn";
      bookBtn.textContent = TEXT.book;

      actions.appendChild(moreBtn);
      actions.appendChild(bookBtn);

      bot.appendChild(actions);

      bodyEl.appendChild(bot);
      bodyEl.scrollTop = bodyEl.scrollHeight;
    }

    async function sendMessage() {
      if (!input.value.trim()) return;

      const raw = input.value.trim();
      input.value = "";

      bodyEl.insertAdjacentHTML("beforeend", `<div class="msg userMsg">${raw}</div>`);
      typing.style.display = "flex";

      const t = normalize(raw);

      if (isBateau(t)) {
        renderBateau();
      } else {
        const bot = document.createElement("div");
        bot.className = "msg botMsg";
        bot.textContent = TEXT.clarify;
        bodyEl.appendChild(bot);
      }

      typing.style.display = "none";
    }

    sendBtn.addEventListener("click", e => {
      e.preventDefault();
      sendMessage();
    });

    input.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
      }
    });

    console.log("✅ v1.6.6.5 READY — UI & ACTIONS OK");
  });

})();
