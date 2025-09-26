
export const mockRegister = (data) => {
    console.log("Mock Register called with:", data);
    
    // Simulate API validation/delay
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (data.email === "admin@sweet.com") {
                // Simulate successful registration and admin privileges
                resolve({
                    success: true,
                    user: { name: data.name, email: data.email, role: 'admin' },
                    accessToken: "mock_admin_token_123",
                });
            } else if (data.email.includes("fail")) {
                // Simulate a specific server error
                reject(new Error("Email already registered."));
            } else {
                // Simulate successful registration
                resolve({
                    success: true,
                    user: { name: data.name, email: data.email, role: 'user' },
                    accessToken: "mock_user_token_abc",
                });
            }
        }, 500);
    });
};

export const mockLogin = (data) => {
    console.log("Mock Login called with:", data);
    
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (data.email === "user@sweet.com" && data.password === "password") {
                // Simulate successful user login
                resolve({
                    success: true,
                    user: { name: "Test User", email: data.email, role: 'user' },
                    accessToken: "mock_user_token_xyz",
                });
            } else if (data.email === "admin@sweet.com" && data.password === "password") {
                // Simulate successful admin login
                resolve({
                    success: true,
                    user: { name: "Admin User", email: data.email, role: 'admin' },
                    accessToken: "mock_admin_token_xyz",
                });
            } else {
                // Simulate login failure
                reject(new Error("Invalid credentials."));
            }
        }, 500);
    });
};