const form = document.getElementById("assessment-form");
const formMessage = document.getElementById("form-message");
const yearElement = document.getElementById("year");

const WHATSAPP_NUMBER = "5521993674586";

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const goal = String(data.get("goal") || "").trim();
    const location = String(data.get("location") || "").trim();
    const support = String(data.get("support") || "").trim();

    if (
      !name ||
      !phone ||
      !goal ||
      !location ||
      !support ||
      data.get("consent") !== "on"
    ) {
      formMessage.textContent =
        "Confira os campos e autorize o contato para continuar.";
      formMessage.className = "form-message error";
      return;
    }

    const message = [
      "Olá, Berg Junior! Gostaria de fazer minha avaliação gratuita.",
      "",
      `Nome: ${name}`,
      `WhatsApp: ${phone}`,
      `Objetivo: ${goal}`,
      `Onde treino: ${location}`,
      `O que busco: ${support}`
    ].join("\n");

    const url =
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    window.location.assign(url);
  });
}