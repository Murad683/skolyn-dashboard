import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { WorklistFilters } from '@/components/worklist/WorklistFilters';
import { WorklistTable } from '@/components/worklist/WorklistTable';
import { useStudies } from '@/context/StudiesContext';

const Index = () => {
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-foreground">Recent Analyses</h2>
          <p className="text-muted-foreground">
            {filteredStudies.length} studies • {urgentCount} urgent • {newCount} new
          </p>
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
