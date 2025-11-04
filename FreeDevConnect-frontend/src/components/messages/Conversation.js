
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext.js';
import Button from '../common/Button.js';
import '../../styles/pages/messages.css';

const Conversation = ({ conversation, onSendMessage }) => {
  const { currentUser } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Faire défiler vers le bas quand on ouvre une conversation ou qu'un nouveau message arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation?.messages]);

  if (!conversation) {
    return (
      <div className="empty-conversation">
        <p>Sélectionnez une conversation pour commencer à discuter</p>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="conversation-container">
      <div className="conversation-header">
        <div className="conversation-user">
          <img src={conversation.avatar || 'https://via.placeholder.com/40'} alt={conversation.name} />
          <div>
            <h3>{conversation.name}</h3>
            {conversation.projectTitle && (
              <p className="conversation-project">Projet: {conversation.projectTitle}</p>
            )}
          </div>
        </div>
      </div>

      <div className="messages-container">
        {conversation.messages.map((message, index) => (
          <div 
            key={index}
            className={`message ${message.senderId === currentUser.id ? 'outgoing' : 'incoming'}`}
          >
            <div className="message-content">
              <p>{message.text}</p>
              <span className="message-time">{message.time}</span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form className="message-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Écrivez votre message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button type="submit" disabled={!newMessage.trim()}>
          Envoyer
        </Button>
      </form>
    </div>
  );
};

export default Conversation;