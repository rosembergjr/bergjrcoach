const form = document.getElementById("assessment-form");
const formMessage = document.getElementById("form-message");

const yearElement = document.getElementById("year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

if (form) {
    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const submitButton = form.querySelector("button[type='submit']");

        submitButton.disabled = true;
        submitButton.innerHTML = "Enviando...";

        formMessage.textContent = "";
        formMessage.className = "form-message";

        const formData = new FormData(form);

        const data = {
            name: formData.get("name"),
            phone: formData.get("phone"),
            goal: formData.get("goal"),
            location: formData.get("location"),
            support: formData.get("support"),
            consent: formData.get("consent") === "on"
        };

        try {
            const response = await fetch("/api/leads", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Não foi possível enviar a avaliação."
                );
            }

            formMessage.textContent =
                "Avaliação enviada com sucesso! Em breve entraremos em contato.";

            formMessage.classList.add("success");

            form.reset();

        } catch (error) {
            console.error(error);

            formMessage.textContent =
                error.message || "Ocorreu um erro. Tente novamente.";

            formMessage.classList.add("error");

        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML =
                'Enviar avaliação <span>↗</span>';
        }
    });
}