import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import VitalsForm from '@/components/VitalsForm';
import RiskAssessment from '@/components/RiskAssessment';
import ChatInterface from '@/components/ChatInterface';
import HistoryView from '@/components/HistoryView';
import type { VitalsSubmitResponse } from '@/lib/api';
import { LogOut, Activity, MessageCircle, History, Bell, Settings } from 'lucide-react';
import logo from '@/assets/logo.png';

const Dashboard = () => {
  const { username, logout } = useAuth();
  const navigate = useNavigate();
  const [latestAssessment, setLatestAssessment] = useState<VitalsSubmitResponse | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleVitalsSubmit = (data: VitalsSubmitResponse) => {
    setLatestAssessment(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-pink-950/20">
      {/* Enhanced Header */}
      <header className="border-b bg-gradient-to-r from-white/90 via-blue-50/80 to-purple-50/80 dark:from-card/90 dark:via-blue-950/50 dark:to-purple-950/50 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={logo} alt="AfyaJamii" className="h-10 w-10" />
              <div>
                <h1 className="text-xl font-bold">AfyaJamii</h1>
                <p className="text-xs text-muted-foreground">Welcome back, {username}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="vitals" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto h-12">
            <TabsTrigger value="vitals" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Vitals</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">AI Chat</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">History</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vitals" className="space-y-6">
            <VitalsForm onSubmitSuccess={handleVitalsSubmit} />
            {latestAssessment && <RiskAssessment data={latestAssessment} />}
          </TabsContent>

          <TabsContent value="chat">
            <ChatInterface />
          </TabsContent>

          <TabsContent value="history">
            <HistoryView />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
