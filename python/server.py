from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage
from dotenv import load_dotenv

from dgui_schema import UISchema
import uvicorn

load_dotenv()

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

llm = ChatOpenAI(model_name="gpt-4.1-mini", temperature=0)
#llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash-preview-05-20", temperature=0)
llm_with_struct = llm.with_structured_output(UISchema)

class GenerateUIRequest(BaseModel):
    prompt: str

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/generate_ui")
def generate_ui(request: GenerateUIRequest):
    """
    Generates a UI schema based on the user's prompt.
    """
    print("Received prompt:", request.prompt)
    answer: UISchema = llm_with_struct.invoke([SystemMessage(content="You are a UI generator, you are required to generate UI, even if user is not providing sufficient data you are supposed to generate mock values"), HumanMessage(content=request.prompt)])
    print("Generated UI Schema:", answer)
    return answer.model_dump()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
