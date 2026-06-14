export type ProjectStatus = 'TENDERING';
export type ProjectModuleType = 'TENDERING';
export type ProjectModuleStatus = 'ACTIVE' | 'ARCHIVED';

export interface ProjectConfiguration {
  id: string;
  projectId: string;
  notes?: string;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectModule {
  id: string;
  projectId: string;
  type: ProjectModuleType;
  name: string;
  description?: string;
  status: ProjectModuleStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  configuration?: ProjectConfiguration;
  modules: ProjectModule[];
  tenderStageCount: number;
  createdAt: string;
  updatedAt: string;
}
