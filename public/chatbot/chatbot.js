/* =========================================================
   SOLO'IA'TICO — CHATBOT LUXE
   Debug version — DOM SAFE + UX SAFE
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  /* -----------------------------
     CONFIG
  ----------------------------- */
  const KB_BASE = "/kb";
  const LANGS = ["fr", "en", "es", "ca", "nl"];
  let currentLang = "fr";
  const CONCIERGE_AI_ENABLED = true;

  /* -----------------------------
     DOM (SAFE)
  ----------------------------- */
  const openBtn  = document.getElementById("openChatBtn");
  const chatWin  = document.getElementById("chatWindow");
  const chatBody = document.getElementById("chatBody");
  const input    = document.getElementById("userInput");
  const sendBtn  = document.getElementById("sendBtn");
  const typingEl = document.getElementById("typing");

  if (!openBtn || !chatWin || !chatBody || !input || !sendBtn) {
    console.error("Chatbot DOM incomplete – chatbot not initialized");
    return;
  }

  /* -----------------------------
     UI
  ----------------------------- */
  openBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    chatWin.style.display =
      chatWin.style.display === "flex" ? "none" : "flex";
  });

  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") sendMessage();
  });

  function addMsg(html, cls = "botMsg") {
    const d = document.createElement("div");
    d.className = `msg ${cls}`;
    d.innerHTML = html;
    chatBody.appendChild(d);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function typing(show) {
    if (typingEl) typingEl.style.display = show ? "flex" : "none";
  }

  /* -----------------------------
     UTILS
  ----------------------------- */
  const norm = s => (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  function detectLang(text) {
    if (/què|activitats|habitació/.test(text)) return "ca";
    if (/que hacer|habitacion/.test(text)) return "es";
    if (/wat te doen|kamer/.test(text)) return "nl";
    if (/what to do|room/.test(text)) return "en";
    return currentLang;
  }

  /* -----------------------------
     CONCIERGE (SAFE IA)
  ----------------------------- */
  function concierge(text) {
    if (!CONCIERGE_AI_ENABLED) return text;
    return `<b>Avec plaisir.</b><br>${text}<br><i>Je suis là si besoin.</i>`;
  }

  /* -----------------------------
     SUITES — INTENT N°1
  ----------------------------- */
  const SUITE_KEYS = [
    "suite","chambre","logement","hotel","dorm","nuit",
    "séjour","reser","prix","room","habitacion","kamer"
  ];

  function isSuiteIntent(msg) {
    if (msg.length < 5) return true;
    return SUITE_KEYS.some(k => msg.includes(k));
  }

  async function loadKB(path) {
    const res = await fetch(`${KB_BASE}/${currentLang}/${path}.txt`);
    if (!res.ok) throw new Error("KB missing");
    return res.text();
  }

  function parseKB(t) {
    return {
      short: (t.split("SHORT:")[1] || "").split("LONG:")[0].trim(),
      long: (t.split("LONG:")[1] || "").trim()
    };
  }

  async function showSuites() {
    addMsg(concierge(`
      <b>🏨 Nos suites</b>
      <ul class="luxList">
        <li><button class="kbBookBtn" data-suite="suite-neus">Suite Neus</button></li>
        <li><button class="kbBookBtn" data-suite="suite-bourlardes">Suite Bourlardes</button></li>
        <li><button class="kbBookBtn" data-suite="room-blue-patio">Blue Patio</button></li>
      </ul>
    `));

    setTimeout(() => {
      document.querySelectorAll(".kbBookBtn").forEach(btn => {
        btn.addEventListener("click", async function (e) {
          e.stopPropagation(); // 🔒 empêche toute fermeture
          const key = this.dataset.suite;
          try {
            const raw = await loadKB(`02_suites/${key}`);
            const kb = parseKB(raw);
            addMsg(`
              ${concierge(kb.short)}
              <br><button class="readMoreBtn">En savoir plus</button>
              <div class="kbLongWrapper" style="display:none">${kb.long}</div>
            `);

            const last = chatBody.lastElementChild;
            last.querySelector(".readMoreBtn").addEventListener("click", function (ev) {
              ev.stopPropagation(); // 🔒 sécurité UX
              this.nextElementSibling.style.display = "block";
              this.remove();
            });

          } catch {
            addMsg("Information indisponible pour le moment.");
          }
        });
      });
    }, 0);
  }

  /* -----------------------------
     SEND MESSAGE
  ----------------------------- */
  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    addMsg(text, "userMsg");
    input.value = "";

    const msg = norm(text);
    currentLang = detectLang(msg);

    typing(true);

    setTimeout(async () => {
      typing(false);

      if (isSuiteIntent(msg)) {
        await showSuites();
        return;
      }

      addMsg(concierge(
        "Je peux vous aider à découvrir nos suites, organiser votre séjour ou proposer des expériences."
      ));
    }, 400);
  }

});
