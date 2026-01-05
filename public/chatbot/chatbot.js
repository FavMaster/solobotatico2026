/****************************************************
 * SOLO'IA'TICO — CHATBOT LUXE
 * Version 1.5.2 STABLE — TOPIC DRIVEN
 * Multilingue + KB + Intentions SAFE
 ****************************************************/

(function () {

  console.log("Solo’IA’tico Chatbot v1.5.2 — Initialisation");

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
   * LANGUE
   ****************************************************/
  function detectLanguage(message = "") {
    const t = message.toLowerCase();

    if (/\b(zwembad|kamer|boot)\b/.test(t)) return "nl";
    if (/\b(room|pool|boat)\b/.test(t)) return "en";
    if (/\b(piscina|hacer)\b/.test(t)) return "es";
    if (/\b(piscina|fer)\b/.test(t)) return "cat";

    const htmlLang = document.documentElement.lang;
    return htmlLang ? htmlLang.split("-")[0] : "fr";
  }

  /****************************************************
   * INTENTIONS (ACTIONS UNIQUEMENT)
   ****************************************************/
  function detectIntent(message) {
    const t = message.toLowerCase();

    if (["help","aide","ayuda"].some(w => t.includes(w))) return "help";
    if (["suite","room","chambre","kamer"].some(w => t.includes(w))) return "l
