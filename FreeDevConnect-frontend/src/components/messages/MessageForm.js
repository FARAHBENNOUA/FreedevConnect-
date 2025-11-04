import React, { useState } from 'react';
import { messagesService } from '../../api/config';
import { useNotification } from '../../contexts/NotificationContext';
import Button from '../common/Button';
import '../../styles/components/forms.css';

const MessageForm = ({ conversationId, onMessageSent }) => {
  const { addNotification } = useNotification();
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) {
      return;
    }
    
    setSending(true);
    
    try {
      const response = await messagesService.sendMessage(conversationId, { 
        text: message 
      });
      
      setMessage('');
      if (onMessageSent) {
        onMessageSent(response.data);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      addNotification('Erreur lors de l\'envoi du message', 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <form className="message-form" onSubmit={handleSubmit}>
      <div className="message-input-container">
        <textarea
          className="message-input"
          placeholder="Écrivez votre message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={1}
          required
          disabled={sending}
        />
      </div>
      
      <Button 
        type="submit" 
        variant="primary" 
        disabled={sending || !message.trim()}
      >
        {sending ? 'Envoi...' : 'Envoyer'}
      </Button>
    </form>
  );
};

export default MessageForm.js;