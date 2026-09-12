from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import OpenAI
import os
import re


# Load environment variables
load_dotenv()


# Create OpenAI client
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)


# Create FastAPI app
app = FastAPI()


# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request format
class TextRequest(BaseModel):
    text: str


# Home
@app.get("/")
def home():
    return {
        "message": "AI Text Analyzer Backend is Working!"
    }


# Analyze text
@app.post("/analyze")
def analyze_text(data: TextRequest):

    text = data.text.strip()

    words = text.split()
    total_words = len(words)

    total_characters = len(text)

    sentences = re.split(r"[.!?]+", text)

    sentences = [
        sentence
        for sentence in sentences
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


# AI test
@app.post("/ai-test")
def ai_test(data: TextRequest):

    response = client.responses.create(
        model="gpt-5.6-luna",
        input=f"""
Analyze this text and give a short summary:

{data.text}
"""
    )

    return {
        "result": response.output_text
    }