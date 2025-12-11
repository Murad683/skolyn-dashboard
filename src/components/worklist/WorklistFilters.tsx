import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface WorklistFiltersProps {
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  modalityFilter: string;
  setModalityFilter: (modality: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const statusOptions = ['All', 'New', 'AI Analyzed', 'In Review', 'Finalized'];
const modalityOptions = ['All', 'X-ray', 'CT', 'MRI'];

export function WorklistFilters({
  statusFilter,
  setStatusFilter,
  modalityFilter,
  setModalityFilter,
  searchQuery,
  setSearchQuery,
}: WorklistFiltersProps) {
  return (
    <div className="bg-card rounded-xl p-4 shadow-soft border border-border/30 space-y-4">
      {/* Search and Quick Filters Row */}
      <div className="flex flex-col gap-4">
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

        {/* Filter Groups - Responsive */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Status Filter - Mobile: Dropdown, Desktop: Pills */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Status:</span>
            
            {/* Mobile Dropdown */}
            <div className="block md:hidden flex-1">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Desktop Pills */}
            <div className="hidden md:flex bg-muted rounded-lg p-0.5">
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

          {/* Modality Filter - Mobile: Dropdown, Desktop: Pills */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Modality:</span>
            
            {/* Mobile Dropdown */}
            <div className="block md:hidden flex-1">
              <Select value={modalityFilter} onValueChange={setModalityFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {modalityOptions.map((modality) => (
                    <SelectItem key={modality} value={modality}>
                      {modality}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Desktop Pills */}
            <div className="hidden md:flex bg-muted rounded-lg p-0.5">
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
