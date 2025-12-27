import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

async function run() {
    try {
        // 1. Create Admin
        console.log('--- Step 1: Create Admin ---');
        const timestamp = Date.now();
        const adminEmail = `admin${timestamp}@example.com`;
        const adminSignup = await axios.post(`${BASE_URL}/auth/signup`, {
            firstName: 'Admin',
            lastName: 'Test',
            email: adminEmail,
            password: 'SecurePassword123'
        });
        const adminToken = adminSignup.data.access_token;
        console.log('Admin created');

        // 2. Create User
        console.log('--- Step 2: Create User ---');
        const userTimestamp = Date.now();
        const userEmail = `user${userTimestamp}@example.com`;
        const userPass = 'UserPass123!';
        const createUser = await axios.post(`${BASE_URL}/user`, {
            firstName: 'Test',
            lastName: 'User',
            email: userEmail,
            password: userPass
        }, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        const userId = createUser.data.id;
        console.log('User created:', userEmail);

        // 3. Login as User
        console.log('--- Step 3: Login as User ---');
        let userToken = '';
        try {
            const userLogin = await axios.post(`${BASE_URL}/auth/login`, {
                email: userEmail,
                password: userPass,
                role: 'user'
            });
            userToken = userLogin.data.access_token;
            console.log('User login SUCCESS');
        } catch (e: any) {
            console.error('User login FAILED:', e.message);
            if (e.response) {
                console.error('Status:', e.response.status);
                // console.error('Data:', e.response.data);
            }
            return; // Stop if login fails
        }

        // 4. Create Requests
        console.log('--- Step 4: Create Requests ---');
        const requests = [
            { requestType: 'firstName', requestedValue: 'NewName' },
            { requestType: 'lastName', requestedValue: 'NewLastName' },
            { requestType: 'email', requestedValue: `new${userTimestamp}@example.com` }
        ];

        for (const req of requests) {
            try {
                const res = await axios.post(`${BASE_URL}/request`, req, {
                    headers: { Authorization: `Bearer ${userToken}` }
                });
                console.log(`Request [${req.requestType}] SUCCESS:`, res.data.id);
            } catch (e: any) {
                console.error(`Request [${req.requestType}] FAILED:`, e.message);
                if (e.response) console.error('Data:', e.response.data);
            }
        }

    } catch (err: any) {
        console.error('Global Error:', err.message);
    }
}

run();
