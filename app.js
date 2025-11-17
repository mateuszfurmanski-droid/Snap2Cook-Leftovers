// app.js – Gotuj z Lodówki (wersja bez klucza w repo)

// Elementy z HTML
const apiKeyInput = document.getElementById("apiKey");
const photoInput = document.getElementById("photoInput");
const analyzeButton = document.getElementById("analyzeButton");
const resultBox = document.getElementById("result");
const statusBox = document.getElementById("status");

// Kliknięcie przycisku
analyzeButton.addEventListener("click", async () => {
  const apiKey = apiKeyInput.value.trim();
  const file = photoInput.files[0];

  if (!apiKey) {
    alert("Wklej swój OpenAI API key w odpowiednie pole.");
    return;
  }
  if (!file) {
    alert("Wybierz zdjęcie lodówki.");
    return;
  }

  statusBox.textContent = "Przetwarzam zdjęcie…";
  resultBox.textContent = "";
  analyzeButton.disabled = true;

  try {
    const base64Image = await fileToBase64(file);
    const answer = await callOpenAIVision(apiKey, base64Image);
    resultBox.textContent = answer;
    statusBox.textContent = "Gotowe ✅";
  } catch (err) {
    console.error(err);
    statusBox.textContent = "Wystąpił błąd ❌";
    alert("Coś poszło nie tak: " + err.message);
  } finally {
    analyzeButton.disabled = false;
  }
});

// Konwersja pliku na Base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Wywołanie OpenAI Vision
async function callOpenAIVision(apiKey, base64Image) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Jesteś asystentem kulinarnym. Najpierw wypisz rozpoznane produkty z lodówki, " +
            "a potem zaproponuj 3 szybkie przepisy po polsku. Format odpowiedzi:\n\n" +
            "Produkty:\n- ...\n\nPrzepisy:\n1) ...\n2) ...\n3) ...",
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Zobacz to zdjęcie lodówki i zrób listę produktów oraz 3 przepisy." },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error("OpenAI error: " + text);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}
