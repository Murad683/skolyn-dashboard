import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface WorklistFiltersProps {
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  priorityFilter: string;
  setPriorityFilter: (priority: string) => void;
  modalityFilter: string;
  setModalityFilter: (modality: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const statusOptions = ['All', 'New', 'AI Analyzed', 'In Review', 'Finalized'];
const priorityOptions = ['All', 'Urgent'];
const modalityOptions = ['All', 'X-ray', 'CT', 'MRI'];

export function WorklistFilters({
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  modalityFilter,
  setModalityFilter,
  searchQuery,
  setSearchQuery,
}: WorklistFiltersProps) {
  return (
    <div className="bg-card rounded-xl p-4 shadow-soft border border-border/30 space-y-4">
      {/* Search and Quick Filters Row */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by patient ID or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-background border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          />
        </div>

        {/* Filter Groups */}
        <div className="flex flex-wrap gap-4">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Status:</span>
            <div className="flex bg-muted rounded-lg p-0.5">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                    statusFilter === status
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Priority:</span>
            <div className="flex bg-muted rounded-lg p-0.5">
              {priorityOptions.map((priority) => (
                <button
                  key={priority}
                  onClick={() => setPriorityFilter(priority)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                    priorityFilter === priority
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>

          {/* Modality Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Modality:</span>
            <div className="flex bg-muted rounded-lg p-0.5">
              {modalityOptions.map((modality) => (
                <button
                  key={modality}
                  onClick={() => setModalityFilter(modality)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                    modalityFilter === modality
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {modality}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
