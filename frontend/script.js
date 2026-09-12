// =====================================
// GET HTML ELEMENTS
// =====================================

const textInput = document.getElementById("textInput");

const analyzeButton = document.getElementById("analyzeButton");

const clearButton = document.getElementById("clearButton");

const liveWordCount = document.getElementById("liveWordCount");

const wordCount = document.getElementById("wordCount");

const characterCount = document.getElementById("characterCount");

const sentenceCount = document.getElementById("sentenceCount");

const readingTime = document.getElementById("readingTime");

const qualityScore = document.getElementById("qualityScore");

const qualityProgress = document.getElementById("qualityProgress");
const aiResult = document.getElementById("aiResult");

// =====================================
// LIVE WORD COUNTER
// =====================================

textInput.addEventListener("input", function () {

    const text = textInput.value.trim();

    if (text === "") {

        liveWordCount.textContent = "0 words";

        return;
    }

    const words = text.split(/\s+/);

    liveWordCount.textContent =
        words.length + " words";

});


// =====================================
// ANALYZE TEXT
// =====================================

analyzeButton.addEventListener("click", async function () {

    const text = textInput.value.trim();

    if (text === "") {

        alert("Please enter some text first.");

        return;
    }

    try {

        const response = await fetch(
            "https://ai-text-analyzer-tkm3.onrender.com/analyze",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    text: text
                })
            }
        );


        const data = await response.json();
    const aiResponse = await fetch(

    "https://ai-text-analyzer-tkm3.onrender.com/ai-test",
    {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            text: text
        })
    }
);

const aiData = await aiResponse.json();

aiResult.textContent = aiData.result;

        // =================================
        // DISPLAY RESULTS FROM PYTHON
        // =================================

        wordCount.textContent =
            data.words;

        characterCount.textContent =
            data.characters;

        sentenceCount.textContent =
            data.sentences;

        readingTime.textContent =
            data.reading_time + " min";


        // =================================
        // SIMPLE QUALITY SCORE
        // =================================

        let score = 50;


        if (data.words >= 20) {

            score += 10;

        }


        if (data.words >= 50) {

            score += 10;

        }


        if (data.sentences >= 3) {

            score += 10;

        }


        if (data.sentences > 0) {

            const averageSentenceLength =
                data.words / data.sentences;

            if (averageSentenceLength < 25) {

                score += 10;

            }

        }


        score = Math.min(score, 100);


        qualityScore.textContent =
            score + "%";

        qualityProgress.style.width =
            score + "%";


    } catch (error) {

        console.error(error);

        alert(
            "Could not connect to the Python backend."
        );

    }

});


// =====================================
// CLEAR TEXT
// =====================================

clearButton.addEventListener("click", function () {

    textInput.value = "";

    liveWordCount.textContent =
        "0 words";

    wordCount.textContent =
        "0";

    characterCount.textContent =
        "0";

    sentenceCount.textContent =
        "0";

    readingTime.textContent =
        "0 min";

    qualityScore.textContent =
        "0%";

    qualityProgress.style.width =
        "0%";

});