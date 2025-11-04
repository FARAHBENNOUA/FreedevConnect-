import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/pages/messages.css';

const MessagesList = ({ conversations, activeId, onSelect }) => {
  return (
    <div className="messages-list">
      <div className="messages-list-header">
        <h2>Conversations</h2>
      </div>
      
      {conversations.length === 0 ? (
        <div className="empty-conversations">
          <p>Aucune conversation</p>
        </div>
      ) : (
        <div className="conversations">
          {conversations.map((conversation) => (
            <div 
              key={conversation.id}
              className={`conversation-item ${conversation.id === activeId ? 'active' : ''}`}
              onClick={() => onSelect(conversation.id)}
            >
              <div className="conversation-avatar">
                <img src={conversation.avatar || 'https://via.placeholder.com/40'} alt={conversation.name} />
                {conversation.unread > 0 && <span className="unread-badge">{conversation.unread}</span>}
              </div>
              <div className="conversation-info">
                <div className="conversation-header">
                  <h3>{conversation.name}</h3>
                  <span className="conversation-time">{conversation.lastMessageTime}</span>
                </div>
                <div className="conversation-preview">
                  <p>{conversation.lastMessage}</p>
                  {conversation.projectTitle && (
                    <Link to={`/projects/${conversation.projectId}`} className="project-link">
                      {conversation.projectTitle}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessagesList