import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Chatbot.css"; // Import the CSS for styling

// const API_BASE_URL = "http://localhost:5000";
 const API_BASE_URL = "http://10.1.0.4:5000";

function Chatbot(props) {
  const [userInput, setUserInput] = useState("");
  const [conversation, setConversation] = useState([]);
  
  // Create a ref for the chat content element
  const chatContentRef = useRef(null);

  // Create a ref for the last assistant message element
  const lastAssistantMessageRef = useRef(null);

  const handleUserInput = (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const sentMessage = { role: "user", content: userInput, hidden: false };

    // Add the sent text to the conversation immediately
    setConversation((prevConversation) => [...prevConversation, sentMessage]);

    // Clear the input field
    setUserInput("");

    const response = await axios.post(`${API_BASE_URL}/ask`, {
      user_input: userInput,
    });

    const assistantResponse = response.data.assistant_response;

    // Update the sent message with the actual response
    // sentMessage.content = assistantResponse;

    // Update the conversation with the sent message and assistant's response
    setConversation((prevConversation) => [
      ...prevConversation,
      { role: "assistant", content: assistantResponse, hidden: true },
    ]);

    // Scroll to the last assistant message
    lastAssistantMessageRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleClearChat = () => {
    setConversation([]);
  };

  // Use useEffect to trigger the fade-in effect
  useEffect(() => {
    const messages = document.querySelectorAll(".chat-bubble");

    messages.forEach((message, index) => {
      // Use a timeout to stagger the animations
      setTimeout(() => {
        message.style.opacity = 1; // Set opacity to 1 to trigger the fade-in effect
      }, index * 100); // Adjust the delay as needed
    });
  }, [conversation]);

  useEffect(() => {
    // Greet the user when the chatbot component mounts
    setConversation([
      ...conversation,
      {
        role: "assistant",
        content: `Hello ${props.userName}, how can I help you?`,
        hidden: true,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-title">Chatbot</div>
        <div className="clear-button" onClick={handleClearChat}>
          Clear
        </div>
      </div>
      {/* Attach the ref to the chat content */}
      <div ref={chatContentRef} className="chat-content">
        {conversation.map((message, index) => (
          <div
            key={index}
            className={`chat-bubble ${
              message.role === "user" ? "user-bubble" : "assistant-bubble"
            }`}
            style={{ opacity: message.hidden ? 0 : 1 }} // Set opacity based on the 'hidden' property
          >
            {message.role === "user" && (
              <div className="message-label">User</div>
            )}
            {message.role === "assistant" && (
              <div
                className="message-label"
                ref={message.role === "assistant" ? lastAssistantMessageRef : null} // Set ref for the last assistant message
              >
                AI
              </div>
            )}
            {message.content}
          </div>
        ))}
        {/* Add an empty div with a ref to scroll to the last assistant message */}
        <div ref={lastAssistantMessageRef}></div>
      </div>
      <form onSubmit={handleSubmit} className="chat-input-container">
        <input
          type="text"
          value={userInput}
          onChange={handleUserInput}
          placeholder="Type a message..."
          className="chat-input"
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
    </div>
  );
}

export default Chatbot;
