/****************************************************
 * SOLO'IA'TICO — CHATBOT LUXE
 * Version 1.6.5 — MULTILINGUE CORE
 * FR / EN / ES / NL / CAT
 ****************************************************/

(function () {

  const KB_BASE_URL = "https://solobotatico2026.vercel.app";
  const STORAGE_KEY = "soloia_concierge_v165";

  console.log("Solo’IA’tico Chatbot v1.6.5 — Multilingual Core");

  /****************************************************
   * MEMORY ENGINE
   ****************************************************/
  const memory = (() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch { return {}; }
  })();

  function saveMemory() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
  }

  memory.lang  = memory.lang || null;
  memory.state = memory.state || "INFO_MODE";
  memory.slots = memory.slots || {};
  saveMemory();

  /****************************************************
   * STATES
   ****************************************************/
  const STATES = {
    INFO_MODE: "INFO_MODE",

    BATEAU_DATE: "BATEAU_DATE",
    BATEAU_PEOPLE: "BATEAU_PEOPLE",

    REIKI_DATE: "REIKI_DATE",
    REIKI_PEOPLE: "REIKI_PEOPLE",

    SUITES_DATES: "SUITES_DATES",
    SUITES_PEOPLE: "SUITES_PEOPLE"
  };

  function setState(s) {
    memory.state = s;
    saveMemory();
    console.log("🔁 STATE →", s);
  }

  /****************************************************
   * I18N — SINGLE SOURCE OF TRUTH
   ****************************************************/
  const I18N = {

    /* ===================== FR ===================== */
    fr: {
      bateau: {
        info: "Oui ⛵ Nous proposons des sorties privées à bord de la Tintorera, un llaut catalan traditionnel, idéal pour baignades, couchers de soleil et découvertes marines.",
        askDate: "Avec plaisir ⛵ Pour quelle date souhaitez-vous la sortie en mer ?",
        askPeople: "Parfait 😊 Combien de personnes participeront à la sortie ?",
        summary: (d, p) => `Récapitulatif :\n\n• Sortie bateau Tintorera\n• Date : ${d}\n• Personnes : ${p}`,
        book: "⛵ Réserver la sortie Tintorera"
      },

      reiki: {
        info: "Le Reiki est un soin énergétique japonais favorisant une détente profonde, l’équilibre émotionnel et le bien-être 🌿",
        askDate: "Avec plaisir 🌿 Pour quelle date souhaitez-vous la séance de Reiki ?",
        askPeople: "Parfait 😊 Pour combien de personnes sera la séance ?",
        summary: (d, p) => `Récapitulatif :\n\n• Soin Reiki\n• Date : ${d}\n• Personnes : ${p}`,
        book: "🧘‍♀️ Réserver une séance de Reiki"
      },

      suites: {
        listTitle: "Voici nos hébergements ✨",
        list: [
          "Suite Neus — élégante et lumineuse",
          "Suite Bourlardes — spacieuse et raffinée",
          "Chambre Blue Patio — cosy et intimiste"
        ],
        infoNeus: "La Suite Neus est élégante et lumineuse, idéale pour un séjour paisible à deux.",
        infoBourlardes: "La Suite Bourlardes offre de beaux volumes et un confort haut de gamme.",
        infoBlue: "La Chambre Blue Patio est parfaite pour un séjour cosy et intimiste.",
        askDates: "Quelles dates souhaitez-vous pour votre séjour ?",
        askPeople: "Pour combien de personnes sera le séjour ?",
        summary: (d, p) => `Récapitulatif :\n\n• Séjour à Solo Ático\n• Dates : ${d}\n• Personnes : ${p}`,
        book: "🏨 Vérifier les disponibilités"
      },

      clarify: "Pouvez-vous préciser votre demande ? 😊"
    },

    /* ===================== EN ===================== */
    en: {
      bateau: {
        info: "Yes ⛵ We offer private boat trips aboard Tintorera, a traditional Catalan llaut, perfect for swimming, sunset cruises and coastal discovery.",
        askDate: "With pleasure ⛵ For which date would you like the boat trip?",
        askPeople: "Great 😊 How many people will join the trip?",
        summary: (d, p) => `Summary:\n\n• Tintorera boat trip\n• Date: ${d}\n• People: ${p}`,
        book: "⛵ Book the Tintorera boat trip"
      },

      reiki: {
        info: "Reiki is a Japanese energy healing treatment promoting deep relaxation, emotional balance and well-being 🌿",
        askDate: "With pleasure 🌿 For which date would you like the Reiki session?",
        askPeople: "Great 😊 How many people will attend the session?",
        summary: (d, p) => `Summary:\n\n• Reiki treatment\n• Date: ${d}\n• People: ${p}`,
        book: "🧘‍♀️ Book a Reiki session"
      },

      suites: {
        listTitle: "Our accommodations ✨",
        list: [
          "Suite Neus — elegant and bright",
          "Suite Bourlardes — spacious and refined",
          "Blue Patio Room — cosy and intimate"
        ],
        infoNeus: "Suite Neus is elegant and bright, perfect for a peaceful stay.",
        infoBourlardes: "Suite Bourlardes offers generous space and high-end comfort.",
        infoBlue: "The Blue Patio Room is ideal for a cosy and intimate stay.",
        askDates: "What dates are you considering for your stay?",
        askPeople: "How many people will stay?",
        summary: (d, p) => `Summary:\n\n• Stay at Solo Ático\n• Dates: ${d}\n• People: ${p}`,
        book: "🏨 Check availability"
      },

      clarify: "Could you please clarify your request? 😊"
    },

    /* ===================== ES (haut de gamme) ===================== */
    es: {
      bateau: {
        info: "Sí ⛵ Ofrecemos salidas privadas en barco a bordo de la Tintorera, un llaut catalán tradicional, ideal para baños, puestas de sol y descubrir la Costa Brava.",
        askDate: "Con mucho gusto ⛵ ¿Para qué fecha desea la salida en barco?",
        askPeople: "Perfecto 😊 ¿Para cuántas personas será la salida?",
        summary: (d, p) => `Resumen:\n\n• Salida en barco Tintorera\n• Fecha: ${d}\n• Personas: ${p}`,
        book: "⛵ Reservar la salida Tintorera"
      },

      reiki: {
        info: "El Reiki es un tratamiento energético japonés que favorece la relajación profunda, el equilibrio emocional y el bienestar 🌿",
        askDate: "Con mucho gusto 🌿 ¿Para qué fecha desea la sesión de Reiki?",
        askPeople: "Perfecto 😊 ¿Para cuántas personas será la sesión?",
        summary: (d, p) => `Resumen:\n\n• Tratamiento Reiki\n• Fecha: ${d}\n• Personas: ${p}`,
        book: "🧘‍♀️ Reservar una sesión de Reiki"
      },

      suites: {
        listTitle: "Nuestros alojamientos ✨",
        list: [
          "Suite Neus — elegante y luminosa",
          "Suite Bourlardes — amplia y sofisticada",
          "Habitación Blue Patio — acogedora e íntima"
        ],
        infoNeus: "La Suite Neus es elegante y luminosa, ideal para una estancia tranquila.",
        infoBourlardes: "La Suite Bourlardes ofrece amplitud y confort de alta gama.",
        infoBlue: "La Habitación Blue Patio es perfecta para una estancia acogedora.",
        askDates: "¿Qué fechas desea para su estancia?",
        askPeople: "¿Para cuántas personas será la estancia?",
        summary: (d, p) => `Resumen:\n\n• Estancia en Solo Ático\n• Fechas: ${d}\n• Personas: ${p}`,
        book: "🏨 Comprobar disponibilidad"
      },

      clarify: "¿Podría precisar su solicitud? 😊"
    },

    /* ===================== NL (chaleureux) ===================== */
    nl: {
      bateau: {
        info: "Ja ⛵ Wij bieden privéboottochten aan met de Tintorera, een traditionele Catalaanse llaut, perfect om te zwemmen, van de zonsondergang te genieten en de kust te ontdekken.",
        askDate: "Graag ⛵ Voor welke datum wenst u de boottocht?",
        askPeople: "Prima 😊 Met hoeveel personen komt u?",
        summary: (d, p) => `Overzicht:\n\n• Tintorera boottocht\n• Datum: ${d}\n• Personen: ${p}`,
        book: "⛵ Boottocht reserveren"
      },

      reiki: {
        info: "Reiki is een Japanse energetische behandeling die diepe ontspanning en innerlijk evenwicht bevordert 🌿",
        askDate: "Graag 🌿 Voor welke datum wenst u de Reiki-sessie?",
        askPeople: "Prima 😊 Voor hoeveel personen is de sessie?",
        summary: (d, p) => `Overzicht:\n\n• Reiki behandeling\n• Datum: ${d}\n• Personen: ${p}`,
        book: "🧘‍♀️ Reiki-sessie reserveren"
      },

      suites: {
        listTitle: "Onze accommodaties ✨",
        list: [
          "Suite Neus — elegant en licht",
          "Suite Bourlardes — ruim en verfijnd",
          "Blue Patio Kamer — gezellig en intiem"
        ],
        infoNeus: "Suite Neus is elegant en licht, ideaal voor een rustige vakantie.",
        infoBourlardes: "Suite Bourlardes biedt veel ruimte en hoog comfort.",
        infoBlue: "De Blue Patio Kamer is perfect voor een gezellige en intieme sfeer.",
        askDates: "Welke data wenst u voor uw verblijf?",
        askPeople: "Met hoeveel personen komt u?",
        summary: (d, p) => `Overzicht:\n\n• Verblijf bij Solo Ático\n• Data: ${d}\n• Personen: ${p}`,
        book: "🏨 Beschikbaarheid bekijken"
      },

      clarify: "Kunt u uw vraag verduidelijken? 😊"
    },

    /* ===================== CAT (local) ===================== */
    cat: {
      bateau: {
        info: "Sí ⛵ Oferim sortides privades amb la Tintorera, un llaüt català tradicional, ideals per banyar-se, veure la posta de sol i descobrir la Costa Brava.",
        askDate: "Amb molt de gust ⛵ Per a quina data voldries la sortida en vaixell?",
        askPeople: "Perfecte 😊 Per a quantes persones serà la sortida?",
        summary: (d, p) => `Resum:\n\n• Sortida en vaixell Tintorera\n• Data: ${d}\n• Persones: ${p}`,
        book: "⛵ Reservar la sortida Tintorera"
      },

      reiki: {
        info: "El Reiki és un tractament energètic japonès que afavoreix la relaxació profunda i l’equilibri emocional 🌿",
        askDate: "Amb molt de gust 🌿 Per a quina data voldries la sessió de Reiki?",
        askPeople: "Perfecte 😊 Per a quantes persones serà la sessió?",
        summary: (d, p) => `Resum:\n\n• Tractament Reiki\n• Data: ${d}\n• Persones: ${p}`,
        book: "🧘‍♀️ Reservar una sessió de Reiki"
      },

      suites: {
        listTitle: "Els nostres allotjaments ✨",
        list: [
          "Suite Neus — elegant i lluminosa",
          "Suite Bourlardes — espaiosa i refinada",
          "Habitació Blue Patio — acollidora i íntima"
        ],
        infoNeus: "La Suite Neus és elegant i lluminosa, ideal per a una estada tranquil·la.",
        infoBourlardes: "La Suite Bourlardes ofereix espai i confort d’alta gamma.",
        infoBlue: "L’Habitació Blue Patio és perfecta per a una estada acollidora.",
        askDates: "Quines dates voldries per a la teva estada?",
        askPeople: "Per a quantes persones serà l’estada?",
        summary: (d, p) => `Resum:\n\n• Estada a Solo Ático\n• Dates: ${d}\n• Persones: ${p}`,
        book: "🏨 Comprovar disponibilitat"
      },

      clarify: "Pots precisar una mica més la teva pregunta? 😊"
    }
  };

  /****************************************************
   * LANGUAGE RESOLUTION (LOCKED)
   ****************************************************/
  function getPageLang() {
    return document.documentElement.lang?.split("-")[0] || "fr";
  }

  function resolveLang() {
    return memory.lang || getPageLang() || "fr";
  }

  /****************************************************
   * NLP HELPERS
   ****************************************************/
  function normalize(txt) {
    return txt.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s?]/g, "")
      .trim();
  }

  function isQuestion(txt) { return txt.includes("?"); }
  function isBooking(txt) {
    return /je veux|reserver|book|stay|disponibil|dates|venir/.test(txt);
  }

  function isBateau(txt) { return /bateau|boat|tintorera/.test(txt); }
  function isReiki(txt)  { return /reiki|riki/.test(txt); }
  function isSuites(txt) {
    return /suite|suites|chambre|room|hebergement|estada|stay/.test(txt);
  }

  function isNeus(txt) { return /neus/.test(txt); }
  function isBourlardes(txt) { return /bourlard/.test(txt); }
  function isBlue(txt) { return /blue/.test(txt); }

  /****************************************************
   * DOM READY
   ****************************************************/
  document.addEventListener("DOMContentLoaded", async () => {

    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = `${KB_BASE_URL}/chatbot/chatbot.css`;
    document.head.appendChild(css);

    const html = await fetch(`${KB_BASE_URL}/chatbot/chatbot.html`).then(r => r.text());
    document.body.insertAdjacentHTML("beforeend", html);

    const sendBtn = document.getElementById("sendBtn");
    const input   = document.getElementById("userInput");
    const bodyEl  = document.getElementById("chatBody");
    const typing  = document.getElementById("typing");

    async function sendMessage() {
      if (!input.value.trim()) return;

      const raw = input.value.trim();
      input.value = "";

      bodyEl.insertAdjacentHTML("beforeend", `<div class="msg userMsg">${raw}</div>`);
      typing.style.display = "flex";

      const lang = resolveLang();
      memory.lang = lang;

      const txt = normalize(raw);
      const bot = document.createElement("div");
      bot.className = "msg botMsg";

      try {

        /* ========== INFO BATEAU ========== */
        if (isBateau(txt) && isQuestion(txt) && !isBooking(txt)) {
          bot.textContent = I18N[lang].bateau.info;
        }

        /* ========== BOOK BATEAU ========== */
        else if (isBateau(txt) && isBooking(txt) && memory.state === STATES.INFO_MODE) {
          setState(STATES.BATEAU_DATE);
          bot.textContent = I18N[lang].bateau.askDate;
        }
        else if (memory.state === STATES.BATEAU_DATE) {
          memory.slots.date = raw;
          setState(STATES.BATEAU_PEOPLE);
          bot.textContent = I18N[lang].bateau.askPeople;
        }
        else if (memory.state === STATES.BATEAU_PEOPLE) {
          memory.slots.people = raw;
          bot.textContent = I18N[lang].bateau.summary(memory.slots.date, memory.slots.people);

          const a = document.createElement("a");
          a.className = "kbBookBtn";
          a.href = "https://koalendar.com/e/tintorera";
          a.target = "_blank";
          a.textContent = I18N[lang].bateau.book;

          bot.appendChild(document.createElement("br"));
          bot.appendChild(a);

          memory.slots = {};
          setState(STATES.INFO_MODE);
        }

        /* ========== INFO REIKI ========== */
        else if (isReiki(txt) && isQuestion(txt) && !isBooking(txt)) {
          bot.textContent = I18N[lang].reiki.info;
        }

        /* ========== BOOK REIKI ========== */
        else if (isReiki(txt) && isBooking(txt) && memory.state === STATES.INFO_MODE) {
          setState(STATES.REIKI_DATE);
          bot.textContent = I18N[lang].reiki.askDate;
        }
        else if (memory.state === STATES.REIKI_DATE) {
          memory.slots.date = raw;
          setState(STATES.REIKI_PEOPLE);
          bot.textContent = I18N[lang].reiki.askPeople;
        }
        else if (memory.state === STATES.REIKI_PEOPLE) {
          memory.slots.people = raw;
          bot.textContent = I18N[lang].reiki.summary(memory.slots.date, memory.slots.people);

          const a = document.createElement("a");
          a.className = "kbBookBtn";
          a.href = "https://koalendar.com/e/soloatico-reiki";
          a.target = "_blank";
          a.textContent = I18N[lang].reiki.book;

          bot.appendChild(document.createElement("br"));
          bot.appendChild(a);

          memory.slots = {};
          setState(STATES.INFO_MODE);
        }

        /* ========== SUITES INFO ========== */
        else if (isSuites(txt) && isQuestion(txt) && !isBooking(txt)) {
          bot.innerHTML = `<b>${I18N[lang].suites.listTitle}</b><br><br>`;
          I18N[lang].suites.list.forEach(s => {
            bot.innerHTML += `• ${s}<br>`;
          });
        }

        else if (isNeus(txt)) {
          bot.textContent = I18N[lang].suites.infoNeus;
        }
        else if (isBourlardes(txt)) {
          bot.textContent = I18N[lang].suites.infoBourlardes;
        }
        else if (isBlue(txt)) {
          bot.textContent = I18N[lang].suites.infoBlue;
        }

        /* ========== BOOK SUITES ========== */
        else if (isSuites(txt) && isBooking(txt) && memory.state === STATES.INFO_MODE) {
          setState(STATES.SUITES_DATES);
          bot.textContent = I18N[lang].suites.askDates;
        }
        else if (memory.state === STATES.SUITES_DATES) {
          memory.slots.dates = raw;
          setState(STATES.SUITES_PEOPLE);
          bot.textContent = I18N[lang].suites.askPeople;
        }
        else if (memory.state === STATES.SUITES_PEOPLE) {
          memory.slots.people = raw;
          bot.textContent = I18N[lang].suites.summary(memory.slots.dates, memory.slots.people);

          const a = document.createElement("a");
          a.className = "kbBookBtn";
          a.href = lang === "en"
            ? "https://soloatico.amenitiz.io/en/booking/room"
            : lang === "es"
            ? "https://soloatico.amenitiz.io/es/booking/room"
            : lang === "nl"
            ? "https://soloatico.amenitiz.io/nl/booking/room"
            : lang === "cat"
            ? "https://soloatico.amenitiz.io/ca/booking/room"
            : "https://soloatico.amenitiz.io/fr/booking/room";
          a.target = "_blank";
          a.textContent = I18N[lang].suites.book;

          bot.appendChild(document.createElement("br"));
          bot.appendChild(a);

          memory.slots = {};
          setState(STATES.INFO_MODE);
        }

        /* ========== FALLBACK ========== */
        else {
          bot.textContent = I18N[lang].clarify;
        }

        saveMemory();

      } catch (e) {
        console.error(e);
        bot.textContent = I18N[lang].clarify;
        setState(STATES.INFO_MODE);
      }

      typing.style.display = "none";
      bodyEl.appendChild(bot);
      bodyEl.scrollTop = bodyEl.scrollHeight;
    }

    sendBtn.addEventListener("click", e => {
      e.preventDefault();
      sendMessage();
    });

    input.addEventListener("keydown", e => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    console.log("✅ Multilingual Core v1.6.5 ready");
  });

})();
