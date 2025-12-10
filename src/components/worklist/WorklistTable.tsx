import { useNavigate } from 'react-router-dom';
import { Study } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Calendar, User, Scan as ScanIcon } from 'lucide-react';

interface WorklistTableProps {
  studies: Study[];
  selectedStudy: string | null;
  onSelectStudy: (id: string) => void;
}

export function WorklistTable({ studies, selectedStudy, onSelectStudy }: WorklistTableProps) {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusVariant = (status: Study['status']) => {
    switch (status) {
      case 'New': return 'new';
      case 'AI Analyzing': return 'review';
      case 'AI Analyzed': return 'analyzed';
      case 'In Review': return 'review';
      case 'Finalized': return 'finalized';
      default: return 'neutral';
    }
  };

  const getPriorityVariant = (priority: Study['priority']) => {
    return priority === 'Urgent' ? 'urgent' : 'neutral';
  };

  const handleRowClick = (study: Study) => {
    onSelectStudy(study.id);
    navigate(`/viewer/${study.id}`);
  };

  return (
    <div className="bg-card rounded-xl shadow-soft border border-border/30 overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Patient ID
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Name
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Age / Gender
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Modality
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Date & Time
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Priority
              </th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {studies.map((study) => (
              <tr
                key={study.id}
                onClick={() => handleRowClick(study)}
                className={cn(
                  "cursor-pointer transition-all duration-200",
                  selectedStudy === study.id
                    ? "bg-secondary/10"
                    : "hover:bg-muted/50"
                )}
              >
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-foreground">{study.patientId}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-foreground">{study.patientName}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-muted-foreground">
                    {study.age}y / {study.gender}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="info">{study.modality}</Badge>
                    <span className="text-sm text-muted-foreground">{study.bodyRegion}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-muted-foreground">{formatDate(study.dateTime)}</span>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={getPriorityVariant(study.priority)}>{study.priority}</Badge>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={getStatusVariant(study.status)}>{study.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden divide-y divide-border">
        {studies.map((study) => (
          <div
            key={study.id}
            onClick={() => handleRowClick(study)}
            className={cn(
              "p-4 cursor-pointer transition-all duration-200",
              selectedStudy === study.id
                ? "bg-secondary/10"
                : "hover:bg-muted/50"
            )}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-medium text-foreground">{study.patientName}</p>
                <p className="text-sm text-muted-foreground">{study.patientId}</p>
              </div>
              <div className="flex gap-2">
                <Badge variant={getPriorityVariant(study.priority)}>{study.priority}</Badge>
                <Badge variant={getStatusVariant(study.status)}>{study.status}</Badge>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span>{study.age}y / {study.gender}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ScanIcon className="w-3.5 h-3.5" />
                <span>{study.modality} – {study.bodyRegion}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDate(study.dateTime)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {studies.length === 0 && (
        <div className="p-12 text-center">
          <p className="text-muted-foreground">No studies found matching your criteria</p>
        </div>
      )}
    </div>
  );
}
