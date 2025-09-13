
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Send, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'admin';
  timestamp: Date;
  read: boolean;
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    console.log('ChatWidget useEffect - checking messages length:', messages.length);
    if (messages.length === 0) {
      setMessages([
        {
          id: '1',
          content: 'Hello! How can we help you today?',
          sender: 'admin',
          timestamp: new Date(),
          read: true
        }
      ]);
    }
  }, [messages.length]);
  
  useEffect(() => {
    if (isOpen) {
      console.log('ChatWidget - scrolling to bottom because chat is open');
      scrollToBottom();
    }
  }, [messages, isOpen]);
  
  const scrollToBottom = () => {
    console.log('ChatWidget - attempting to scroll to bottom', messagesEndRef.current);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    console.log('ChatWidget - message submitted:', message);
    
    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date(),
      read: true
    };
    
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setMessage('');
    
    setTimeout(() => {
      const adminMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Thank you for your message. Our team will get back to you shortly.',
        sender: 'admin',
        timestamp: new Date(),
        read: true
      };
      
      setMessages(prevMessages => [...prevMessages, adminMessage]);
      
      toast({
        title: 'New message',
        description: 'You have received a new message',
      });
    }, 1000);
  };
  
  const toggleChat = () => {
    console.log('ChatWidget - toggling chat, current state:', isOpen);
    setIsOpen(!isOpen);
  };
  
  useEffect(() => {
    console.log('ChatWidget mounted');
    return () => console.log('ChatWidget unmounted');
  }, []);
  
  return (
    <>
      <button
        onClick={toggleChat}
        className={cn(
          "fixed bottom-6 right-6 rounded-full p-4 shadow-lg z-50 transition-all duration-300 flex items-center justify-center",
          isOpen 
            ? "bg-white text-selta-deep-purple hover:bg-gray-100" 
            : "bg-selta-deep-purple text-white hover:bg-selta-deep-purple/90"
        )}
        aria-label="Chat with us"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
      
      <div
        className={cn(
          "fixed bottom-20 right-6 bg-white rounded-xl shadow-2xl z-50 flex flex-col transition-all duration-300 ease-in-out",
          isOpen 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 translate-y-4 pointer-events-none",
          "w-[80vw] sm:w-[300px] md:w-[340px]" // Reduced width by approximately 2cm
        )}
        style={{ maxHeight: 'calc(100vh - 120px)' }}
      >
        <div className="bg-gradient-to-r from-selta-deep-purple to-selta-vivid-purple text-white rounded-t-xl p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <MessageSquare size={20} />
            <h3 className="font-medium">Customer Support</h3>
          </div>
          <button
            onClick={toggleChat}
            className="text-white hover:text-gray-200 transition-colors rounded-full hover:bg-white/10 p-1"
            aria-label="Close chat"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto" style={{ height: '450px' }}> {/* Increased height */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "mb-4 max-w-[85%]",
                msg.sender === 'user' ? "ml-auto" : "mr-auto"
              )}
            >
              <div
                className={cn(
                  "rounded-lg px-4 py-2 shadow-sm",
                  msg.sender === 'user'
                    ? "bg-gradient-to-r from-selta-deep-purple to-selta-purple text-white rounded-tr-none"
                    : "bg-gray-100 text-gray-800 rounded-tl-none"
                )}
              >
                <p className="break-words">{msg.content}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1 px-1">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100">
          <div className="flex space-x-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-gray-50 border-gray-200 focus-visible:ring-selta-purple"
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={!message.trim()}
              className="bg-selta-deep-purple hover:bg-selta-purple transition-colors"
            >
              <Send size={18} />
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
