import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, MessageCircle, Shield, Heart, Star, Users, Clock, CheckCircle, ArrowRight, Smartphone, Brain, TrendingUp } from 'lucide-react';
import logo from '@/assets/logo.png';

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="AfyaJamii" className="h-10 w-10" />
            <span className="text-xl font-bold">AfyaJamii</span>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost">
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-blue-950/40 dark:via-purple-950/40 dark:to-pink-950/40">
        {/* Animated Gradient Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5Q0EzQUYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItMnptMC00djJoLTJ2LTJoMnptMC00di0yaDJ2MmgtMnptMC00di0yaDJ2MmgtMnptMC00di0yaDJ2MmgtMnptLTQgMTZ2LTJoMnYyaC0yem0wLTR2LTJoMnYyaC0yem0wLTR2LTJoMnYyaC0yem0wLTR2LTJoMnYyaC0yem0wLTR2LTJoMnYyaC0yem0tNCA0djJoLTJ2LTJoMnptMCA0djJoLTJ2LTJoMnptMCA0djJoLTJ2LTJoMnptMCA0djJoLTJ2LTJoMnptLTQtMTZ2MmgtMnYtMmgyem0wIDR2MmgtMnYtMmgyem0wIDR2MmgtMnYtMmgyem0wIDR2MmgtMnYtMmgyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        <div className="container mx-auto px-4 py-20 lg:py-32 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit px-4 py-1.5 text-sm">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  AI-Powered Healthcare
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                  Your AI Health
                  <span className="text-primary block bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Companion</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
                  Advanced maternal health monitoring with personalized AI insights, real-time risk assessment, and 24/7 expert guidance for your pregnancy journey.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="text-lg px-8">
                  <Link to="/signup">
                    Start Your Journey
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8">
                  <Link to="/login">Sign In</Link>
                </Button>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">10K+</div>
                  <div className="text-sm text-muted-foreground">Happy Mothers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">99.9%</div>
                  <div className="text-sm text-muted-foreground">Accuracy Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">24/7</div>
                  <div className="text-sm text-muted-foreground">AI Support</div>
                </div>
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="relative z-10 bg-gradient-to-br from-white via-blue-50/50 to-purple-50/50 dark:from-card dark:via-blue-950/20 dark:to-purple-950/20 rounded-3xl shadow-2xl p-16 border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-purple-500/5 to-pink-500/5 rounded-3xl"></div>
                <img src={logo} alt="AfyaJamii" className="h-48 w-48 mx-auto relative z-10" />
              </div>
              
              {/* Floating elements with animation */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-br from-primary to-blue-600 text-primary-foreground p-4 rounded-full shadow-xl animate-bounce">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-gradient-to-br from-green-500 to-emerald-600 text-white p-4 rounded-full shadow-xl animate-pulse">
                <Shield className="h-6 w-6" />
              </div>
              <div className="absolute top-1/2 -left-8 bg-gradient-to-br from-purple-500 to-pink-600 text-white p-3 rounded-full shadow-lg animate-pulse" style={{ animationDelay: '1s' }}>
                <Heart className="h-5 w-5" />
              </div>
              <div className="absolute top-1/4 -right-8 bg-gradient-to-br from-blue-500 to-cyan-600 text-white p-3 rounded-full shadow-lg animate-bounce" style={{ animationDelay: '0.5s' }}>
                <Activity className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-background via-blue-50/30 to-background dark:from-background dark:via-blue-950/10 dark:to-background">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="mx-auto w-fit px-4 py-1.5">
              <Heart className="h-3 w-3 mr-1" />
              Our Features
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold">Comprehensive Maternal Care</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Everything you need for a healthy pregnancy and postnatal journey, powered by advanced AI technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="relative overflow-hidden group hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 hover:border-blue-200 dark:hover:border-blue-800">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
              <CardHeader>
                <div className="h-14 w-14 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Activity className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-lg">Smart Vitals Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Track blood pressure, heart rate, temperature, and more with AI-powered risk assessment and instant alerts for any concerns.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 hover:border-green-200 dark:hover:border-green-800">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
              <CardHeader>
                <div className="h-14 w-14 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/20 dark:to-green-800/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <MessageCircle className="h-7 w-7 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-lg">24/7 AI Health Chat</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Get instant answers to health questions, nutrition advice, and personalized recommendations from our AI assistant anytime.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 hover:border-red-200 dark:hover:border-red-800">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
              <CardHeader>
                <div className="h-14 w-14 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/20 dark:to-red-800/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="h-7 w-7 text-red-600 dark:text-red-400" />
                </div>
                <CardTitle className="text-lg">Predictive Risk Detection</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Advanced machine learning algorithms analyze your data to identify potential health risks before they become serious.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 hover:border-purple-200 dark:hover:border-purple-800">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
              <CardHeader>
                <div className="h-14 w-14 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Heart className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-lg">Personalized Care Plans</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Receive tailored health recommendations, nutrition plans, and exercise routines based on your unique pregnancy stage.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-blue-50/50 dark:from-purple-950/10 dark:via-pink-950/5 dark:to-blue-950/10">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold">How AfyaJamii Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple steps to start your AI-powered health journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="h-16 w-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold">Sign Up & Setup</h3>
              <p className="text-muted-foreground">
                Create your account and complete your health profile with pregnancy stage and medical history.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="h-16 w-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold">Track Your Vitals</h3>
              <p className="text-muted-foreground">
                Record your daily health metrics and receive instant AI analysis with personalized insights.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="h-16 w-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold">Get AI Guidance</h3>
              <p className="text-muted-foreground">
                Receive personalized recommendations, health alerts, and 24/7 support from our AI assistant.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-b from-background via-green-50/20 to-background dark:from-background dark:via-green-950/10 dark:to-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl lg:text-4xl font-bold">Why Choose AfyaJamii?</h2>
                <p className="text-xl text-muted-foreground">
                  Advanced AI technology meets compassionate maternal care
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="h-8 w-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Clinically Validated AI</h3>
                    <p className="text-muted-foreground">Our AI models are trained on extensive medical data and validated by healthcare professionals.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Smartphone className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Easy to Use</h3>
                    <p className="text-muted-foreground">Intuitive interface designed for expectant mothers with simple, clear navigation.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="h-8 w-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Continuous Improvement</h3>
                    <p className="text-muted-foreground">Our AI learns from your data to provide increasingly personalized and accurate insights.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="h-8 w-8 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Privacy & Security</h3>
                    <p className="text-muted-foreground">Your health data is encrypted and protected with enterprise-grade security measures.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-card p-4 rounded-lg shadow-sm">
                    <Users className="h-8 w-8 text-primary mb-2" />
                    <div className="text-2xl font-bold">10,000+</div>
                    <div className="text-sm text-muted-foreground">Active Users</div>
                  </div>
                  <div className="bg-white dark:bg-card p-4 rounded-lg shadow-sm">
                    <Clock className="h-8 w-8 text-green-600 mb-2" />
                    <div className="text-2xl font-bold">24/7</div>
                    <div className="text-sm text-muted-foreground">AI Support</div>
                  </div>
                  <div className="bg-white dark:bg-card p-4 rounded-lg shadow-sm">
                    <TrendingUp className="h-8 w-8 text-blue-600 mb-2" />
                    <div className="text-2xl font-bold">99.9%</div>
                    <div className="text-sm text-muted-foreground">Accuracy</div>
                  </div>
                  <div className="bg-white dark:bg-card p-4 rounded-lg shadow-sm">
                    <Star className="h-8 w-8 text-yellow-500 mb-2" />
                    <div className="text-2xl font-bold">4.9/5</div>
                    <div className="text-sm text-muted-foreground">User Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-950 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <img src={logo} alt="AfyaJamii" className="h-8 w-8" />
                <span className="text-lg font-bold">AfyaJamii</span>
              </div>
              <p className="text-muted-foreground">
                AI-powered maternal health platform providing personalized care and insights for expectant mothers.
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold">Product</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>Features</div>
                <div>Pricing</div>
                <div>Security</div>
                <div>API</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold">Support</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>Help Center</div>
                <div>Contact Us</div>
                <div>Privacy Policy</div>
                <div>Terms of Service</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold">Company</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>About Us</div>
                <div>Blog</div>
                <div>Careers</div>
                <div>Press</div>
              </div>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} AfyaJamii. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
