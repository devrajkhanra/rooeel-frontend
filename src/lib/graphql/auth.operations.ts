export const AUTH_USER_FRAGMENT = `
  id
  email
  firstName
  lastName
  status
  createdAt
`;

export const AUTH_PAYLOAD_FRAGMENT = `
  accessToken
  refreshToken
  expiresInSeconds
  user {
    ${AUTH_USER_FRAGMENT}
  }
`;

export const LOGIN_MUTATION = `
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      ${AUTH_PAYLOAD_FRAGMENT}
    }
  }
`;

export const REGISTER_MUTATION = `
  mutation RegisterAdmin($input: RegisterAdminInput!) {
    registerAdmin(input: $input) {
      ${AUTH_PAYLOAD_FRAGMENT}
    }
  }
`;

export const REFRESH_MUTATION = `
  mutation RefreshToken($input: RefreshTokenInput!) {
    refreshToken(input: $input) {
      ${AUTH_PAYLOAD_FRAGMENT}
    }
  }
`;

export const LOGOUT_MUTATION = `
  mutation Logout($input: RefreshTokenInput!) {
    logout(input: $input)
  }
`;

export const ME_QUERY = `
  query Me {
    me {
      ${AUTH_USER_FRAGMENT}
    }
  }
`;
