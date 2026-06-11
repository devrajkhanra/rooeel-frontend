import { useState } from 'react';
import { Plus, FolderOpen, Edit, Trash2 } from 'lucide-react';
import { CreateProjectModal } from './CreateProjectModal';

interface Project {
  id: string;
  title: string;
  description?: string;
  status: string;
  stages: string;
}

export function ProjectsList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);

  const handleCreateProject = (data: { title: string; description?: string }) => {
    const newProject: Project = {
      id: Math.random().toString(36).substring(2, 9),
      title: data.title,
      description: data.description || 'No description provided.',
      status: 'TENDERING',
      stages: '0 stages',
    };
    setProjects([newProject, ...projects]);
  };

  return (
    <div className="h-full">
      <CreateProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onCreate={handleCreateProject}
      />

      {/* Header Section */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="mb-1 text-headline-lg font-semibold text-on-surface">Projects</h1>
          <p className="text-body-sm text-on-surface-variant">
            Create a project and manage its tendering phase from one controlled workspace.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex h-8 items-center gap-1.5 rounded bg-primary px-3 text-body-sm font-semibold text-on-primary transition-colors hover:bg-primary-container"
        >
          <Plus className="h-4 w-4" />
          Create project
        </button>
      </div>

      {/* Main Area: Table or Empty State */}
      <div className="rounded border border-outline-variant bg-surface-container-lowest min-h-[400px]">
        {projects.length === 0 ? (
          <div className="flex h-[400px] flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded bg-surface-container-low">
              <FolderOpen className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-label-md font-medium uppercase text-on-surface">
              No Projects Yet
            </h3>
            <p className="mb-4 max-w-sm text-body-sm text-outline">
              Start with a project title. The system will create the tendering workflow automatically.
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex h-8 items-center rounded border border-outline-variant bg-surface-container-lowest px-4 text-body-sm font-medium text-on-surface transition-colors hover:bg-surface-container-low"
            >
              Create project
            </button>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-body-sm tabular-nums">
              <thead className="border-b border-outline-variant bg-[#F1F5F9] text-label-md font-medium uppercase text-outline">
                <tr>
                  <th className="px-3 py-2">PROJECT</th>
                  <th className="px-3 py-2">STATUS</th>
                  <th className="px-3 py-2">TENDER STAGES</th>
                  <th className="px-3 py-2">DESCRIPTION</th>
                  <th className="px-3 py-2 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant text-on-surface-variant">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-surface transition-colors">
                    <td className="px-3 py-2 font-medium text-on-surface max-w-[280px]">
                      {project.title}
                    </td>
                    <td className="px-3 py-2">
                      <span className="inline-flex rounded-full bg-surface-container px-2 py-0.5 text-label-sm font-semibold text-primary">
                        {project.status}
                      </span>
                    </td>
                    <td className="px-3 py-2">{project.stages}</td>
                    <td className="px-3 py-2 max-w-[280px] truncate">
                      {project.description}
                    </td>
                    <td className="px-3 py-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="flex h-6 items-center gap-1 rounded px-2 text-label-md text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors">
                          <Edit className="h-3 w-3" />
                          Edit
                        </button>
                        <button className="flex h-6 items-center gap-1 rounded px-2 text-label-md text-error hover:bg-error-container hover:text-on-error-container transition-colors">
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}