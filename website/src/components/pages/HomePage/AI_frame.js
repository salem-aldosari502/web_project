function AskAIChat({ showAI, setShowAI }) {
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
        <p>Hello, how can I help you?</p>
      </div>

      <div className="ai-chat-footer">
        <input type="text" placeholder="Type here..." />
        <button className="ai-send-btn">➤</button>
      </div>
    </div>
  );
}

export default AskAIChat;