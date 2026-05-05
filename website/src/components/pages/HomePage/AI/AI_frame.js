import { useState } from "react";
import { getAIResponse } from "./openAi";

function AskAIChat({ showAI, setShowAI }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm your AI assistant for this travel website. I can help you find Hotels, Restaurants, and Events. What are you looking for?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);

    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    try {
      const aiResponse = await getAIResponse(userMessage);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: aiResponse },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!showAI) return null;

  return (
    <div className="ai-chat-box">
      <div className="ai-chat-header">
        <span>ASK AI</span>
        <button className="ai-close-btn" onClick={() => setShowAI(false)}>
          ×
        </button>
      </div>

      <div className="ai-chat-body">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`ai-message ${
              msg.role === "user" ? "user-message" : "ai-response"
            }`}
          >
            <p>{msg.content}</p>
          </div>
        ))}
        {isLoading && (
          <div className="ai-message ai-response">
            <p>Thinking...</p>
          </div>
        )}
      </div>

      <form className="ai-chat-footer" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ask about hotels, restaurants, events..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
        />
        <button type="submit" className="ai-send-btn" disabled={isLoading}>
          ➤
        </button>
      </form>
    </div>
  );
}

export default AskAIChat;
