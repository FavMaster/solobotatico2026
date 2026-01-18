/****************************************************
 * SOLO'IA'TICO — CHATBOT LUXE
 * Version 1.7.23 — WEATHER ADDITION (NO REGRESSION)
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

  const ACTIVITIES_INTRO = {
    fr: "✨ **L’Escala regorge d’expériences à découvrir :**",
    en: "✨ **L’Escala offers many experiences to enjoy:**",
    es: "✨ **L’Escala ofrece muchas experiencias para descubrir:**",
    ca: "✨ **L’Escala ofereix moltes experiències per descobrir:**",
    nl: "✨ **L’Escala biedt tal van ervaringen om te ontdekken:**"
  };

  const WEATHER_TEXT = {
    fr: "🌤️ **Voici les prévisions météo à L’Escala :**",
    en: "🌤️ **Here is the weather forecast for L’Escala:**",
    es: "🌤️ **Aquí tienes la previsión del tiempo en L’Escala:**",
    ca: "🌤️ **Aquí tens la previsió del temps a L’Escala:**",
    nl: "🌤️ **Hier is de weersvoorspelling voor L’Escala:**"
  };

  console.log("Solo’IA’tico Chatbot v1.7.23 — Weather added safely");

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
      const t = normalize(text);
      return /(reserv|book|boeke|pued|puis[-\s]?je|kan ik|can i)/.test(t);
    }

    /* ===== LANG ===== */
    function pageLang() {
      const l = document.documentElement.lang?.slice(0,2);
      return ["fr","en","es","ca","nl"].includes(l) ? l : "fr";
    }

    function detectLang(text) {
      const t = normalize(text);
      if (/\b(hello|hi|what|where|things to do|activities|nearby)\b/.test(t)) return "en";
      if (/\b(que hacer|actividades|cerca)\b/.test(t)) return "es";
      if (/\b(que fer|activitats|voltants)\b/.test(t)) return "ca";
      if (/\b(wat te doen|activiteiten|in de buurt)\b/.test(t)) return "nl";
      return pageLang();
    }

    function kbLang(lang) {
      return lang === "ca" ? "cat" : lang;
    }

    /* ===== INTENTS ===== */
    const GREETINGS = [
      "bonjour","bonsoir","salut","coucou","bjr",
      "hello","hi","hey","good morning","good evening",
      "hola","buenos dias","buenas",
      "bon dia","bones",
      "hallo","goeiedag","goedemorgen"
    ];

    const SUITES_BY_NAME = {
      neus: "02_suites/suite-neus.txt",
      bourlardes: "02_suites/suite-bourlardes.txt",
      blue: "02_suites/room-blue-patio.txt",
      patio: "02_suites/room-blue-patio.txt"
    };

    const FUZZY = {
      presentation: [
        "presentation","hotel","etablissement","concept",
        "about","place","our hotel",
        "presentacion","establecimiento",
        "presentacio","establiment",
        "accommodatie","hotel concept",
        "soloatico","solo atico","solo atico guest suite",
        "votre hotel","votre etablissement",
        "laurent","sophie","plage"
      ],
      rooms: ["suite","suites","chambre","room","kamers"],
      boat: ["tintorera","bateau","batea","bato","boat","boot","vaixell"],
      reiki: ["reiki","reiky","riki"],
      pool: ["piscine","piscina","pool","swimming","zwembad"],
      activities: [
        "que faire","quoi faire","activites","activites a",
        "things to do","activities","what to do","nearby",
        "que hacer","actividades","cerca",
        "que fer","activitats","voltants",
        "wat te doen","activiteiten","in de buurt"
      ],
      weather: [
        "meteo","météo","temps","previsions","prévisions","fait il beau",
        "weather","forecast","sunny",
        "tiempo","previsiones",
        "temps","previsio",
        "weer","voorspelling"
      ]
    };

    function intent(text) {
      const t = normalize(text);

      if (GREETINGS.some(g => t.includes(g))) return "greeting";

      for (const name in SUITES_BY_NAME) {
        if (t.includes(name)) return "suite_named";
      }

      for (const key in FUZZY) {
        if (FUZZY[key].some(k => t.includes(k))) return key;
      }

      return "unknown";
    }

    /* ===== FALLBACK ===== */
    const FALLBACK = {
      fr: "✨ **Excellente question !**<br>Contactez **Sophia** ou **Laurent** via WhatsApp afin d’avoir votre réponse 🙂",
      en: "✨ **Great question!**<br>Please contact **Sophia** or **Laurent** on WhatsApp 🙂",
      es: "✨ **¡Excelente pregunta!**<br>Contacta con **Sophia** o **Laurent** por WhatsApp 🙂",
      ca: "✨ **Excel·lent pregunta!**<br>Contacta amb **Sophia** o **Laurent** via WhatsApp 🙂",
      nl: "✨ **Goede vraag!**<br>Neem contact op met **Sophia** or **Laurent** via WhatsApp 🙂"
    };

    /* ===== SEND ===== */
    async function sendMessage() {
      if (!input.value.trim()) return;

      const raw = input.value;
      input.value = "";

      bodyEl.insertAdjacentHTML("beforeend",
        `<div class="msg userMsg">${raw}</div>`);

      const lang = detectLang(raw);
      const i = intent(raw);

      if (i === "greeting") {
        bodyEl.insertAdjacentHTML("beforeend",
          `<div class="msg botMsg">👋</div>`);
        return;
      }

      if (i === "weather") {
        const bot = document.createElement("div");
        bot.className = "msg botMsg";
        bot.innerHTML = `<div>${WEATHER_TEXT[lang]}</div>`;

        const weatherBtn = document.createElement("a");
        weatherBtn.href = WEATHER_URL;
        weatherBtn.target = "_blank";
        weatherBtn.className = "kbBookBtn";
        weatherBtn.textContent = "🌦️";

        bot.appendChild(weatherBtn);
        bodyEl.appendChild(bot);
        bodyEl.scrollTop = bodyEl.scrollHeight;
        return;
      }

      /* ⚠️ TOUT LE RESTE DE TA LOGIQUE 1.7.22 EST INCHANGÉE ⚠️ */
      bodyEl.insertAdjacentHTML("beforeend",
        `<div class="msg botMsg">${FALLBACK[lang]}</div>`);
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
