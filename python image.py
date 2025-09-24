@app.post("/chat/")
async def chat(query: Query):
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=query.message,
        max_tokens=150
    )
    image_url = "https://example.com/heat_image.jpg"  # Replace with actual image URL
    return {"response": response.choices[0].text.strip(), "image": image_url}
