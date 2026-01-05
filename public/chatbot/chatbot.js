/****************************************************
 * SOLO'IA'TICO — CHATBOT LUXE
 * Version 1.5.1 STABLE — SAFE LOCKED
 * Multilingue + KB + Intentions
 ****************************************************/

(function () {

  console.log("Solo’IA’tico Chatbot v1.5.1 — Initialisation");

  const KB_BASE_URL = "https://solobotatico2026.vercel.app";

  /****************************************************
   * CSS
   ****************************************************/
  function loadCSS() {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `${KB_BASE_URL}/chatbot/chatbot.css`;
    document.head.appendChild(link);
  }

  /****************************************************
   * HTML
   ****************************************************/
  async function loadHTML() {
    const res = await fetch(`${KB_BASE_URL}/chatbot/chatbot.html`);
    return await res.text();
  }

  /****************************************************
   * Langue
   ****************************************************/
  function detectLanguage(message = "") {
    const text = message.toLowerCase();

    if (/\b(is er|zwembad|kamer|kamers|boot|eten)\b/.test(text)) return "nl";
    if (/\b(what|room|rooms|pool|boat|breakfast)\b/.test(text)) return "en";
    if (/\b(el|la|los|las|qué|hacer|piscina)\b/.test(text)) return "es";
    if (/\b(què|fer|habitació|piscina)\b/.test(text)) return "cat";

    const htmlLang = document.documentElement.lang;
    if (htmlLang) return htmlLang.split("-")[0];

    return "fr";
  }

  /****************************************************
   * Intentions
   ****************************************************/
  function detectIntent(message) {
    const t = message.toLowerCase();

    if (["suite","suites","room","kamers","habitacion"].some(w => t.includes(w)))
      return "list_suites";

    if (["help","aide","ayuda","que faire","what do"].some(w => t.includes(w)))
      return "help";

    return "specific";
  }

  /****************************************************
   * Topic
   ****************************************************/
  function detectTopic(message) {
    const t = message.toLowerCase();

    if (["neus","bourlard","suite","room","kamer"].some(w => t.includes(w)))
      return "suite";

    if (["bateau","tintorera","boat","boot"].some(w => t.includes(w)))
      return "bateau";

    if (["reiki","massage"].some(w => t.includes(w)))
      return "reiki";

    if (["piscine","pool","zwembad"].some(w => t.includes(w)))
      return "piscine";

    if (["petit","breakfast","ontbijt"].some(w => t.includes(w)))
      return "petitdej";

    if (["escala","what to do","wat te doen"].some(w => t.includes(w)))
      return "escale";

    return "default";
  }

  /****************************************************
   * KB Router
   ****************************************************/
  function resolveKBPath(message, lang) {
    const t = message.toLowerCase();

    if (t.includes("neus"))
      return `${KB_BASE_URL}/kb/${lang}/02_suites/suite-neus.txt`;

    if (t.includes("bourlard"))
      return `${KB_BASE_URL}/kb/${lang}/02_suites/suite-bourlardes.txt`;

    if (t.includes("blue"))
      return `${KB_BASE_URL}/kb/${lang}/02_suites/suite-blue-patio.txt`;

    if (["bateau","tintorera","boat","boot"].some(w => t.includes(w)))
      return `${KB_BASE_URL}/kb/${lang}/03_services/tintorera-bateau.txt`;

    if (t.includes("reiki"))
      return `${KB_BASE_URL}/kb/${lang}/03_services/reiki.txt`;

    if (["piscine","pool","zwembad"].some(w => t.includes(w)))
      return `${KB_BASE_URL}/kb/${lang}/03_services/piscine-rooftop.txt`;

    if (["petit","breakfast","ontbijt"].some(w => t.includes(w)))
      return `${KB_BASE_URL}/kb/${lang}/03_services/petit-dejeuner.txt`;

    if (["escala","what to do","wat te doen"].some(w => t.includes(w)))
      return `${KB_BASE_URL}/kb/${lang}/04_que-faire/que-faire-escala.txt`;

    return null;
  }

  /****************************************************
   * INIT CHATBOT
   ****************************************************/
  async function initChatbot() {
    loadCSS();
    document.body.insertAdjacentHTML("beforeend", await loadHTML());
    await new Promise(requestAnimationFrame);

    const chatWin = document.getElementById("chatWindow");
    const openBtn = document.getElementById("openChatBtn");
    const sendBtn = document.getElementById("sendBtn");
    const input   = document.getElementById("userInput");
    const bodyEl  = document.getElementById("chatBody");
    const typing  = document.getElementById("typing");

    let isOpen = false;
    chatWin.style.display = "none";

    openBtn.onclick = (e) => {
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

    /****************************************************
     * SEND MESSAGE — SAFE BINDING
     ****************************************************/
    async function sendMessage() {
      if (!input.value.trim()) return;

      const userText = input.value.trim();
      input.value = "";

      const userBubble = document.createElement("div");
      userBubble.className = "msg userMsg";
      userBubble.textContent = userText;
      bodyEl.appendChild(userBubble);
      bodyEl.scrollTop = bodyEl.scrollHeight;

      typing.style.display = "flex";

      const lang  = detectLanguage(userText);
      const intent = detectIntent(userText);
      const topic = detectTopic(userText);
      const kbPath = resolveKBPath(userText, lang);

      const bot = document.createElement("div");
      bot.className = "msg botMsg";

      try {

        if (intent === "help") {
          bot.textContent = "Je peux vous renseigner sur nos suites, services, bateau Tintorera ou activités 😊";
        }

        else if (intent === "list_suites") {
          bot.innerHTML = `
            <b>Nous proposons trois hébergements ✨</b><br><br>
            • Suite Neus<br>
            • Suite Bourlardes<br>
            • Chambre Blue Patio
          `;
        }

        else {
          bot.innerHTML = `<b>${topic}</b><br><br>`;

          if (!kbPath) {
            bot.innerHTML += "Pouvez-vous préciser votre demande ? 😊";
          } else {
            let res = await fetch(kbPath);
            if (!res.ok && lang !== "fr") {
              res = await fetch(kbPath.replace(`/kb/${lang}/`, `/kb/fr/`));
            }
            if (!res.ok) throw new Error("KB introuvable");

            const text = await res.text();
            bot.innerHTML += text.split("\n")[0];
          }
        }

      } catch (err) {
        console.error(err);
        bot.textContent = "Pouvez-vous préciser votre demande ? 😊";
      }

      typing.style.display = "none";
      bodyEl.appendChild(bot);
      bodyEl.scrollTop = bodyEl.scrollHeight;
    }

    /****************************************************
     * EVENTS — BOUTON + ENTER
     ****************************************************/
    sendBtn.addEventListener("click", (e) => {
      e.preventDefault();
      sendMessage();
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }

  initChatbot();

})();
