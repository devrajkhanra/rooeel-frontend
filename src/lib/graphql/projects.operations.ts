export const PROJECT_FRAGMENT = `
  id
  name
  description
  status
  tenderStageCount
  createdAt
  updatedAt
  configuration {
    id
    projectId
    notes
    metadata
    createdAt
    updatedAt
  }
  modules {
    id
    projectId
    type
    name
    description
    status
    createdAt
    updatedAt
  }
`;

export const PROJECT_MODULE_FRAGMENT = `
  id
  projectId
  type
  name
  description
  status
  createdAt
  updatedAt
`;

export const MY_PROJECTS_QUERY = `
  query MyProjects {
    myProjects {
      ${PROJECT_FRAGMENT}
    }
  }
`;

export const ACTIVE_PROJECT_QUERY = `
  query ActiveProject {
    activeProject {
      ${PROJECT_FRAGMENT}
    }
  }
`;

export const CREATE_PROJECT_MUTATION = `
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
      ${PROJECT_FRAGMENT}
    }
  }
`;

export const UPDATE_PROJECT_MUTATION = `
  mutation UpdateProject($input: UpdateProjectInput!) {
    updateProject(input: $input) {
      ${PROJECT_FRAGMENT}
    }
  }
`;

export const DELETE_PROJECT_MUTATION = `
  mutation DeleteProject {
    deleteProject
  }
`;

export const PROJECT_MODULES_QUERY = `
  query ProjectModules($includeArchived: Boolean) {
    projectModules(includeArchived: $includeArchived) {
      ${PROJECT_MODULE_FRAGMENT}
    }
  }
`;

export const CREATE_PROJECT_MODULE_MUTATION = `
  mutation CreateProjectModule($input: CreateProjectModuleInput!) {
    createProjectModule(input: $input) {
      ${PROJECT_MODULE_FRAGMENT}
    }
  }
`;

export const UPDATE_PROJECT_MODULE_MUTATION = `
  mutation UpdateProjectModule($input: UpdateProjectModuleInput!) {
    updateProjectModule(input: $input) {
      ${PROJECT_MODULE_FRAGMENT}
    }
  }
`;

export const DELETE_PROJECT_MODULE_MUTATION = `
  mutation DeleteProjectModule($moduleId: String!) {
    deleteProjectModule(moduleId: $moduleId)
  }
`;

export const UPDATE_PROJECT_CONFIGURATION_MUTATION = `
  mutation UpdateProjectConfiguration($input: UpdateProjectConfigurationInput!) {
    updateProjectConfiguration(input: $input) {
      id
      projectId
      notes
      metadata
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_PROJECT_CONFIGURATION_MUTATION = `
  mutation DeleteProjectConfiguration {
    deleteProjectConfiguration
  }
`;
