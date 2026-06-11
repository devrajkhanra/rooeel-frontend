export type ProjectStatus = 'TENDERING';

export interface ProjectConfiguration {
  id: string;
  projectId: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  configuration?: ProjectConfiguration;
  tenderStageCount: number;
  createdAt: string;
  updatedAt: string;
}
