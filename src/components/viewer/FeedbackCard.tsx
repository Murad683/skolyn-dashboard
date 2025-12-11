import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { MessageSquare, ThumbsUp, ThumbsDown, Send, FileText } from 'lucide-react';

interface FeedbackCardProps {
  onGenerateReport?: (feedbackType: 'agree' | 'disagree' | null) => void;
}

export function FeedbackCard({ onGenerateReport }: FeedbackCardProps) {
  const [feedback, setFeedback] = useState<'agree' | 'disagree' | null>(null);
  const [note, setNote] = useState('');

  const handleSubmit = () => {
    if (!feedback) {
      toast.error('Please select Agree or Disagree first');
      return;
    }
    
    toast.success('Feedback sent to model training', {
      description: `Your ${feedback === 'agree' ? 'agreement' : 'disagreement'} has been recorded.`,
    });
  };

  const handleGenerateReport = () => {
    if (!feedback) {
      toast.error('Please provide feedback before generating report');
      return;
    }
    onGenerateReport?.(feedback);
  };

  return (
    <div className="bg-card rounded-xl shadow-soft border border-border/30 p-5 animate-slide-in-right" style={{ animationDelay: '200ms' }}>
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-5 h-5 text-secondary" />
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          Radiologist Feedback
        </h3>
      </div>

      {/* Agreement Buttons */}
      <div className="flex gap-3 mb-4">
        <Button
          variant={feedback === 'agree' ? 'secondary' : 'outline'}
          className={cn(
            "flex-1 gap-2",
            feedback === 'agree' && "shadow-glow"
          )}
          onClick={() => setFeedback('agree')}
        >
          <ThumbsUp className="w-4 h-4" />
          Agree with AI
        </Button>
        <Button
          variant={feedback === 'disagree' ? 'destructive' : 'outline'}
          className="flex-1 gap-2"
          onClick={() => setFeedback('disagree')}
        >
          <ThumbsDown className="w-4 h-4" />
          Disagree with AI
        </Button>
      </div>

      {/* Note Input */}
      <Textarea
        placeholder="Add a note or correction..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="mb-4 min-h-[80px] resize-none"
      />

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSubmit}
          className="gap-2 w-full"
          disabled={!feedback}
        >
          <Send className="w-3.5 h-3.5" />
          Send feedback to model training
        </Button>
        
        <Button
          variant="default"
          onClick={handleGenerateReport}
          className="gap-2 w-full"
          disabled={!feedback}
        >
          <FileText className="w-4 h-4" />
          Generate Report
        </Button>
      </div>
    </div>
  );
}
