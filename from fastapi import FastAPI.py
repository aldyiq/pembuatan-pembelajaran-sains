from fastapi import FastAPI
from pydantic import BaseModel
import openai
import os
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()

class Query(BaseModel):
    message: str

@app.post("/chat/")
async def chat(query: Query):
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=query.message,
        max_tokens=150
    )
    return {"response": response.choices[0].text.strip()}
from fastapi import WebSocket

@app.websocket("/ws/chat/")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        response = openai.Completion.create(
            model="text-davinci-003",
            prompt=data,
            max_tokens=150
        )
        await websocket.send_text(response.choices[0].text.strip())
