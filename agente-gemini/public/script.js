document.getElementById("preferencias-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    dieta: document.getElementById("dieta").value,
    intolerancias: document.getElementById("intolerancias").value.split(",").map(x => x.trim()),
    objetivo: document.getElementById("objetivo").value
  };

  document.getElementById("loading").classList.remove("hidden");
  document.getElementById("respuesta").innerHTML = "";

  const res = await fetch("/generar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const { respuesta } = await res.json();

  document.getElementById("loading").classList.add("hidden");

  document.getElementById("respuesta").innerHTML = respuesta
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n\n/g, "<br><br>")
    .replace(/\n/g, "<br>");
});
