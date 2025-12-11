
// Fake login service – replace with real API call when backend is ready

export default async function login({ email, password }) {
  // Example: simple dummy check; always "succeeds" after 500ms.
  console.log("LOGIN SERVICE CALLED:", { email, password });

  return new Promise((resolve) => {
    setTimeout(() => {
      // you can add simple validation here if you want to simulate failure
      resolve({ ok: true });
    }, 500);
  });
}
