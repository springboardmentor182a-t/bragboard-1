
// Example helper – not required for login/signup

export default async function getUsers() {
    // Dummy data
    return Promise.resolve([
        { id: 1, name: "Demo User 1", email: "demo1@example.com" },
        { id: 2, name: "Demo User 2", email: "demo2@example.com" },
    ]);
}
