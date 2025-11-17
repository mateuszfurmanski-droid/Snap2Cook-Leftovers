// ==== CONFIG ====
const OPENAI_API_KEY = "TU_WKLEISZ_SWÓJ_KLUCZ"; 

// ==== ELEMENTY HTML ====
const uploadInput = document.getElementById("upload");
const previewImg = document.getElementById("preview");
const resultsBox = document.getElementById("results");

// ==== OBSŁUGA ZDJĘCIA ====
uploadInput.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        previewImg.src = e.target.result;
        previewImg.style.display = "block";
        analyzeImage(e.target.result);
    };
    reader.readAsDataURL(file);
});

// ==== FUNKCJA AI: ROZPOZNAWANIE PRODUKTÓW ====
async function analyzeImage(base64Image) {
    resultsBox.innerHTML = "⏳ Analizuję zdjęcie...";

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: "Analyze the food items in this fridge image and list ingredients only." },
                        { type: "image_url", image_url: { url: base64Image } }
                    ]
                }
            ]
        })
    });

    const data = await response.json();
    console.log(data);

    const productList = data.choices?.[0]?.message?.content || "Brak rozpoznanych produktów";

    resultsBox.innerHTML = `
        <h3>🥕 Rozpoznane produkty:</h3>
        <p>${productList}</p>
        <h3>🍳 Przepisy dopasowane do składników:</h3>
        <p>Wersja demo – tu będą przepisy</p>
    `;
}
