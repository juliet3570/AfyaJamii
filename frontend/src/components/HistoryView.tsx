import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { api, VitalsResponse, ConversationResponse } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Activity, MessageCircle, Loader2 } from 'lucide-react';

const HistoryView = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [vitalsHistory, setVitalsHistory] = useState<VitalsResponse[]>([]);
  const [chatHistory, setChatHistory] = useState<ConversationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    if (!token) return;

    try {
      setIsLoading(true);
      const [vitals, chats] = await Promise.all([
        api.getVitalsHistory(token, 10),
        api.getConversationsHistory(token, 10),
      ]);
      setVitalsHistory(vitals);
      setChatHistory(chats);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load history',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    const riskLower = risk.toLowerCase();
    if (riskLower.includes('high')) return 'bg-destructive text-destructive-foreground';
    if (riskLower.includes('medium') || riskLower.includes('moderate')) return 'bg-warning text-warning-foreground';
    return 'bg-success text-success-foreground';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatText = (text: string) => {
    const parts = text.split('**');
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index}>{part}</strong>;
      }
      return part;
    });
  };

  return (
    <Card className="max-w-5xl mx-auto shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-purple-500/5 border-b">
        <CardTitle className="text-2xl">Your Health History</CardTitle>
        <CardDescription className="text-base">View your past vitals submissions and AI conversations to track your health journey</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs defaultValue="vitals">
          <TabsList className="grid w-full grid-cols-2 h-12 max-w-md mx-auto">
            <TabsTrigger value="vitals" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Activity className="h-4 w-4" />
              Vitals History
            </TabsTrigger>
            <TabsTrigger value="conversations" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <MessageCircle className="h-4 w-4" />
              Conversations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vitals" className="mt-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading your health history...</p>
              </div>
            ) : vitalsHistory.length === 0 ? (
              <div className="text-center py-16">
                <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No Vitals History Yet</h3>
                <p className="text-muted-foreground">Submit your first vitals assessment to start tracking your health!</p>
              </div>
            ) : (
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {vitalsHistory.map((record, index) => (
                    <Card key={record.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                              <Activity className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-base font-semibold">
                                {formatDate(record.created_at)}
                              </CardTitle>
                              <CardDescription className="text-xs mt-1">
                                Record #{record.id} • {index === 0 ? 'Latest' : `${index + 1} records ago`}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge className={`${getRiskColor(record.ml_risk_label)} text-sm px-3 py-1`}>
                            {record.ml_risk_label}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          <div className="bg-muted/50 p-3 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">Age</p>
                            <p className="font-semibold">{record.age} years</p>
                          </div>
                          <div className="bg-muted/50 p-3 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">Blood Pressure</p>
                            <p className="font-semibold">{record.systolic_bp}/{record.diastolic_bp} mmHg</p>
                          </div>
                          <div className="bg-muted/50 p-3 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">Heart Rate</p>
                            <p className="font-semibold">{record.heart_rate} bpm</p>
                          </div>
                          <div className="bg-muted/50 p-3 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">Blood Sugar</p>
                            <p className="font-semibold">{record.bs} mmol/L</p>
                          </div>
                          <div className="bg-muted/50 p-3 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">Temperature</p>
                            <p className="font-semibold">{record.body_temp}°{record.body_temp_unit === 'celsius' ? 'C' : 'F'}</p>
                          </div>
                          <div className="bg-muted/50 p-3 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">Risk Probability</p>
                            <p className="font-semibold">{(record.ml_probability * 100).toFixed(1)}%</p>
                          </div>
                        </div>
                        {record.patient_history && (
                          <div className="pt-3 border-t">
                            <p className="text-xs text-muted-foreground mb-2 font-medium">Medical History:</p>
                            <p className="text-sm bg-muted/30 p-3 rounded-lg">{record.patient_history}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>

          <TabsContent value="conversations" className="mt-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading your conversations...</p>
              </div>
            ) : chatHistory.length === 0 ? (
              <div className="text-center py-16">
                <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No Conversations Yet</h3>
                <p className="text-muted-foreground">Start chatting with our AI assistant to get personalized health advice!</p>
              </div>
            ) : (
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {chatHistory.map((conversation, index) => (
                    <Card key={conversation.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-green-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <MessageCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <CardTitle className="text-base font-semibold">
                              {formatDate(conversation.created_at)}
                            </CardTitle>
                            <CardDescription className="text-xs mt-1">
                              Conversation #{conversation.id} • {index === 0 ? 'Latest' : `${index + 1} conversations ago`}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                          <div className="flex items-start gap-2 mb-2">
                            <div className="h-6 w-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-white text-xs font-bold">You</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-muted-foreground mb-1 font-medium">Your Question:</p>
                              <p className="text-sm font-medium leading-relaxed">{conversation.user_message}</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/10 rounded-xl p-4 border border-green-200 dark:border-green-800">
                          <div className="flex items-start gap-2 mb-2">
                            <div className="h-6 w-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-white text-xs">🤖</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-muted-foreground mb-1 font-medium">AI Response:</p>
                              <p className="text-sm whitespace-pre-wrap leading-relaxed">
                                {formatText(conversation.ai_response)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default HistoryView;
