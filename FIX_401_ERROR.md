# 401 Error - Root Cause & Fix

## 🐛 **Root Cause Identified**

The 401 Unauthorized error was caused by a **localStorage key conflict** between Zustand and the auth service.

### What Was Happening

1. **Zustand persist middleware** was storing the entire auth store state under the key `auth_token`:
   ```json
   {
     "state": {
       "user": {...},
       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
       "isAuthenticated": true
     }
   }
   ```

2. **API Client** was trying to read `auth_token` expecting just the JWT string:
   ```typescript
   const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
   config.headers.Authorization = `Bearer ${token}`;
   ```

3. **Result**: The Authorization header contained the entire JSON object instead of just the JWT token, causing the backend to reject all requests with 401 Unauthorized.

## ✅ **Fix Applied**

Changed the Zustand storage key from `auth_token` to `auth_store` to avoid the conflict:

```typescript
// Before (WRONG)
{
  name: STORAGE_KEYS.AUTH_TOKEN,  // Overwrites the token!
}

// After (CORRECT)
{
  name: 'auth_store',  // Separate storage key
}
```

## 🔧 **What You Need to Do**

### Step 1: Clear Old Data
The old corrupted data is still in localStorage. You need to clear it:

**Option A: Use Token Debugger**
1. Click the red **"Clear Token & Logout"** button
2. Confirm the action

**Option B: Manual Clear**
1. Open DevTools (F12)
2. Go to Application → Local Storage
3. Delete these keys:
   - `auth_token` (the corrupted one)
   - `auth_user`
   - `auth_store` (if exists)
4. Refresh the page

**Option C: Console Command**
```javascript
localStorage.clear();
window.location.href = '/login';
```

### Step 2: Login Again
1. Go to the login page
2. Login with your admin credentials
3. The system will now store:
   - `auth_token` → Just the JWT string ✅
   - `auth_user` → User object
   - `auth_store` → Zustand state (separate)

### Step 3: Verify the Fix
1. Use Token Debugger → **"Decode Token"**
2. You should now see:
   - ✅ User ID: 2
   - ✅ Role: **admin** (in green)
   - ✅ Email: admin@example.com
   - ✅ Valid expiry time

### Step 4: Test User Creation
1. Go to the Users page
2. Try creating a new user
3. You should see in the logs:
   ```
   [DEBUG] [ApiClient] POST /user [Auth: ✓]
   [INFO] [UserService] Creating new user
   [DEBUG] [ApiClient] POST /user - 201
   [INFO] [UserService] User created successfully
   ```

## 📊 **How It Works Now**

### localStorage Structure (After Fix)

```
auth_token (string):
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwic3ViIjoyLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NjY0NzA2NTgsImV4cCI6MTc2NjQ3NDI1OH0.vhqO9N9YIFiuqNlwjLJX5KObjmEauO6ySCZ0D9f2Oc4"

auth_user (JSON):
  {
    "id": 2,
    "firstName": "Devraj",
    "lastName": "Khanra",
    "email": "admin@example.com",
    "role": "admin"
  }

auth_store (JSON - Zustand):
  {
    "state": {
      "user": {...},
      "token": "...",
      "isAuthenticated": true
    },
    "version": 0
  }
```

### Data Flow

1. **Login** → `auth.service.ts`
   - Stores JWT in `localStorage.setItem('auth_token', token)`
   - Stores user in `localStorage.setItem('auth_user', user)`
   - Updates Zustand store via `useAuthStore.getState().setAuth(user, token)`

2. **API Request** → `api.client.ts`
   - Reads JWT from `localStorage.getItem('auth_token')` ✅
   - Attaches to header: `Authorization: Bearer <JWT>`

3. **UI State** → Components
   - Read from Zustand: `useAuthStore()`
   - Zustand persists to `auth_store` key (separate)

## 🎯 **Why This Happened**

The original implementation had:
- `auth.service.ts` manually managing `auth_token` and `auth_user` in localStorage
- `useAuthStore` also trying to persist to the same `auth_token` key
- **Conflict**: Zustand overwrote the token string with the entire state object

## 🔍 **Verification**

After clearing and re-logging in, check localStorage:

```javascript
// Should return a JWT string (starts with "eyJ")
localStorage.getItem('auth_token')

// Should return a user object (JSON)
localStorage.getItem('auth_user')

// Should return Zustand state (JSON with "state" wrapper)
localStorage.getItem('auth_store')
```

## ✨ **Summary**

- ✅ **Fixed**: Zustand now uses `auth_store` key
- ✅ **Fixed**: API client reads clean JWT from `auth_token`
- ✅ **Fixed**: No more key conflicts
- ⚠️ **Action Required**: Clear localStorage and re-login

**Clear your localStorage and login again to fix the issue!** 🎉
