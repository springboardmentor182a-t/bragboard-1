
// Fake signup service – replace with real API call when backend is ready

export default async function signup({ name, email, password }) {
    console.log("SIGNUP SERVICE CALLED:", { name, email, password });

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ ok: true });
        }, 500);
    });
}
