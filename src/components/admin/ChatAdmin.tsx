
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Send, User, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';

// Mock chat data types
type ChatUser = {
  id: string;
  name: string;
  email: string;
  unreadCount: number;
  lastActive: Date;
};

type ChatMessage = {
  id: string;
  chatId: string;
  content: string;
  sender: 'user' | 'admin';
  timestamp: Date;
  read: boolean;
};

export default function ChatAdmin() {
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data for the chat interface
  useEffect(() => {
    // Simulated chat users
    const mockUsers: ChatUser[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        unreadCount: 2,
        lastActive: new Date(Date.now() - 5 * 60000), // 5 minutes ago
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        unreadCount: 0,
        lastActive: new Date(Date.now() - 30 * 60000), // 30 minutes ago
      },
      {
        id: '3',
        name: 'Bob Johnson',
        email: 'bob@example.com',
        unreadCount: 1,
        lastActive: new Date(Date.now() - 2 * 3600000), // 2 hours ago
      },
    ];
    
    setUsers(mockUsers);
  }, []);

  useEffect(() => {
    if (selectedUser) {
      // Simulated chat messages for the selected user
      const mockMessages: ChatMessage[] = [
        {
          id: '1',
          chatId: selectedUser.id,
          content: 'Hi there, I have a question about my order.',
          sender: 'user',
          timestamp: new Date(Date.now() - 60000 * 10), // 10 minutes ago
          read: true,
        },
        {
          id: '2',
          chatId: selectedUser.id,
          content: 'Hello! I\'d be happy to help with your order. Could you please provide your order number?',
          sender: 'admin',
          timestamp: new Date(Date.now() - 60000 * 8), // 8 minutes ago
          read: true,
        },
        {
          id: '3',
          chatId: selectedUser.id,
          content: 'My order number is #12345. I haven\'t received a shipping confirmation yet.',
          sender: 'user',
          timestamp: new Date(Date.now() - 60000 * 5), // 5 minutes ago
          read: true,
        },
      ];
      
      if (selectedUser.id === '1') {
        // Add unread messages for John Doe
        mockMessages.push(
          {
            id: '4',
            chatId: selectedUser.id,
            content: 'It\'s been 3 days since I placed the order. When can I expect it to ship?',
            sender: 'user',
            timestamp: new Date(Date.now() - 60000 * 2), // 2 minutes ago
            read: false,
          },
          {
            id: '5',
            chatId: selectedUser.id,
            content: 'Please let me know if there\'s any update on this. Thanks!',
            sender: 'user',
            timestamp: new Date(Date.now() - 60000 * 1), // 1 minute ago
            read: false,
          }
        );
      } else if (selectedUser.id === '3') {
        // Add unread message for Bob Johnson
        mockMessages.push({
          id: '4',
          chatId: selectedUser.id,
          content: 'I\'d like to change my shipping address. Is that still possible?',
          sender: 'user',
          timestamp: new Date(Date.now() - 60000 * 30), // 30 minutes ago
          read: false,
        });
      }
      
      setMessages(mockMessages);
      
      // Mark messages as read when viewing them
      if (selectedUser.unreadCount > 0) {
        const updatedUsers = users.map(user => 
          user.id === selectedUser.id ? { ...user, unreadCount: 0 } : user
        );
        setUsers(updatedUsers);
      }
      
      scrollToBottom();
    }
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const selectUser = (user: ChatUser) => {
    setSelectedUser(user);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUser || !message.trim()) return;
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      chatId: selectedUser.id,
      content: message,
      sender: 'admin',
      timestamp: new Date(),
      read: false,
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
    
    toast({
      title: 'Message sent',
      description: `Message sent to ${selectedUser.name}`,
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
      {/* Chat users list */}
      <Card className="md:col-span-1 flex flex-col h-full overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle>Customer Chats</CardTitle>
          <CardDescription>
            {users.reduce((acc, user) => acc + user.unreadCount, 0)} unread messages
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-0">
          <ScrollArea className="h-[calc(100vh-300px)]">
            <ul className="divide-y">
              {users.map(user => (
                <li key={user.id}>
                  <button
                    onClick={() => selectUser(user)}
                    className={`w-full text-left p-4 hover:bg-gray-50 flex items-start transition-colors ${
                      selectedUser?.id === user.id ? 'bg-gray-50' : ''
                    }`}
                  >
                    <div className="h-10 w-10 rounded-full bg-selta-deep-purple/10 flex items-center justify-center mr-3 flex-shrink-0">
                      <User className="h-5 w-5 text-selta-deep-purple" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-gray-900 truncate">{user.name}</h4>
                        <span className="text-xs text-gray-500">{formatDate(user.lastActive)}</span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      {user.unreadCount > 0 && (
                        <Badge variant="default" className="mt-1">
                          {user.unreadCount} unread
                        </Badge>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </CardContent>
      </Card>
      
      {/* Chat messages */}
      <Card className="md:col-span-2 flex flex-col h-full overflow-hidden">
        {selectedUser ? (
          <>
            <CardHeader className="pb-3">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-selta-deep-purple/10 flex items-center justify-center mr-3">
                  <User className="h-5 w-5 text-selta-deep-purple" />
                </div>
                <div>
                  <CardTitle>{selectedUser.name}</CardTitle>
                  <CardDescription>{selectedUser.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="flex-1 p-0 overflow-hidden flex flex-col">
              <ScrollArea className="flex-1 px-4 py-2 h-[calc(100vh-380px)]">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.sender === 'admin' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[75%] rounded-lg px-4 py-2 ${
                          msg.sender === 'admin'
                            ? 'bg-selta-deep-purple text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p>{msg.content}</p>
                        <p className={`text-xs mt-1 ${
                          msg.sender === 'admin' ? 'text-white/70' : 'text-gray-500'
                        }`}>
                          {formatTime(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              <Separator />
              <div className="p-3">
                <form onSubmit={handleSendMessage} className="flex flex-col space-y-2">
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your reply..."
                    className="min-h-[80px] resize-none"
                  />
                  <Button type="submit" disabled={!message.trim()} className="self-end">
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                </form>
              </div>
            </CardContent>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <MessageCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No Chat Selected</h3>
            <p className="text-gray-500 max-w-md">
              Select a customer from the list to view their conversation and respond to their messages.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
