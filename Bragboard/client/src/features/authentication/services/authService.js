// In-memory fake database for demo purposes.
// Path: client/src/features/authentication/services/authService.js

const fakeDb = {
    users: [
        {
            id: 1,
            name: "Demo User",
            email: "demo@company.com",
            password: "demo123",
            department: "Engineering",
        },
    ],
    otps: {},
};

function wait(ms) {
    return new Promise((res) => setTimeout(res, ms));
}

// ---------- AUTH ACTIONS ----------

export async function signup({ name, email, password }) {
    await wait(400);

    if (!name || !email || !password) {
        throw new Error("All fields required");
    }

    if (fakeDb.users.some((u) => u.email === email)) {
        throw new Error("Email already registered");
    }

    const id = fakeDb.users.length + 1;
    const user = { id, name, email, password };
    fakeDb.users.push(user);

    return {
        message: "User created",
        user: { id, name, email },
    };
}

export async function login({ email, password }) {
    await wait(400);

    const user = fakeDb.users.find(
        (u) => u.email === email && u.password === password
    );

    if (!user) {
        throw new Error("Invalid email or password");
    }

    return {
        access_token: "fake-jwt-123",
        user: { id: user.id, name: user.name, email: user.email },
    };
}

export async function requestOtp(email) {
    await wait(300);

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    fakeDb.otps[email] = code;

    // For development: see OTP in console
    console.log(`[DEV OTP] ${email} -> ${code}`);

    return { message: "OTP sent" };
}

export async function verifyOtp(email, code) {
    await wait(300);

    if (!fakeDb.otps[email] || fakeDb.otps[email] !== code) {
        throw new Error("Invalid OTP");
    }

    delete fakeDb.otps[email];

    return {
        message: "OTP verified",
        reset_token: "reset-token-xyz",
    };
}

export async function changePassword(email, newPassword, resetToken) {
    await wait(300);

    // (resetToken not validated in this fake demo)
    const user = fakeDb.users.find((u) => u.email === email);

    if (!user) {
        throw new Error("User not found");
    }

    user.password = newPassword;

    return { message: "Password updated" };
}

// Optional default export if you ever want to import as one object
export default {
    signup,
    login,
    requestOtp,
    verifyOtp,
    changePassword,
};
