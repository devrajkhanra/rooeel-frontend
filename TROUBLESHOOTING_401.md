# 401 Unauthorized Error - Diagnostic Guide

## Problem
When an admin tries to create a user via `POST /user`, they receive a **401 Unauthorized** error.

## Root Cause Analysis

Based on the backend README, the `POST /user` endpoint is protected by `AdminGuard`, which requires:

1. ✅ Valid JWT token in the Authorization header
2. ✅ Token must contain `role: 'admin'`

The 401 error indicates one of these conditions is not met.

## Diagnostic Steps

### Step 1: Check Token Presence
The enhanced logs will now show whether the token is being attached:

```
[DEBUG] [ApiClient] POST /user [Auth: ✓]  ← Token is present
[DEBUG] [ApiClient] POST /user [Auth: ✗ - No token found]  ← Token is missing
```

### Step 2: Decode and Inspect Token
Use the **Token Debugger** panel (bottom-left corner):

1. Click **"Decode Token"** button
2. Check the decoded token details:
   - **Role**: Should be `'admin'` (not `'user'`)
   - **User ID (sub)**: Should match the admin ID
   - **Email**: Should match the logged-in admin email
   - **Expires At**: Should be in the future

### Step 3: Check Token Expiry
Click **"Check Expiry"** in the Token Debugger to verify the token hasn't expired.

### Step 4: Review Enhanced Error Logs
The enhanced error logging will now show:

```
[WARN] [ApiClient] 401 Unauthorized - /user {
  message: "...",
  responseData: { ... },  ← Backend error message
  headers: "Token present" or "No token"
}
```

## Common Issues & Solutions

### Issue 1: Token Missing Role Claim

**Symptom:** Token decodes successfully but doesn't have `role: 'admin'`

**Cause:** Backend might not be including the role in the JWT payload

**Solution:**
1. Check the backend JWT strategy to ensure it includes the role
2. Re-login to get a fresh token with the role claim

### Issue 2: Token Has Wrong Role

**Symptom:** Token has `role: 'user'` instead of `role: 'admin'`

**Cause:** Logged in as a user instead of an admin

**Solution:**
1. Logout
2. Login using admin credentials via `/auth/login` (not `/auth/user/login`)

### Issue 3: Token Expired

**Symptom:** Token Debugger shows "Token has expired"

**Solution:**
1. Logout and login again to get a fresh token
2. Check backend JWT expiration settings

### Issue 4: Using Wrong Login Endpoint

**Symptom:** Successfully logged in but still getting 401 on user creation

**Cause:** Used `/auth/user/login` instead of `/auth/login`

**Backend Endpoints:**
- ✅ **Admin Login**: `POST /auth/login` → Returns token with `role: 'admin'`
- ❌ **User Login**: `POST /auth/user/login` → Returns token with `role: 'user'`

**Solution:**
1. Check `auth.service.ts` - ensure using the correct endpoint
2. Verify the login page is calling `authService.login()` (admin) not `authService.userLogin()`

### Issue 5: Backend AdminGuard Not Recognizing Role

**Symptom:** Token has correct role but still getting 401

**Possible Causes:**
- Backend AdminGuard is checking for a different role format
- JWT secret mismatch between frontend and backend
- Backend guard is checking additional claims

**Solution:**
1. Check backend logs for more details
2. Verify JWT_SECRET matches between frontend and backend
3. Review backend AdminGuard implementation

## Testing Procedure

### 1. Login as Admin
```typescript
// Should use POST /auth/login
const response = await authService.login({
  email: 'admin@test.com',
  password: 'password'
});
```

### 2. Verify Token
Use Token Debugger to check:
- ✅ Role is 'admin'
- ✅ Token is not expired
- ✅ User ID matches

### 3. Check Request Logs
Look for:
```
[DEBUG] [ApiClient] POST /user [Auth: ✓]
[WARN] [ApiClient] 401 Unauthorized - /user { ... }
```

### 4. Review Backend Response
The enhanced logs will show the backend's error message in `responseData`.

## Quick Fix Checklist

- [ ] Logged in as admin (not user)
- [ ] Token contains `role: 'admin'`
- [ ] Token is not expired
- [ ] Token is being attached to requests (check logs)
- [ ] Using correct login endpoint (`/auth/login`)
- [ ] Backend is running and accessible
- [ ] Database has admin record with correct credentials

## Expected Token Structure

```json
{
  "email": "admin@test.com",
  "sub": 2,              // Admin ID
  "role": "admin",       // Must be 'admin'
  "iat": 1703334142,     // Issued at timestamp
  "exp": 1703420542      // Expiration timestamp
}
```

## Next Steps

1. **Open the application** in development mode
2. **Login as an admin**
3. **Use Token Debugger** (bottom-left panel) to decode the token
4. **Check the role** - it should say `admin` in green
5. **Try creating a user** and watch the enhanced logs
6. **Check the error details** in the logs

If the token has the correct role and is not expired, but you're still getting 401:
- The issue is likely on the backend (AdminGuard configuration)
- Check backend logs for more details
- Verify the backend AdminGuard is correctly checking `user.role === 'admin'`

## Log Examples

### Successful Request (Expected)
```
[DEBUG] [ApiClient] POST /user [Auth: ✓]
[INFO] [UserService] Creating new user {"email":"newuser@test.com"}
[DEBUG] [ApiClient] POST /user - 201
[INFO] [UserService] User created successfully {"userId":5,"email":"newuser@test.com"}
```

### Failed Request (Current Issue)
```
[DEBUG] [ApiClient] POST /user [Auth: ✓]
[WARN] [ApiClient] 401 Unauthorized - /user {
  "message": "Request failed with status code 401",
  "responseData": { "message": "Forbidden resource", "statusCode": 403 },
  "headers": "Token present"
}
[WARN] [ApiClient] Redirecting to login and clearing auth data
```

## Additional Resources

- Backend README: Check authentication guards section
- `src/services/auth.service.ts`: Review login implementation
- `src/services/api.client.ts`: Enhanced request/response logging
- `src/components/TokenDebugger.tsx`: Token inspection tool
