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
const copyButton = document.getElementById("copyButton");


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


    // =====================================
    // SHOW AI PROCESSING STATE
    // =====================================

    analyzeButton.disabled = true;

    analyzeButton.textContent = "🤖 Analyzing...";

    aiResult.innerHTML = `
        <div class="ai-loading">

            <div class="loading-spinner"></div>

            <p>AI is analyzing your text...</p>

            <span>Generating insights...</span>

        </div>
    `;


    try {

        // =====================================
        // SEND TEXT TO PYTHON ANALYZER
        // =====================================

        const response = await fetch(
            "https://ai-text-analyzer-backend.onrender.com/analyze",
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


        // =====================================
        // SEND TEXT TO AI
        // =====================================

        const aiResponse = await fetch(
            "https://ai-text-analyzer-backend.onrender.com/ai-test",
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


        // =====================================
        // DISPLAY AI RESULT
        // =====================================

        aiResult.innerHTML = formatAIResult(aiData.result);


        // =====================================
        // DISPLAY PYTHON RESULTS
        // =====================================

        wordCount.textContent =
            data.words;

        characterCount.textContent =
            data.characters;

        sentenceCount.textContent =
            data.sentences;

        readingTime.textContent =
            data.reading_time + " min";


        // =====================================
        // SIMPLE QUALITY SCORE
        // =====================================

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


        // =====================================
        // DISPLAY QUALITY SCORE
        // =====================================

        qualityScore.textContent =
            score + "%";

        qualityProgress.style.width =
            score + "%";


    } catch (error) {

        console.error(error);

        aiResult.textContent =
            "Unable to analyze the text right now.";

        alert(
            "Could not connect to the Python backend."
        );

    } finally {

        // =====================================
        // RESTORE ANALYZE BUTTON
        // =====================================

        analyzeButton.disabled = false;

        analyzeButton.textContent =
            "Analyze Text";

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


    // Clear AI result too

    aiResult.textContent =
        "Your AI analysis will appear here.";

});


// =====================================
// COPY AI RESULT
// =====================================

copyButton.addEventListener("click", async function () {

    const result =
        aiResult.textContent.trim();


    if (
        result === "" ||
        result === "Your AI analysis will appear here."
    ) {

        alert(
            "There is no AI result to copy yet."
        );

        return;
    }


    try {

        await navigator.clipboard.writeText(result);


        copyButton.textContent =
            "✅ Copied!";


        setTimeout(function () {

            copyButton.textContent =
                "📋 Copy";

        }, 2000);


    } catch (error) {

        console.error(error);

        alert(
            "Could not copy the AI result."
        );

    }

});
// =====================================
// FORMAT AI RESULT INTO CARDS
// =====================================

function formatAIResult(result) {

    const summaryMatch = result.match(
        /SUMMARY:\s*([\s\S]*?)(?=KEY POINTS:|TONE:|SUGGESTIONS:|IMPROVED VERSION:|$)/i
    );

    const keyPointsMatch = result.match(
        /KEY POINTS:\s*([\s\S]*?)(?=TONE:|SUGGESTIONS:|IMPROVED VERSION:|$)/i
    );

    const toneMatch = result.match(
        /TONE:\s*([\s\S]*?)(?=SUGGESTIONS:|IMPROVED VERSION:|$)/i
    );

    const suggestionsMatch = result.match(
        /SUGGESTIONS:\s*([\s\S]*?)(?=IMPROVED VERSION:|$)/i
    );

    const improvedMatch = result.match(
        /IMPROVED VERSION:\s*([\s\S]*)/i
    );


    const summary = summaryMatch
        ? summaryMatch[1].trim()
        : "";

    const keyPoints = keyPointsMatch
        ? keyPointsMatch[1].trim()
        : "";

    const tone = toneMatch
        ? toneMatch[1].trim()
        : "";

    const suggestions = suggestionsMatch
        ? suggestionsMatch[1].trim()
        : "";

    const improved = improvedMatch
        ? improvedMatch[1].trim()
        : "";


    return `
        <div class="ai-card summary-card">
            <div class="ai-card-title">
                📝 <span>Summary</span>
            </div>
            <p>${summary}</p>
        </div>


        <div class="ai-card">
            <div class="ai-card-title">
                🔑 <span>Key Points</span>
            </div>
            <p>${keyPoints}</p>
        </div>


        <div class="ai-card">
            <div class="ai-card-title">
                🎭 <span>Tone</span>
            </div>
            <p>${tone}</p>
        </div>


        <div class="ai-card">
            <div class="ai-card-title">
                💡 <span>Suggestions</span>
            </div>
            <p>${suggestions}</p>
        </div>


        <div class="ai-card improved-card">
            <div class="ai-card-title">
                ✨ <span>Improved Version</span>
            </div>
            <p>${improved}</p>
        </div>
    `;
}