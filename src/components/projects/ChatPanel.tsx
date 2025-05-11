
import { useState, useEffect, useRef } from "react";
import { getProjectMessages, sendProjectMessage, setupMessageSubscription, ProjectChatMessage } from "@/services/chatService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";

type ChatPanelProps = {
  projectId: string;
};

const ChatPanel = ({ projectId }: ChatPanelProps) => {
  const [messages, setMessages] = useState<ProjectChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const data = await getProjectMessages(projectId);
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
    
    // Setup subscription - now it directly returns the unsubscribe function
    const unsubscribe = setupMessageSubscription(projectId, (message) => {
      setMessages(prev => [...prev, message]);
    });
    
    return () => {
      // Call the unsubscribe function directly
      unsubscribe();
    };
  }, [projectId]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !user) return;
    
    setSending(true);
    try {
      const sent = await sendProjectMessage(projectId, newMessage.trim());
      if (sent) {
        // The message will be added by the subscription
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };
  
  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardHeader className="px-4 py-3 border-b">
        <CardTitle className="text-lg">Team Chat</CardTitle>
      </CardHeader>
      
      <CardContent className="p-0 flex-grow overflow-hidden">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="h-6 w-6 text-muted-foreground animate-spin" />
          </div>
        ) : (
          <ScrollArea className="h-full max-h-[500px] p-4">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center p-4">
                <p className="text-muted-foreground">No messages yet. Be the first to send one!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 ${
                      message.sender_id === user?.id ? "flex-row-reverse" : ""
                    }`}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={message.sender?.avatar_url || ""} />
                      <AvatarFallback className="bg-primary/10 text-primary/80">
                        {message.sender?.first_name?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className={`flex flex-col max-w-[75%] ${
                      message.sender_id === user?.id ? "items-end" : "items-start"
                    }`}>
                      <div className={`px-3 py-2 rounded-lg ${
                        message.sender_id === user?.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}>
                        <p className="text-sm break-words">{message.content}</p>
                      </div>
                      <div className="flex items-center mt-1 space-x-2 text-xs text-muted-foreground">
                        <span>{`${message.sender?.first_name} ${message.sender?.last_name}`}</span>
                        <span>•</span>
                        <span>{new Date(message.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>
        )}
      </CardContent>
      
      <CardFooter className="p-3 border-t">
        <form onSubmit={handleSendMessage} className="flex w-full items-center gap-2">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            disabled={sending || !user}
            className="flex-grow"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={sending || !newMessage.trim() || !user}
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default ChatPanel;
