/* =========================================================
   SOLO'IA'TICO — CHATBOT LUXE
   DOM-RESILIENT VERSION (Vercel / Safari SAFE)
   ========================================================= */

(function () {

  const MAX_TRIES = 40; // ~4 secondes
  let tries = 0;

  function waitForChatbotDOM() {
    const openBtn  = document.getElementById("openChatBtn");
    const chatWin  = document.getElementById("chatWindow");
    const chatBody = document.getElementById("chatBody");
    const input    = document.getElementById("userInput");
    const sendBtn  = document.getElementById("sendBtn");
    const typingEl = document.getElementById("typing");

    if (!openBtn || !chatWin || !chatBody || !input || !sendBtn) {
      tries++;
      if (tries < MAX_TRIES) {
        requestAnimationFrame(waitForChatbotDOM);
      } else {
        console.warn("Chatbot DOM not found after wait – aborting safely");
      }
      return;
    }

    initChatbot({ openBtn, chatWin, chatBody, input, sendBtn, typingEl });
  }

  document.addEventListener("DOMContentLoaded", waitForChatbotDOM);

  /* ===================================================== */

  function initChatbot(dom) {

    const { openBtn, chatWin, chatBody, input, sendBtn, typingEl } = dom;

    const KB_BASE = "/kb";
    let currentLang = "fr";

    /* ---------------- UI ---------------- */

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

    /* ---------------- UTILS ---------------- */

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

    /* ---------------- CONCIERGE ---------------- */

    function concierge(text) {
      return `<b>Avec plaisir.</b><br>${text}<br><i>Je suis là si besoin.</i>`;
    }

    /* ---------------- SUITES ---------------- */

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

      requestAnimationFrame(() => {
        document.querySelectorAll(".kbBookBtn").forEach(btn => {
          btn.addEventListener("click", async function (e) {
            e.stopPropagation();

            try {
              const raw = await loadKB(`02_suites/${this.dataset.suite}`);
              const kb = parseKB(raw);

              addMsg(`
                ${concierge(kb.short)}
                <br><button class="readMoreBtn">En savoir plus</button>
                <div class="kbLongWrapper" style="display:none">${kb.long}</div>
              `);

              const last = chatBody.lastElementChild;
              last.querySelector(".readMoreBtn").addEventListener("click", ev => {
                ev.stopPropagation();
                last.querySelector(".kbLongWrapper").style.display = "block";
                ev.target.remove();
              });

            } catch {
              addMsg("Information indisponible pour le moment.");
            }
          });
        });
      });
    }

    /* ---------------- SEND ---------------- */

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

    console.log("Solo'IA'tico Chatbot initialized successfully");
  }

})();
