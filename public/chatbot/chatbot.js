/****************************************************
 * SOLO'IA'TICO — CHATBOT LUXE
 * Version 1.6.6.6 — INIT ROBUSTE
 * Bot toujours visible (no DOMContentLoaded)
 ****************************************************/

(function initSoloIATico() {

  const KB_BASE_URL = "https://solobotatico2026.vercel.app";
  console.log("Solo’IA’tico Chatbot v1.6.6.6 — init");

  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(async function () {

    /* ===== CSS ===== */
    if (!document.getElementById("soloia-css")) {
      const css = document.createElement("link");
      css.id = "soloia-css";
      css.rel = "stylesheet";
      css.href = `${KB_BASE_URL}/chatbot/chatbot.css`;
      document.head.appendChild(css);
    }

    /* ===== HTML ===== */
    if (!document.getElementById("chatWindow")) {
      try {
        const html = await fetch(`${KB_BASE_URL}/chatbot/chatbot.html`).then(r => r.text());
        document.body.insertAdjacentHTML("beforeend", html);
      } catch (e) {
        console.error("❌ Chatbot HTML load failed", e);
        return;
      }
    }

    /* ===== ELEMENTS ===== */
    const chatWin = document.getElementById("chatWindow");
    const openBtn = document.getElementById("openChatBtn");
    const sendBtn = document.getElementById("sendBtn");
    const input   = document.getElementById("userInput");
    const bodyEl  = document.getElementById("chatBody");
    const typing  = document.getElementById("typing");

    if (!chatWin || !openBtn) {
      console.error("❌ Chatbot DOM not found");
      return;
    }

    /* ===== OPEN / CLOSE ===== */
    let isOpen = false;
    chatWin.style.display = "none";

    openBtn.onclick = function (e) {
      e.preventDefault();
      e.stopPropagation();
      isOpen = !isOpen;
      chatWin.style.display = isOpen ? "flex" : "none";
    };

    document.addEventListener("click", function (e) {
      if (isOpen && !chatWin.contains(e.target) && !openBtn.contains(e.target)) {
        chatWin.style.display = "none";
        isOpen = false;
      }
    });

    /* ===== WHATSAPP ===== */
    const waLaurent = document.getElementById("waLaurent");
    const waSophia  = document.getElementById("waSophia");

    if (waLaurent) {
      waLaurent.onclick = e => {
        e.preventDefault();
        window.open("https://wa.me/34621210642", "_blank");
      };
    }

    if (waSophia) {
      waSophia.onclick = e => {
        e.preventDefault();
        window.open("https://wa.me/34621128303", "_blank");
      };
    }

    /* ===== TEXT ===== */
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

      const shortDiv = document.createElement("div");
      shortDiv.innerHTML = `<strong>${TEXT.short}</strong>`;
      bot.appendChild(shortDiv);

      const longDiv = document.createElement("div");
      longDiv.style.display = "none";
      longDiv.innerHTML = `<p>${TEXT.long}</p>`;
      bot.appendChild(longDiv);

      const actions = document.createElement("div");

      const moreBtn = document.createElement("button");
      moreBtn.className = "kbMoreBtn";
      moreBtn.textContent = TEXT.more;
      moreBtn.onclick = e => {
        e.stopPropagation();
        longDiv.style.display = "block";
        moreBtn.remove();
      };

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

    /* ===== SEND ===== */
    function sendMessage() {
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

    console.log("✅ Solo’IA’tico chatbot visible & stable");
  });

})();
