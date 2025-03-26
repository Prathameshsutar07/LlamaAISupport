**LlamaAISupport Chatbot**
****
LlamaAISupport is an AI-powered chatbot built with React (frontend) and Express.js (backend). It utilizes a knowledge base to provide quick responses and integrates with a locally installed AI model (Ollama Llama) to generate answers when needed.

**Features**

Instant Responses: Matches user queries against a predefined knowledge base.

AI Assistance: Uses locally installed Ollama Llama for responses when no exact match is found.

Efficient Caching: Stores previous responses for faster retrieval.

User-Friendly UI: Clean chat interface with a responsive design.

API Integration: Connects to a backend server for processing messages.

**Installation & Setup**

Prerequisites

Node.js (v14+ recommended)

npm or yarn

MongoDB Compass (if extending with database storage)

Ollama Llama (installed locally for AI processing)

**Backend Setup**
Clone this repository:

git clone https://github.com/your-repo/llama-ai-support.git
cd llama-ai-support

Install dependencies:

npm install

Create a .env file and configure the required environment variables:

PORT=3000
AI_API_URL=http://localhost:11434/api/chat

Ensure that Ollama Llama is running locally.

Start the backend server:

node server.js

Frontend Setup

**Navigate to the frontend folder:**
cd frontend

Install dependencies:

npm install

Start the React app:

npm start

Usage

Open http://localhost:3000 in your browser.

Type a message in the chatbox and press Enter or click the Send button.

The chatbot will respond based on the knowledge base or AI model.

API Endpoints

Chat Endpoint

POST /chat



Request Body:

{
  "message": "How do I reset my password?"
}

Response:

{
  "response": "You can reset your password by going to the settings page."
}

**Future Improvements**

✅ Streaming AI Responses for a more interactive experience.

✅ Database Integration for persistent chat history.

✅ Deploying Backend to Cloud for remote access.

✅ Multilingual Support for a wider audience.

**License**

This project is licensed under the MIT License.

**Contributors**

Prathamesh Sutar - Developer

Feel free to contribute and improve this chatbot!

