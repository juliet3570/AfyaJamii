import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { VitalsSubmitResponse } from '@/lib/api';
import { AlertCircle, CheckCircle, AlertTriangle, Activity } from 'lucide-react';

interface RiskAssessmentProps {
  data: VitalsSubmitResponse;
}

const RiskAssessment = ({ data }: RiskAssessmentProps) => {
  const getRiskColor = (risk: string) => {
    const riskLower = risk.toLowerCase();
    if (riskLower.includes('high')) return 'bg-destructive text-destructive-foreground';
    if (riskLower.includes('medium') || riskLower.includes('moderate')) return 'bg-warning text-warning-foreground';
    return 'bg-success text-success-foreground';
  };

  const getRiskIcon = (risk: string) => {
    const riskLower = risk.toLowerCase();
    if (riskLower.includes('high')) return <AlertCircle className="h-4 w-4" />;
    if (riskLower.includes('medium') || riskLower.includes('moderate')) return <AlertTriangle className="h-4 w-4" />;
    return <CheckCircle className="h-4 w-4" />;
  };

  // Format advice text to render bold text
  const formatAdvice = (text: string) => {
    const parts = text.split('**');
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index}>{part}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="shadow-lg border-2">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-purple-500/5 border-b">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            Risk Assessment Results
          </CardTitle>
          <CardDescription className="text-base">AI-powered analysis of your vital signs with personalized insights</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border-2 border-primary/20">
              <p className="text-sm text-muted-foreground mb-2 font-medium">Risk Level</p>
              <Badge className={`${getRiskColor(data.ml_output.risk_label)} flex items-center gap-2 w-fit text-base px-4 py-2`}>
                {getRiskIcon(data.ml_output.risk_label)}
                {data.ml_output.risk_label}
              </Badge>
              <p className="text-xs text-muted-foreground mt-3">Based on your submitted vitals</p>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10 rounded-xl border-2 border-blue-200 dark:border-blue-800">
              <p className="text-sm text-muted-foreground mb-2 font-medium">AI Confidence</p>
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{(data.ml_output.probability * 100).toFixed(1)}</p>
                <span className="text-xl text-blue-600 dark:text-blue-400">%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-3">Model prediction accuracy</p>
            </div>
          </div>

          {data.ml_output.feature_importances && Object.keys(data.ml_output.feature_importances).length > 0 && (
            <div className="p-6 bg-muted/30 rounded-xl border">
              <h4 className="font-semibold mb-4 text-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                Key Health Indicators
              </h4>
              <p className="text-sm text-muted-foreground mb-4">These factors had the most influence on your risk assessment</p>
              <div className="space-y-4">
                {Object.entries(data.ml_output.feature_importances)
                  .sort(([, a], [, b]) => (b as number) - (a as number))
                  .map(([feature, importance]) => (
                    <div key={feature} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium capitalize">{feature.replace(/_/g, ' ')}</span>
                        <span className="text-sm font-semibold text-primary">
                          {((importance as number) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-3 bg-secondary rounded-full overflow-hidden shadow-inner">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-500 ease-out rounded-full"
                          style={{ width: `${(importance as number) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg border-2 border-green-200 dark:border-green-800">
        <CardHeader className="bg-gradient-to-r from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/10 border-b">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <div className="h-10 w-10 bg-green-500/10 rounded-full flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            AI Health Advice
          </CardTitle>
          <CardDescription className="text-base">Personalized recommendations based on your vitals and health profile</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="prose prose-sm max-w-none">
            <div className="bg-gradient-to-br from-white to-green-50/30 dark:from-card dark:to-green-950/10 p-6 rounded-xl border text-base leading-relaxed whitespace-pre-wrap">
              {formatAdvice(data.llm_advice.advice)}
            </div>
          </div>
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span><strong>Note:</strong> This advice is AI-generated. Always consult with your healthcare provider for medical decisions.</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskAssessment;
