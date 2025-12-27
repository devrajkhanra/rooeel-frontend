import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

async function run() {
    try {
        console.log('--- Step 1: Create New Admin ---');
        const timestamp = Date.now();
        const adminEmail = `admin${timestamp}@example.com`;

        const adminSignup = await axios.post(`${BASE_URL}/auth/signup`, {
            firstName: 'Admin',
            lastName: 'Test',
            email: adminEmail,
            password: 'SecurePassword123'
        });
        console.log('Admin signup success for', adminEmail);
        const adminToken = adminSignup.data.access_token;

        console.log('--- Step 2: Create User ---');
        console.log('--- Step 2: Create User ---');
        const userTimestamp = Date.now();
        const userEmail = `user${userTimestamp}@example.com`;
        const userPass = 'password123';

        const createUser = await axios.post(`${BASE_URL}/user`, {
            firstName: 'Test',
            lastName: 'User',
            email: userEmail,
            password: userPass
        }, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log('User created:', createUser.data);
        const userId = createUser.data.id;

        console.log('--- Step 2.5: Reset User Password ---');
        // valid password reset check
        const newPass = 'NewSecurePass123!';
        try {
            await axios.patch(`${BASE_URL}/user/${userId}/reset-password`, {
                password: newPass
            }, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            console.log('Password reset success');
        } catch (resetErr: any) {
            console.log('Password reset failed', resetErr.message);
        }

        console.log('--- Step 2.75: Inspect Created User ---');
        try {
            const userDetails = await axios.get(`${BASE_URL}/user/${userId}`, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            console.log('Fetched User Details:', JSON.stringify(userDetails.data, null, 2));
        } catch (fetchErr: any) {
            console.log('Failed to fetch user details');
        }

        console.log('--- Step 3: Login as User (Capitalized Role) ---');
        try {
            const userLogin = await axios.post(`${BASE_URL}/auth/login`, {
                email: userEmail,
                password: newPass,
                role: 'User' // Try capitalized
            });
            console.log('User login STATUS:', userLogin.status);
            console.log('User login DATA:', JSON.stringify(userLogin.data, null, 2));

        } catch (loginErr: any) {
            console.error('User login FAILED with role=User');
            // Try USER
            try {
                const userLogin2 = await axios.post(`${BASE_URL}/auth/login`, {
                    email: userEmail,
                    password: newPass,
                    role: 'USER' // Try UPPERCASE
                });
                console.log('User login STATUS (USER):', userLogin2.status);
            } catch (e2: any) {
                console.error('User login FAILED with role=USER');
            }
        }

    } catch (err: any) {
        console.error('Global Error:', err.message);
        if (err.response) {
            console.error('Response data:', err.response.data);
        }
    }
}

run();
