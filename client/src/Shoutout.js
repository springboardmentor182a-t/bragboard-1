import React, { useState } from "react";

const Shoutout = () => {
  const [message, setMessage] = useState("");
  const [senderId, setSenderId] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [response, setResponse] = useState(null);

  const submitShoutout = async () => {
    const res = await fetch("http://127.0.0.1:8000/shoutouts/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        sender_id: Number(senderId),
        receiver_id: Number(receiverId)
      }),
    });

    const data = await res.json();
    setResponse(data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Create Shoutout</h2>

      <input
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      /><br /><br />

      <input
        placeholder="Sender ID"
        value={senderId}
        onChange={e => setSenderId(e.target.value)}
      /><br /><br />

      <input
        placeholder="Receiver ID"
        value={receiverId}
        onChange={e => setReceiverId(e.target.value)}
      /><br /><br />

      <button onClick={submitShoutout}>Send Shoutout</button>

      {response && (
        <pre>{JSON.stringify(response, null, 2)}</pre>
      )}
    </div>
  );
};

export default Shoutout;
