/****************************************************
 * SOLO'IA'TICO — CHATBOT LUXE
 * Version 1.7.26 — CORE RESTORED (NO REGRESSION)
 ****************************************************/

(function () {

  const KB_BASE_URL = "https://solobotatico2026.vercel.app";

  const WEATHER_URL =
    "https://marine.meteoconsult.fr/meteo-marine/bulletin-detaille/spot-perso-644139/previsions-meteo-soloatico-es-solo-atico-guest-suites-aujourdhui";

  const BOOKING_URLS = {
    fr: "https://soloatico.amenitiz.io/fr/booking/room#DatesGuests-BE",
    es: "https://soloatico.amenitiz.io/es/booking/room#DatesGuests-BE",
    nl: "https://soloatico.amenitiz.io/nl/booking/room#DatesGuests-BE",
    ca: "https://soloatico.amenitiz.io/ca/booking/room#DatesGuests-BE",
    en: "https://soloatico.amenitiz.io/en/booking/room#DatesGuests-BE"
  };

  const SERVICE_BOOKING = {
    boat: "https://koalendar.com/e/tintorera",
    reiki: "https://koalendar.com/e/soloatico-reiki"
  };

  const BOOKING_INTRO = {
    fr: "✅ **Oui, bien sûr 🙂 Vous pouvez réserver dès maintenant.**",
    en: "✅ **Yes, of course 🙂 You can book right now.**",
    es: "✅ **Sí, por supuesto 🙂 Puedes reservar ahora mismo.**",
    ca: "✅ **Sí, és clar 🙂 Pots reservar ara mateix.**",
    nl: "✅ **Ja, natuurlijk 🙂 Je kunt nu reserveren.**"
  };

  const WEATHER_TEXT = {
    fr: "🌤️ **Voici les prévisions météo à L’Escala :**",
    en: "🌤️ **Here is the weather forecast for L’Escala:**",
    es: "🌤️ **Aquí tienes la previsión del tiempo en L’Escala:**",
    ca: "🌤️ **Aquí tens la previsió del temps a L’Escala:**",
    nl: "🌤️ **Hier is de weersvoorspelling voor L’Escala:**"
  };

  /* ===== FALLBACK SÉCURISÉ ===== */
  const FALLBACK = {
    fr: "✨ Excellente question 🙂 Vous pouvez contacter Sophia ou Laurent via WhatsApp.",
    en: "✨ Great question 🙂 You can contact Sophia or Laurent via WhatsApp.",
    es: "✨ Excelente pregunta 🙂 Puedes contactar con Sophia o Laurent por WhatsApp.",
    ca: "✨ Bona pregunta 🙂 Pots contactar amb la Sophia o en Laurent via WhatsApp.",
    nl: "✨ Goede vraag 🙂 Je kunt contact opnemen met Sophia of Laurent via WhatsApp."
  };

  console.log("Solo’IA’tico Chatbot v1.7.26 — Core restored");

  document.addEventListener("DOMContentLoaded", async () => {

    /* ===== CSS / HTML ===== */
    if (!document.getElementById("soloia-css")) {
      const css = document.createElement("link");
      css.id = "soloia-css";
      css.rel = "stylesheet";
      css.href = `${KB_BASE_URL}/chatbot/chatbot.css`;
      document.head.appendChild(css);
    }

    if (!document.getElementById("chatWindow")) {
      const html = await fetch(`${KB_BASE_URL}/chatbot/chatbot.html`).then(r => r.text());
      document.body.insertAdjacentHTML("beforeend", html);
    }

    const chatWin = document.getElementById("chatWindow");
    const openBtn = document.getElementById("openChatBtn");
    const sendBtn = document.getElementById("sendBtn");
    const input   = document.getElementById("userInput");
    const bodyEl  = document.getElementById("chatBody");

    if (!chatWin || !openBtn || !sendBtn || !input || !bodyEl) return;

    /* ===== OPEN / CLOSE ===== */
    let isOpen = false;
    chatWin.style.display = "none";

    openBtn.addEventListener("click", e => {
      e.preventDefault(); e.stopPropagation();
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

    /* ===== NORMALISATION ===== */
    function normalize(text) {
      return text.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z\s]/g, "");
    }

    function wantsToBook(text) {
      return /(reserv|book|pued|puis|kan ik|can i)/.test(normalize(text));
    }

    /* ===== LANG ===== */
    function pageLang() {
      const l = document.documentElement.lang?.slice(0,2);
      return ["fr","en","es","ca","nl"].includes(l) ? l : "fr";
    }

    function detectLang(text) {
      const t = normalize(text);
      if (/\b(hello|what|where)\b/.test(t)) return "en";
      if (/\b(que hacer)\b/.test(t)) return "es";
      if (/\b(que fer)\b/.test(t)) return "ca";
      if (/\b(wat te doen)\b/.test(t)) return "nl";
      return pageLang();
    }

    function kbLang(lang) {
      return lang === "ca" ? "cat" : lang;
    }

    /* ===== INTENTS ===== */
    const GREETINGS = ["bonjour","bonsoir","salut","hello","hola","bon dia"];

    const SUITES_BY_NAME = {
      neus: "02_suites/suite-neus.txt",
      bourlardes: "02_suites/suite-bourlardes.txt",
      blue: "02_suites/room-blue-patio.txt",
      patio: "02_suites/room-blue-patio.txt"
    };

    const FUZZY = {
      presentation: [
        "presentation","hotel","etablissement","soloatico","solo atico",
        "votre hotel","plage"
      ],
      rooms: ["suite","suites","chambre","room"],
      boat: ["bateau","boat","tintorera"],
      reiki: ["reiki"],
      pool: ["piscine","pool"],
      activities: ["que faire","things to do"],
      weather: ["meteo","météo","weather"]
    };

    function intent(text) {
      const t = normalize(text);
      for (const s in SUITES_BY_NAME) {
        if (t.includes(s)) return "suite_named";
      }
      if (GREETINGS.some(g => t.includes(g))) return "greeting";
      for (const k in FUZZY) {
        if (FUZZY[k].some(w => t.includes(w))) return k;
      }
      return "unknown";
    }

    /* ===== ROOMS META ===== */
    const ROOM_META = {
      "02_suites/suite-neus.txt": { vue_mer:true },
      "02_suites/suite-bourlardes.txt": { vue_mer:true },
      "02_suites/room-blue-patio.txt": { vue_mer:false }
    };

    function extractRoomCriteria(text) {
      return { vue_mer: /(vue mer|sea view)/.test(normalize(text)) };
    }

    /* ===== KB ===== */
    async function loadKB(lang, path) {
      let r = await fetch(`${KB_BASE_URL}/kb/${kbLang(lang)}/${path}`);
      if (!r.ok) r = await fetch(`${KB_BASE_URL}/kb/fr/${path}`);
      return r.text();
    }

    function parseKB(txt) {
      return {
        short: (txt.match(/SHORT:\s*([\s\S]*?)\n/i)||["",""])[1].trim(),
        long:  (txt.match(/LONG:\s*([\s\S]*)/i)||["",""])[1].trim()
      };
    }

    function renderLong(bot, text) {
      text.split("\n").forEach(l=>{
        l=l.trim(); if(!l)return;
        const p=document.createElement("div");
        p.className="kbLongParagraph";
        p.textContent=l;
        bot.appendChild(p);
      });
    }

    /* ===== SEND ===== */
    async function sendMessage() {
      if (!input.value.trim()) return;
      const raw = input.value;
      input.value="";
      bodyEl.insertAdjacentHTML("beforeend",`<div class="msg userMsg">${raw}</div>`);

      const lang = detectLang(raw);
      const i = intent(raw);

      if (i==="greeting") {
        bodyEl.insertAdjacentHTML("beforeend",`<div class="msg botMsg">👋</div>`);
        return;
      }

      if (i==="weather") {
        bodyEl.insertAdjacentHTML("beforeend",
          `<div class="msg botMsg">${WEATHER_TEXT[lang]}<br>
           <a class="kbBookBtn" href="${WEATHER_URL}" target="_blank">🌦️</a></div>`);
        return;
      }

      let files=[];

      if (i==="suite_named") {
        for (const k in SUITES_BY_NAME) {
          if (normalize(raw).includes(k)) files=[SUITES_BY_NAME[k]];
        }
      }

      if (i==="rooms") {
        files=Object.keys(ROOM_META);
        if (extractRoomCriteria(raw).vue_mer)
          files=files.filter(f=>ROOM_META[f].vue_mer);
      }

      if (i==="presentation") files=["01_presentation/presentation-generale.txt"];
      if (i==="boat") files=["03_services/tintorera-bateau.txt"];
      if (i==="reiki") files=["03_services/reiki.txt"];
      if (i==="pool") files=["03_services/piscine-rooftop.txt"];
      if (i==="activities") files=["04_que-faire/que-faire-escala.txt"];

      if (!files.length) {
        bodyEl.insertAdjacentHTML("beforeend",`<div class="msg botMsg">${FALLBACK[lang]}</div>`);
        return;
      }

      for (const f of files) {
        const kb=parseKB(await loadKB(lang,f));
        const bot=document.createElement("div");
        bot.className="msg botMsg";

        if (wantsToBook(raw))
          bot.insertAdjacentHTML("beforeend",`<div>${BOOKING_INTRO[lang]}</div>`);

        bot.insertAdjacentHTML("beforeend",`<div>${kb.short}</div>`);

        if (kb.long) {
          const btn=document.createElement("button");
          btn.className="kbMoreBtn";
          btn.textContent="➕";
          btn.onclick=()=>{btn.remove();renderLong(bot,kb.long);};
          bot.appendChild(btn);
        }

        if (["rooms","boat","reiki"].includes(i)) {
          const a=document.createElement("a");
          a.href=i==="rooms"?BOOKING_URLS[lang]:SERVICE_BOOKING[i];
          a.target="_blank";
          a.className="kbBookBtn";
          a.textContent="🛎️";
          bot.appendChild(a);
        }

        bodyEl.appendChild(bot);
      }

      bodyEl.scrollTop=bodyEl.scrollHeight;
    }

    sendBtn.addEventListener("click",sendMessage);
    input.addEventListener("keydown",e=>{
      if(e.key==="Enter"){e.preventDefault();sendMessage();}
    });

  });

})();
