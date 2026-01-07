/****************************************************
 * SOLO'IA'TICO — CHATBOT LUXE
 * Version 1.7.3 — INFOS PRATIQUES SMART & PREMIUM
 ****************************************************/

(function () {

  const KB_BASE_URL = "https://solobotatico2026.vercel.app";

  console.log("Solo’IA’tico Chatbot v1.7.3 — INFOS SMART");

  document.addEventListener("DOMContentLoaded", async () => {

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

    if (!chatWin || !openBtn || !sendBtn || !input || !bodyEl) {
      console.error("❌ Chatbot DOM incomplet");
      return;
    }

    /* ================= OPEN / CLOSE ================= */
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

    /* ================= WHATSAPP ================= */
    const waLaurent = document.getElementById("waLaurent");
    if (waLaurent) {
      waLaurent.addEventListener("click", e => {
        e.preventDefault(); e.stopPropagation();
        window.open("https://wa.me/34621210642", "_blank");
      });
    }

    const waSophia = document.getElementById("waSophia");
    if (waSophia) {
      waSophia.addEventListener("click", e => {
        e.preventDefault(); e.stopPropagation();
        window.open("https://wa.me/34621128303", "_blank");
      });
    }

    /* ================= LANG ================= */
    function pageLang() {
      return document.documentElement.lang?.slice(0,2) || "fr";
    }

    function detectLang(t) {
      if (/is er|ontbijt|informatie|wifi|parking/.test(t)) return "nl";
      if (/check|arrival|wifi|parking|information/.test(t)) return "en";
      if (/informacion|wifi|aparcamiento|check/.test(t)) return "es";
      if (/informacions|wifi|aparcament|check/.test(t)) return "ca";
      return pageLang();
    }

    /* ================= NLP ================= */
    function norm(t) {
      return t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    function intent(t) {

      if (/infos pratiques|information|practical|useful|informatie|informacions/.test(t))
        return "infos_pratiques";

      if (/check in|arrivee|arrival/.test(t)) return "checkin";
      if (/check out|depart|departure/.test(t)) return "checkout";
      if (/parking|garer|aparcamiento|aparcament/.test(t)) return "parking";
      if (/wifi|internet/.test(t)) return "wifi";
      if (/chien|animal|dog|pet/.test(t)) return "animaux";

      if (/suite|chambre|room|kamer|habitacion/.test(t))
        return "suite_list";

      if (/petit dejeuner|breakfast|ontbijt|esmorzar|desayuno/.test(t))
        return "breakfast";

      if (/tintorera|bateau|boat/.test(t)) return "tintorera";
      if (/reiki|riki/.test(t)) return "reiki";
      if (/piscine|pool|zwembad/.test(t)) return "piscine";

      return null;
    }

    /* ================= KB ================= */
    function parseKB(txt) {
      return {
        short: (txt.match(/SHORT:\s*([\s\S]*?)\n/i) || [,""])[1].trim(),
        long:  (txt.match(/LONG:\s*([\s\S]*)/i) || [,""])[1].trim()
      };
    }

    async function loadInfosKB(lang) {
      let r = await fetch(`${KB_BASE_URL}/kb/${lang}/06_infos-pratiques/infos-pratiques.txt`);
      if (!r.ok && lang !== "fr") {
        r = await fetch(`${KB_BASE_URL}/kb/fr/06_infos-pratiques/infos-pratiques.txt`);
      }
      if (!r.ok) throw "KB infos pratiques introuvable";
      return parseKB(await r.text());
    }

    /* ================= UI ================= */
    const UI = {
      fr: {
        more: "Voir toutes les infos pratiques"
      },
      en: {
        more: "View all practical information"
      },
      es: {
        more: "Ver toda la información práctica"
      },
      ca: {
        more: "Veure tota la informació pràctica"
      },
      nl: {
        more: "Alle praktische informatie bekijken"
      }
    };

    /* ================= FORMAT LONG ================= */
    function formatLong(txt) {
      return txt
        .split("\n")
        .filter(l => l.trim())
        .map(l => `• ${l}`)
        .join("<br>");
    }

    /* ================= SEND ================= */
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

        /* ===== INFOS PRATIQUES SMART ===== */
        if (["infos_pratiques","checkin","checkout","parking","wifi","animaux"].includes(i)) {

          const kb = await loadInfosKB(lang);
          const bot = document.createElement("div");
          bot.className = "msg botMsg";

          let intro = kb.short;

          if (i === "checkin") intro = "⏰ " + kb.short;
          if (i === "checkout") intro = "🕘 " + kb.short;
          if (i === "parking") intro = "🅿️ " + kb.short;
          if (i === "wifi") intro = "📶 " + kb.short;
          if (i === "animaux") intro = "🐶 " + kb.short;

          bot.innerHTML = `<b>${intro}</b>`;

          const more = document.createElement("button");
          more.className = "kbMoreBtn";
          more.textContent = UI[lang].more;

          more.onclick = e => {
            e.preventDefault();
            e.stopPropagation();
            more.remove();
            bot.innerHTML += `<br><br>${formatLong(kb.long)}`;
            bodyEl.scrollTop = bodyEl.scrollHeight;
          };

          bot.appendChild(document.createElement("br"));
          bot.appendChild(more);

          bodyEl.appendChild(bot);
          bodyEl.scrollTop = bodyEl.scrollHeight;
          return;
        }

        bodyEl.insertAdjacentHTML("beforeend",
          `<div class="msg botMsg">🤔 Pouvez-vous préciser votre demande ?</div>`);

      } catch (e) {
        console.error(e);
        bodyEl.insertAdjacentHTML("beforeend",
          `<div class="msg botMsg">❌ Une erreur est survenue.</div>`);
      }
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
