import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { api, VitalsSubmitResponse } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Thermometer, User, Heart, Activity, TrendingUp, Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface VitalsFormProps {
  onSubmitSuccess: (data: VitalsSubmitResponse) => void;
}

const VitalsForm = ({ onSubmitSuccess }: VitalsFormProps) => {
  const { token, accountType } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [vitals, setVitals] = useState({
    age: '',
    systolic_bp: '',
    diastolic_bp: '',
    bs: '',
    body_temp: '',
    body_temp_unit: 'celsius' as 'celsius' | 'fahrenheit',
    heart_rate: '',
    patient_history: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token || !accountType) {
      toast({
        title: 'Error',
        description: 'Please login again',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      const payload = {
        vitals: {
          age: Number(vitals.age),
          systolic_bp: Number(vitals.systolic_bp),
          diastolic_bp: Number(vitals.diastolic_bp),
          bs: Number(vitals.bs),
          body_temp: Number(vitals.body_temp),
          body_temp_unit: vitals.body_temp_unit,
          heart_rate: Number(vitals.heart_rate),
          patient_history: vitals.patient_history,
        },
        account_type: accountType as 'pregnant' | 'postnatal' | 'general',
      };

      const response = await api.submitVitals(payload, token);
      onSubmitSuccess(response);
      
      toast({
        title: 'Success',
        description: 'Vitals submitted successfully',
      });

      // Reset form
      setVitals({
        age: '',
        systolic_bp: '',
        diastolic_bp: '',
        bs: '',
        body_temp: '',
        body_temp_unit: 'celsius',
        heart_rate: '',
        patient_history: '',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to submit vitals',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-3xl mx-auto shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-purple-500/5 border-b">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
            <Thermometer className="h-5 w-5 text-primary" />
          </div>
          Submit Your Vitals
        </CardTitle>
        <CardDescription className="text-base">Enter your current vital signs for AI-powered risk assessment and personalized health insights</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="age" className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Age (years)
              </Label>
              <Input
                id="age"
                type="number"
                value={vitals.age}
                onChange={(e) => setVitals({ ...vitals, age: e.target.value })}
                placeholder="e.g., 28"
                required
                className="h-11"
              />
              <p className="text-xs text-muted-foreground">Your current age</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="heart_rate" className="text-sm font-medium flex items-center gap-2">
                <Heart className="h-4 w-4 text-muted-foreground" />
                Heart Rate (bpm)
              </Label>
              <Input
                id="heart_rate"
                type="number"
                value={vitals.heart_rate}
                onChange={(e) => setVitals({ ...vitals, heart_rate: e.target.value })}
                placeholder="e.g., 75"
                required
                className="h-11"
              />
              <p className="text-xs text-muted-foreground">Normal range: 60-100 bpm</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="systolic_bp" className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                Systolic BP (mmHg)
              </Label>
              <Input
                id="systolic_bp"
                type="number"
                value={vitals.systolic_bp}
                onChange={(e) => setVitals({ ...vitals, systolic_bp: e.target.value })}
                placeholder="e.g., 120"
                required
                className="h-11"
              />
              <p className="text-xs text-muted-foreground">Upper blood pressure reading</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="diastolic_bp" className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                Diastolic BP (mmHg)
              </Label>
              <Input
                id="diastolic_bp"
                type="number"
                value={vitals.diastolic_bp}
                onChange={(e) => setVitals({ ...vitals, diastolic_bp: e.target.value })}
                placeholder="e.g., 80"
                required
                className="h-11"
              />
              <p className="text-xs text-muted-foreground">Lower blood pressure reading</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bs" className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                Blood Sugar (mmol/L)
              </Label>
              <Input
                id="bs"
                type="number"
                step="0.1"
                value={vitals.bs}
                onChange={(e) => setVitals({ ...vitals, bs: e.target.value })}
                placeholder="e.g., 5.5"
                required
                className="h-11"
              />
              <p className="text-xs text-muted-foreground">Normal range: 4.0-7.0 mmol/L</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="body_temp" className="text-sm font-medium flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-muted-foreground" />
                Body Temperature
              </Label>
              <div className="flex gap-2">
                <Input
                  id="body_temp"
                  type="number"
                  step="0.1"
                  value={vitals.body_temp}
                  onChange={(e) => setVitals({ ...vitals, body_temp: e.target.value })}
                  placeholder="e.g., 37.0"
                  required
                  className="flex-1 h-11"
                />
                <Select 
                  value={vitals.body_temp_unit} 
                  onValueChange={(value: 'celsius' | 'fahrenheit') => 
                    setVitals({ ...vitals, body_temp_unit: value })
                  }
                >
                  <SelectTrigger className="w-28 h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="celsius">°C</SelectItem>
                    <SelectItem value="fahrenheit">°F</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-xs text-muted-foreground">Normal: 36.5-37.5°C / 97.7-99.5°F</p>
            </div>
          </div>

          <Button type="submit" className="w-full h-12 text-base font-medium" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing Your Vitals...
              </>
            ) : (
              <>
                <Activity className="mr-2 h-5 w-5" />
                Submit Vitals & Get AI Analysis
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default VitalsForm;
