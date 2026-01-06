/****************************************************
 * SOLO'IA'TICO — CHATBOT LUXE
 * Version 1.6.9.5 — STABLE RESET
 ****************************************************/

(function () {

  const KB_BASE_URL = "https://solobotatico2026.vercel.app";

  console.log("Solo’IA’tico Chatbot v1.6.9.5 — STABLE RESET");

  document.addEventListener("DOMContentLoaded", async () => {

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
      const html = await fetch(`${KB_BASE_URL}/chatbot/chatbot.html`).then(r => r.text());
      document.body.insertAdjacentHTML("beforeend", html);
    }

    /* ===== DOM ===== */
    const chatWin = document.getElementById("chatWindow");
    const openBtn = document.getElementById("openChatBtn");
    const sendBtn = document.getElementById("sendBtn");
    const input   = document.getElementById("userInput");
    const bodyEl  = document.getElementById("chatBody");

    if (!chatWin || !openBtn || !sendBtn || !input || !bodyEl) {
      console.error("❌ Chatbot DOM incomplet");
      return;
    }

    /* ===== OPEN / CLOSE ===== */
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

    /* ===== WHATSAPP ===== */
    document.getElementById("waLaurent")?.addEventListener("click", e => {
      e.preventDefault(); e.stopPropagation();
      window.open("https://wa.me/34621210642", "_blank");
    });

    document.getElementById("waSophia")?.addEventListener("click", e => {
      e.preventDefault(); e.stopPropagation();
      window.open("https://wa.me/34621128303", "_blank");
    });

    /* ===== LANG ===== */
    function pageLang() {
      return document.documentElement.lang?.slice(0,2) || "fr";
    }

    function detectLang(t) {
      if (/is er|zwembad|boot/.test(t)) return "nl";
      if (/what|how|pool|boat/.test(t)) return "en";
      if (/piscina|barco/.test(t)) return "es";
      if (/piscina|vaixell/.test(t)) return "ca";
      return pageLang();
    }

    /* ===== NLP ===== */
    function norm(t) {
      return t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    function intent(t) {
      if (/tintorera|bateau|boat/.test(t)) return "tintorera";
      if (/reiki|riki/.test(t)) return "reiki";
      if (/piscine|pool|zwembad/.test(t)) return "piscine";
      return null;
    }

    /* ===== KB ===== */
    async function loadKB(lang, file) {
      let r = await fetch(`${KB_BASE_URL}/kb/${lang}/${file}`);
      if (!r.ok && lang !== "fr") {
        r = await fetch(`${KB_BASE_URL}/kb/fr/${file}`);
      }
      if (!r.ok) throw "KB introuvable";
      return r.text();
    }

    function parseKB(txt) {
      return {
        short: (txt.match(/SHORT:\s*([\s\S]*?)\n/i) || [,""])[1],
        long:  (txt.match(/LONG:\s*([\s\S]*)/i) || [,""])[1]
      };
    }

    /* ===== SEND ===== */
    async function sendMessage() {
      if (!input.value.trim()) return;

      const raw = input.value;
      input.value = "";

      bodyEl.insertAdjacentHTML("beforeend",
        `<div class="msg userMsg">${raw}</div>`);

      const t = norm(raw);
      const lang = detectLang(t);
      const i = intent(t);

      try {
        if (!i) {
          bodyEl.insertAdjacentHTML("beforeend",
            `<div class="msg botMsg">🤔 Pouvez-vous préciser votre demande ?</div>`);
          return;
        }

        const file =
          i === "tintorera" ? "03_services/tintorera-bateau.txt" :
          i === "reiki"     ? "03_services/reiki.txt" :
          "03_services/piscine-rooftop.txt";

        const kb = parseKB(await loadKB(lang, file));

        bodyEl.insertAdjacentHTML("beforeend",
          `<div class="msg botMsg">
            <b>${kb.short}</b><br><br>${kb.long}
          </div>`);

      } catch (e) {
        console.error(e);
        bodyEl.insertAdjacentHTML("beforeend",
          `<div class="msg botMsg">❌ Une erreur est survenue.</div>`);
      }

      bodyEl.scrollTop = bodyEl.scrollHeight;
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
