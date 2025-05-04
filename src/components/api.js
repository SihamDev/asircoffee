// src/api.js
// export async function callBotAPI({ type, content, file }) {
//     const url = "http://localhost:5678/webhook-test/bot";  // أو الـ Production URL ديالك
//     if (file) {
//       const fd = new FormData();
//       fd.append("type", type);
//       fd.append("file", file);
//       const res = await fetch(url, { method: "POST", body: fd });
//       return res.json();
//     } else {
//       const res = await fetch(url, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ type, content }),
//       });
//       return res.json();
//     }
//   }
export async function callBotAPI({ type, content, file }) {
  const url = "https://fusionl.app.n8n.cloud/webhook/bot";

  if (file) {
    const fd = new FormData();
    fd.append("file", file); // ⬅️ هذا اللي محتاج n8n
    fd.append("type", type);
    return fetch(url, {
      method: "POST",
      body: fd,
    }).then((res) => res.json());
  } else {
    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, content }),
    }).then((res) => res.json());
  }
}
