// Proste rozpoznawanie produktów przez OpenAI Vision API
async function analyzeImage() {
    const fileInput = document.getElementById("photo");
    const resultBox = document.getElementById("results");
    const recipesBox = document.getElementById("recipes");

    if (!fileInput.files.length) {
        alert("Dodaj zdjęcie lodówki!");
        return;
    }

    const imageFile = fileInput.files[0];
    resultBox.innerHTML = "⏳ Analizuję zdjęcie...";

    // OpenAI Vision API
    const apiKey = ""; // <- TU WSTAWISZ SWOJE API KEY
    const formData = new FormData();
    formData.append("file", imageFile);

    const response = await fetch("https://api.openai.com/v1/images/vision", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`
        },
        body: formData
    });

    const data = await response.json();
    console.log(data);

    const products = data.labels || [];

    resultBox.innerHTML = "<h3>🥑 Wykryte produkty:</h3>" +
        products.map(p => `• ${p}`).join("<br>");

    // Prosta baza przepisów
    const recipes = [
        { name: "Jajecznica", needs: ["jajka", "masło"] },
        { name: "Kurczak pieczony", needs: ["kurczak", "masło"] },
        { name: "Kanapka z pomidorem", needs: ["pomidor", "masło"] },
    ];

    const matched = recipes.filter(r =>
        r.needs.every(n => products.includes(n))
    );

    recipesBox.innerHTML = "<h3>🍲 Pasujące przepisy:</h3>" +
        (matched.length
            ? matched.map(r => "• " + r.name).join("<br>")
            : "Brak pasujących przepisów");
}
