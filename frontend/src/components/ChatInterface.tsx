import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { MessageCircle, Send } from 'lucide-react';

interface Message {
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { token } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await api.chatAdvice(input, token!);
      const aiMessage: Message = {
        role: 'ai',
        content: response.advice,
        timestamp: response.timestamp,
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      toast({
        title: "Chat Error",
        description: error instanceof Error ? error.message : "Failed to get response",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-[700px] flex flex-col max-w-4xl mx-auto shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-purple-500/5 border-b">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
            <MessageCircle className="h-5 w-5 text-primary" />
          </div>
          Chat with AfyaJamii AI
        </CardTitle>
        <CardDescription className="text-base">
          Get instant answers about maternal health, nutrition, and pregnancy care from our AI assistant
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden pt-6">
        <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-12">
                <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Start a Conversation</h3>
                <p className="mb-4">Ask our AI assistant anything about:</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-2xl mx-auto text-sm">
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                    <p className="font-medium text-blue-700 dark:text-blue-300">🥗 Nutrition</p>
                    <p className="text-xs text-muted-foreground mt-1">Diet and meal planning</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg">
                    <p className="font-medium text-green-700 dark:text-green-300">💊 Health Concerns</p>
                    <p className="text-xs text-muted-foreground mt-1">Symptoms and wellness</p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-950/20 p-3 rounded-lg">
                    <p className="font-medium text-purple-700 dark:text-purple-300">🤰 Pregnancy Care</p>
                    <p className="text-xs text-muted-foreground mt-1">Tips and guidance</p>
                  </div>
                </div>
              </div>
            ) : (
              messages.map((message, index) => {
                // Format text to render bold content between ** markers
                const formatText = (text: string) => {
                  const parts = text.split('**');
                  return parts.map((part, idx) => {
                    if (idx % 2 === 1) {
                      return <strong key={idx}>{part}</strong>;
                    }
                    return part;
                  });
                };

                return (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground border'
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {message.role === 'ai' ? formatText(message.content) : message.content}
                      </div>
                      <div className="text-xs opacity-70 mt-2 flex items-center gap-1">
                        {message.role === 'ai' && '🤖 AI • '}
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-secondary text-secondary-foreground rounded-lg p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <form onSubmit={handleSubmit} className="flex gap-3 pt-2 border-t">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about your health..."
            disabled={isLoading}
            className="flex-1 h-12 text-base"
          />
          <Button type="submit" disabled={isLoading || !input.trim()} size="lg" className="px-6">
            {isLoading ? (
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChatInterface;
