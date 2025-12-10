import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { MessageSquare, ThumbsUp, ThumbsDown, Send } from 'lucide-react';

interface FeedbackCardProps {
  selection: 'agree' | 'disagree' | null;
  note: string;
  onSelectionChange: (selection: 'agree' | 'disagree' | null) => void;
  onNoteChange: (note: string) => void;
}

export function FeedbackCard({
  selection,
  note,
  onSelectionChange,
  onNoteChange,
}: FeedbackCardProps) {

  const handleSubmit = () => {
    if (!selection) {
      toast.error('Please select Agree or Disagree first');
      return;
    }
    
    toast.success('Feedback sent to model training', {
      description: `Your ${selection === 'agree' ? 'agreement' : 'disagreement'} has been recorded.`,
    });
    
    // Reset after submission
    onSelectionChange(null);
    onNoteChange('');
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
          variant={selection === 'agree' ? 'secondary' : 'outline'}
          className={cn(
            "flex-1 gap-2",
            selection === 'agree' && "shadow-glow"
          )}
          onClick={() => onSelectionChange('agree')}
        >
          <ThumbsUp className="w-4 h-4" />
          Agree with AI
        </Button>
        <Button
          variant={selection === 'disagree' ? 'destructive' : 'outline'}
          className="flex-1 gap-2"
          onClick={() => onSelectionChange('disagree')}
        >
          <ThumbsDown className="w-4 h-4" />
          Disagree with AI
        </Button>
      </div>

      {/* Note Input */}
      <Textarea
        placeholder="Add a note or correction..."
        value={note}
        onChange={(e) => onNoteChange(e.target.value)}
        className="mb-4 min-h-[80px] resize-none"
      />

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleSubmit}
          className="gap-2"
        >
          <Send className="w-3.5 h-3.5" />
          Send feedback to model training
        </Button>
      </div>
    </div>
  );
}
