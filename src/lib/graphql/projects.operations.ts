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
  }
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
