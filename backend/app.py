from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import OpenAI
import os
import re

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "https://ai-text-analyzer-frontend.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TextRequest(BaseModel):
    text: str


@app.get("/")
def home():
    return {
        "message": "AI Text Analyzer Backend is Working!"
    }


# =====================================
# TEXT ANALYSIS
# =====================================

@app.post("/analyze")
def analyze_text(data: TextRequest):

    text = data.text.strip()

    words = text.split()

    total_words = len(words)

    total_characters = len(text)

    sentences = re.split(r"[.!?]+", text)

    sentences = [
        sentence for sentence in sentences
        if sentence.strip()
    ]

    total_sentences = len(sentences)

    words_per_minute = 200

    reading_time = max(
        1,
        (total_words + words_per_minute - 1)
        // words_per_minute
    )

    return {
        "words": total_words,
        "characters": total_characters,
        "sentences": total_sentences,
        "reading_time": reading_time
    }


# =====================================
# AI ANALYSIS
# =====================================

@app.post("/ai-test")
def ai_test(data: TextRequest):

    prompt = f"""
You are an expert AI writing assistant.

Analyze the following text:

--- TEXT START ---
{data.text}
--- TEXT END ---

Give the user a useful and concise analysis.

Use exactly this structure:

SUMMARY:
Give a short summary of the text.

KEY POINTS:
- Give 3 important points.

TONE:
Identify the overall tone.

SUGGESTIONS:
- Give 2 useful suggestions to improve the writing.

IMPROVED VERSION:
Rewrite the text to make it clearer, more professional, and natural.

Keep the response easy to read.
"""

    response = client.responses.create(
        model="gpt-5.6-luna",
        input=prompt
    )

    return {
        "result": response.output_text
    }
# =====================================
# IMPROVE TEXT
# =====================================

@app.post("/improve")
def improve_text(data: TextRequest):

    prompt = f"""
You are an expert writing assistant.

Improve the following text while keeping its original meaning.

TEXT:
{data.text}

Make it:
- Clear
- Natural
- Professional
- Grammatically correct

Return only the improved version.
"""

    response = client.responses.create(
        model="gpt-5.6-luna",
        input=prompt
    )

    return {
        "result": response.output_text
    }