export const ADMIN_USER_FRAGMENT = `
  id
  email
  firstName
  lastName
  status
  createdAt
  updatedAt
`;

export const ADMIN_USERS_QUERY = `
  query AdminUsers($take: Float, $cursor: String) {
    adminUsers(take: $take, cursor: $cursor) {
      ${ADMIN_USER_FRAGMENT}
    }
  }
`;

export const CREATE_ADMIN_USER_MUTATION = `
  mutation CreateAdminUser($input: CreateAdminUserInput!) {
    createAdminUser(input: $input) {
      ${ADMIN_USER_FRAGMENT}
    }
  }
`;

export const UPDATE_ADMIN_USER_MUTATION = `
  mutation UpdateAdminUser($input: UpdateAdminUserInput!) {
    updateAdminUser(input: $input) {
      ${ADMIN_USER_FRAGMENT}
    }
  }
`;

export const DELETE_ADMIN_USER_MUTATION = `
  mutation DeleteAdminUser($userId: String!) {
    deleteAdminUser(userId: $userId)
  }
`;
