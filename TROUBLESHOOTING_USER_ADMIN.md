# User-Admin Assignment Troubleshooting

## Issue: "User does not have an assigned admin"

### Symptom
When attempting to create a change request, users receive an error message:
```
User does not have an assigned admin
```

### Root Cause
This error occurs when a user's `createdBy` field in the database is `null`. The request system requires users to be assigned to an admin (the admin who created them) to properly route change requests.

### Why This Happens
- **Legacy users**: Users created before the `createdBy` field was properly implemented
- **Manual database modifications**: Direct database changes that didn't set the `createdBy` field
- **Migration issues**: Database migrations that didn't backfill existing user records

### Solution

#### For System Administrators

Run the database fix script on the backend server:

```bash
cd /path/to/rooeel-backend
npx ts-node src/scripts/fix-user-admin.ts
```

**What the script does:**
1. Identifies all users with `createdBy = null`
2. Finds the first admin in the database
3. Assigns all affected users to that admin
4. Provides detailed logging of the operation

**Example output:**
```
Found 5 users without an assigned admin
Found admin: John Doe (ID: 1)
Assigning users to admin...
✓ Updated 5 users
```

#### For Users

If you encounter this error:

1. **Contact your system administrator** and share this error message
2. **Provide them with the solution**: Ask them to run the fix script (see above)
3. **Wait for confirmation**: Once the script is run, you should be able to create requests

### Verification

After running the fix script, verify the issue is resolved:

1. **Check user data**: Use the User Data Debugger on the "My Requests" page
   - Click "Fetch User Data"
   - Verify "Created By (Admin ID)" shows a number (not "MISSING!")

2. **Test request creation**: Try creating a new change request
   - Should succeed without the admin assignment error

### Prevention

**For new users**: The `POST /user` endpoint automatically sets the `createdBy` field when admins create new users, so this issue only affects existing users created before the field was properly implemented.

### Related Documentation

- Backend README: See "Troubleshooting > User-Admin Assignment Issue"
- Frontend: User Data Debugger component highlights missing admin assignments

### Technical Details

**Database Schema:**
```typescript
User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdBy: number;    // Foreign key to Admin (nullable)
  createdAt: Date;
}
```

**Request Creation Flow:**
1. User submits change request via `POST /request`
2. Backend extracts `userId` from JWT token
3. Backend looks up user's `createdBy` field to get `adminId`
4. If `createdBy` is `null`, backend returns error: "User does not have an assigned admin"
5. Request is created with both `userId` and `adminId`

**Fix Script Logic:**
```typescript
// Pseudo-code
const usersWithoutAdmin = await prisma.user.findMany({
  where: { createdBy: null }
});

const firstAdmin = await prisma.admin.findFirst();

await prisma.user.updateMany({
  where: { createdBy: null },
  data: { createdBy: firstAdmin.id }
});
```
