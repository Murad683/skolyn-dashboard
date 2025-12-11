import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { WorklistFilters } from '@/components/worklist/WorklistFilters';
import { WorklistTable } from '@/components/worklist/WorklistTable';
import { useStudies } from '@/context/StudiesContext';
import { Button } from '@/components/ui/button';
import { Upload, FileSearch } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { studies } = useStudies();
  const [statusFilter, setStatusFilter] = useState('All');
  const [modalityFilter, setModalityFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudy, setSelectedStudy] = useState<string | null>(null);

  const filteredStudies = useMemo(() => {
    return studies.filter((study) => {
      if (statusFilter !== 'All' && study.status !== statusFilter) return false;
      if (modalityFilter !== 'All' && study.modality !== modalityFilter) return false;
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !study.patientId.toLowerCase().includes(query) &&
          !study.patientName.toLowerCase().includes(query)
        ) {
          return false;
        }
      }
      
      return true;
    });
  }, [studies, statusFilter, modalityFilter, searchQuery]);

  const urgentCount = studies.filter(s => s.priority === 'Urgent').length;
  const newCount = studies.filter(s => s.status === 'New').length;

  // Empty state
  if (studies.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-6">
            <FileSearch className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">No analyses yet</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Upload your first medical image to get started with AI-powered analysis.
          </p>
          <Button onClick={() => navigate('/')} className="gap-2">
            <Upload className="w-4 h-4" />
            Start New Analysis
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Recent Analyses</h2>
            <p className="text-muted-foreground mt-1">
              {filteredStudies.length} studies • {urgentCount} urgent • {newCount} new
            </p>
          </div>
        </div>

        {/* Filters */}
        <WorklistFilters
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          modalityFilter={modalityFilter}
          setModalityFilter={setModalityFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Table */}
        <WorklistTable
          studies={filteredStudies}
          selectedStudy={selectedStudy}
          onSelectStudy={setSelectedStudy}
        />
      </div>
    </DashboardLayout>
  );
};

export default Index;
