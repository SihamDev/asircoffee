


import React, { useState, useRef, useEffect } from "react";
import { FaMicrophone, FaPaperPlane, FaImage, FaStop } from "react-icons/fa";
import { Waveform } from "@uiball/loaders";
import { callBotAPI } from "./api";
import { uploadToCloudinary } from "./cloudinary";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import "./ChatPage.css";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const bottomRef = useRef(null);

  const userEmail = localStorage.getItem("userEmail") || "demo";
  const chatId = "farmer-" + userEmail;

  // Load messages from Firestore
  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      where("chatId", "==", chatId),
      orderBy("timestamp", "asc")
    );
    const unsub = onSnapshot(q, (snapshot) => {
      const loaded = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(loaded);
    });
    return unsub;
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const saveMessage = async (msg) => {
    await addDoc(collection(db, "messages"), {
      ...msg,
      chatId,
      timestamp: serverTimestamp(),
    });
  };

  const sendMessage = async ({ type, content, file }) => {
    try {
      let finalContent = content;
      if (file) {
        finalContent = await uploadToCloudinary(file);
      }

      const userMsg = { type, content: finalContent, from: "user" };
      await saveMessage(userMsg);

      const botRes = await callBotAPI({ type, content: finalContent });
      const botMsg = {
        type: botRes.type || "text",
        content: botRes.url || botRes.content || botRes.output || "❌ لا يوجد رد",
        from: "bot",
      };

      await saveMessage(botMsg);
      setInput("");
    } catch (err) {
      console.error("Bot error:", err);
      await saveMessage({
        type: "text",
        content: "❌ خطأ في الاتصال بالسيرفر",
        from: "bot",
      });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) sendMessage({ type: "image", file });
  };

  const handleAudioRecord = async () => {
    if (!recording) {
      setRecording(true);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const file = new File([blob], "voice.webm", { type: "audio/webm" });
        sendMessage({ type: "audio", file });
        setRecording(false);
      };

      mediaRecorder.start();
    } else {
      mediaRecorderRef.current?.stop();
    }
  };

  return (
    <div className="chat-page">
      <header className="chat-header">
        <img src="/bot.jpg" alt="Bot" className="avatar" />
        <h2>مستشار عسير الذكي 🌱</h2>
      </header>

      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`chat-bubble ${msg.from}`}>
            {msg.type === "text" && <p>{msg.content}</p>}
            {msg.type === "image" && <img src={msg.content} alt="Uploaded" className="chat-img" />}
            {msg.type === "audio" && (
              <div className="custom-audio-player">
                <audio controls src={msg.content} />
              </div>
            )}
            {!["text", "image", "audio"].includes(msg.type) && <p>{msg.content}</p>}
          </div>
        ))}
        {recording && (
          <div className="chat-bubble user">
            <Waveform size={40} lineWeight={3.5} speed={1} />
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input">
        <label htmlFor="imgInput"><FaImage size={20} /></label>
        <input type="file" id="imgInput" onChange={handleImageUpload} hidden />

        <input
          type="text"
          value={input}
          placeholder="اكتب رسالة"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && input.trim() &&
            sendMessage({ type: "text", content: input.trim() })
          }
        />

        <button onClick={handleAudioRecord}>
          {recording ? <FaStop size={20} /> : <FaMicrophone size={20} />}
        </button>

        <button onClick={() => input.trim() && sendMessage({ type: "text", content: input.trim() })}>
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default ChatPage;



// // src/components/ChatPage.js
// import React, { useState, useRef, useEffect } from "react";
// import { FaMicrophone, FaPaperPlane, FaImage, FaStop } from "react-icons/fa";
// import { Waveform } from "@uiball/loaders";
// import { callBotAPI } from "./api";
// import "./ChatPage.css";

// const ChatPage = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [recording, setRecording] = useState(false);
//   const mediaRecorderRef = useRef(null);
//   const bottomRef = useRef(null);

//   // scroll to bottom whenever messages change
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const sendMessage = async ({ type, content, file }) => {
//     // 1) show the user's message immediately
//     const preview = file ? URL.createObjectURL(file) : content;
//     setMessages((prev) => [
//       ...prev,
//       { type, content: preview, from: "user", id: Date.now() },
//     ]);
//     setInput("");

//     // 2) call the bot
//     try {
//       const botRes = await callBotAPI({ type, content, file });
//       console.log("👾 botRes raw:", botRes);

//       // normalize into our two fields: type + content
//       const resType = botRes.type || "text";
//       const resContent =
//         botRes.url ||
//         botRes.content ||
//         botRes.output ||       // ← support `output` field
//         botRes.body ||
//         "";

//       setMessages((prev) => [
//         ...prev,
//         { type: resType, content: resContent, from: "bot", id: Date.now() + 1 },
//       ]);
//     } catch (err) {
//       console.error(err);
//       setMessages((prev) => [
//         ...prev,
//         { type: "text", content: "❌ خطأ من السيرفر", from: "bot", id: Date.now() + 2 },
//       ]);
//     }
//   };

//   const handleAudioRecord = async () => {
//     if (!recording) {
//       setRecording(true);
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const mediaRecorder = new MediaRecorder(stream);
//       mediaRecorderRef.current = mediaRecorder;
//       let chunks = [];
//       mediaRecorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);
//       mediaRecorder.onstop = () => {
//         const blob = new Blob(chunks, { type: "audio/webm" });
//         const file = new File([blob], "rec.webm", { type: "audio/webm" });
//         sendMessage({ type: "audio", file });
//         setRecording(false);
//       };
//       mediaRecorder.start();
//     } else {
//       mediaRecorderRef.current.stop();
//     }
//   };

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) sendMessage({ type: "image", file });
//   };

//   return (
//     <div className="chat-page">
//       <header className="chat-header">
//         <img src="/profile.png" alt="Bot" className="avatar" />
//         <h2>مستشار الزراعة</h2>
//       </header>

//       <div className="chat-messages">
//         {messages.map((msg) => (
//           <div key={msg.id} className={`chat-bubble ${msg.from}`}>
//             {msg.type === "text" && <p>{msg.content}</p>}
//             {msg.type === "image" && <img src={msg.content} alt="img" className="chat-img" />}
//             {msg.type === "audio" && <audio controls src={msg.content} />}
//             {/* fallback for any other type */}
//             {![ "text", "image", "audio" ].includes(msg.type) && <p>{msg.content}</p>}
//           </div>
//         ))}
//         {recording && (
//           <div className="chat-bubble user">
//             <Waveform size={40} lineWeight={3.5} speed={1} />
//           </div>
//         )}
//         <div ref={bottomRef} />
//       </div>

//       <div className="chat-input">
//         <label htmlFor="imgInput"><FaImage size={20} /></label>
//         <input type="file" id="imgInput" onChange={handleImageUpload} hidden />

//         <input
//           type="text"
//           value={input}
//           placeholder="اكتب رسالة"
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) =>
//             e.key === "Enter" && input.trim() && sendMessage({ type: "text", content: input.trim() })
//           }
//         />

//         <button onClick={handleAudioRecord}>
//           {recording ? <FaStop size={20} /> : <FaMicrophone size={20} />}
//         </button>

//         <button onClick={() => input.trim() && sendMessage({ type: "text", content: input.trim() })}>
//           <FaPaperPlane />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatPage;


// import React, { useState, useRef, useEffect } from "react";
// import { FaMicrophone, FaPaperPlane, FaImage, FaStop } from "react-icons/fa";
// import { Waveform } from "@uiball/loaders";
// import { callBotAPI } from "./api";
// import "./ChatPage.css";

// const ChatPage = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [recording, setRecording] = useState(false);
//   const mediaRecorderRef = useRef(null);
//   const bottomRef = useRef(null);

//   // Scroll to bottom on new message
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const sendMessage = async ({ type, content, file }) => {
//     // Show user message immediately
//     const preview = file ? URL.createObjectURL(file) : content;
//     setMessages((prev) => [
//       ...prev,
//       { type, content: preview, from: "user", id: Date.now() }
//     ]);
//     setInput("");

//     try {
//       const botRes = await callBotAPI({ type, content, file });
//       console.log("👾 botRes raw:", botRes);

//       // Normalize response fields
//       const resType = botRes.type || "text";
//       const resContent = botRes.url || botRes.content || botRes.body || "";

//       setMessages((prev) => [
//         ...prev,
//         { type: resType, content: resContent, from: "bot", id: Date.now() + 1 }
//       ]);
//     } catch (err) {
//       console.error(err);
//       setMessages((prev) => [
//         ...prev,
//         { type: "text", content: "❌ خطأ من السيرفر", from: "bot", id: Date.now() + 2 }
//       ]);
//     }
//   };

//   const handleAudioRecord = async () => {
//     if (!recording) {
//       setRecording(true);
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const mediaRecorder = new MediaRecorder(stream);
//       mediaRecorderRef.current = mediaRecorder;
//       let chunks = [];
//       mediaRecorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);
//       mediaRecorder.onstop = () => {
//         const blob = new Blob(chunks, { type: "audio/webm" });
//         const file = new File([blob], "rec.webm", { type: "audio/webm" });
//         sendMessage({ type: "audio", file });
//         setRecording(false);
//       };
//       mediaRecorder.start();
//     } else {
//       mediaRecorderRef.current.stop();
//     }
//   };

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) sendMessage({ type: "image", file });
//   };

//   return (
//     <div className="chat-page">
//       <header className="chat-header">
//         <img src="/profile.png" alt="Bot" className="avatar" />
//         <h2>مستشار الزراعة</h2>
//       </header>

//       <div className="chat-messages">
//         {messages.map((msg) => (
//           <div key={msg.id} className={`chat-bubble ${msg.from}`}>
//             {msg.type === "text" && <p>{msg.content}</p>}
//             {msg.type === "image" && <img src={msg.content} alt="img" className="chat-img" />}
//             {msg.type === "audio" && <audio controls src={msg.content} />}
//             {!["text", "image", "audio"].includes(msg.type) && <p>{msg.content}</p>}
//           </div>
//         ))}
//         {recording && (
//           <div className="chat-bubble user">
//             <Waveform size={40} lineWeight={3.5} speed={1} />
//           </div>
//         )}
//         <div ref={bottomRef} />
//       </div>

//       <div className="chat-input">
//         <label htmlFor="imgInput"><FaImage size={20} /></label>
//         <input type="file" id="imgInput" onChange={handleImageUpload} hidden />

//         <input
//           type="text"
//           value={input}
//           placeholder="اكتب رسالة"
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && input.trim() && sendMessage({ type: "text", content: input.trim() })}
//         />

//         <button onClick={handleAudioRecord}>
//           {recording ? <FaStop size={20} /> : <FaMicrophone size={20} />}
//         </button>

//         <button onClick={() => input.trim() && sendMessage({ type: "text", content: input.trim() })}>
//           <FaPaperPlane />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatPage;



// import React, { useState, useRef } from "react";
// import { FaMicrophone, FaPaperPlane, FaImage, FaStop } from "react-icons/fa";
// import { Waveform } from "@uiball/loaders";
// import { callBotAPI } from "./api";
// import "./ChatPage.css";

// const ChatPage = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [recording, setRecording] = useState(false);
//   const mediaRecorderRef = useRef(null);

//   const sendMessage = async ({ type, content, file }) => {
//     const preview = file ? URL.createObjectURL(file) : content;
//     setMessages((m) => [...m, { type, content: preview, from: "user", id: Date.now() }]);
//     setInput("");

//     try {
//       const botRes = await callBotAPI({ type, content, file });
//       setMessages((m) => [
//         ...m,
//         {
//           type: botRes.type,
//           content: botRes.url || botRes.content,
//           from: "bot",
//           id: Date.now() + 1,
//         },
//       ]);
//     } catch (err) {
//       console.error(err);
//       setMessages((m) => [
//         ...m,
//         { type: "text", content: "❌ خطأ من السيرفر", from: "bot", id: Date.now() + 2 },
//       ]);
//     }
//   };

//   const handleAudioRecord = async () => {
//     if (!recording) {
//       setRecording(true);
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const mediaRecorder = new MediaRecorder(stream);
//       mediaRecorderRef.current = mediaRecorder;
//       let chunks = [];
//       mediaRecorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);
//       mediaRecorder.onstop = () => {
//         const blob = new Blob(chunks, { type: "audio/webm" });
//         const file = new File([blob], "rec.webm", { type: "audio/webm" });
//         sendMessage({ type: "audio", file });
//         setRecording(false);
//       };
//       mediaRecorder.start();
//     } else {
//       mediaRecorderRef.current.stop();
//     }
//   };

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) sendMessage({ type: "image", file });
//   };

//   return (
//     <div className="chat-page">
//       <header className="chat-header">
//         <img src="/profile.png" alt="Bot" className="avatar" />
//         <h2>مستشار الزراعة</h2>
//       </header>

//       <div className="chat-messages">
//         {messages.map((msg) => (
//           <div key={msg.id} className={`chat-bubble ${msg.from}`}>
//             {msg.type === "text" && <p>{msg.content}</p>}
//             {msg.type === "image" && <img src={msg.content} alt="img" className="chat-img" />}
//             {msg.type === "audio" && <audio controls src={msg.content} />}
//           </div>
//         ))}
//         {recording && (
//           <div className="chat-bubble user">
//             <Waveform size={40} lineWeight={3.5} speed={1} />
//           </div>
//         )}
//       </div>

//       <div className="chat-input">
//         <label htmlFor="imgInput"><FaImage size={20} /></label>
//         <input type="file" id="imgInput" onChange={handleImageUpload} hidden />

//         <input
//           type="text"
//           value={input}
//           placeholder="اكتب رسالة"
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) =>
//             e.key === "Enter" &&
//             input.trim() &&
//             sendMessage({ type: "text", content: input.trim() })
//           }
//         />

//         <button onClick={handleAudioRecord}>
//           {recording ? <FaStop size={20} /> : <FaMicrophone size={20} />}
//         </button>

//         <button
//           onClick={() =>
//             input.trim() && sendMessage({ type: "text", content: input.trim() })
//           }
//         >
//           <FaPaperPlane />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatPage;



// import React, { useState, useRef } from "react";
// import { FaMicrophone, FaPaperPlane, FaImage, FaStop } from "react-icons/fa";
// import { Waveform } from "@uiball/loaders";
// import { callBotAPI } from "./api";       // ← استورد helper
// import "./ChatPage.css";

// const ChatPage = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [recording, setRecording] = useState(false);
//   const mediaRecorderRef = useRef(null);

//   const sendMessage = async ({ type, content, file }) => {
//     // 1) عرض رسالة المستخدم فوراً
//     const preview = file ? URL.createObjectURL(file) : content;
//     setMessages((m) => [...m, { type, content: preview, from: "user", id: Date.now() }]);
//     setInput("");

//     // 2) نداء للـ Webhook
//     try {
//       const botRes = await callBotAPI({ type, content, file });
//       setMessages((m) => [
//         ...m,
//         {
//           type: botRes.type,
//           content: botRes.url || botRes.content,
//           from: "bot",
//           id: Date.now() + 1,
//         },
//       ]);
//     } catch (err) {
//       console.error(err);
//       setMessages((m) => [
//         ...m,
//         { type: "text", content: "❌ خطأ من السيرفر", from: "bot", id: Date.now() + 2 },
//       ]);
//     }
//   };

//   const handleAudioRecord = async () => {
//     if (!recording) {
//       setRecording(true);
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const mediaRecorder = new MediaRecorder(stream);
//       mediaRecorderRef.current = mediaRecorder;
//       let chunks = [];
//       mediaRecorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);
//       mediaRecorder.onstop = () => {
//         const blob = new Blob(chunks, { type: "audio/webm" });
//         const file = new File([blob], "rec.webm", { type: "audio/webm" });
//         sendMessage({ type: "audio", file });
//         setRecording(false);
//       };
//       mediaRecorder.start();
//     } else {
//       mediaRecorderRef.current.stop();
//     }
//   };

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) sendMessage({ type: "image", file });
//   };

//   return (
//     <div className="chat-page">
//       <header className="chat-header">
//         <img src="/profile.png" alt="Bot" className="avatar" />
//         <h2>مستشار الزراعة</h2>
//       </header>

//       <div className="chat-messages">
//         {messages.map((msg) => (
//           <div key={msg.id} className={`chat-bubble ${msg.from}`}>
//             {msg.type === "text" && <p>{msg.content}</p>}
//             {msg.type === "image" && <img src={msg.content} alt="img" className="chat-img" />}
//             {msg.type === "audio" && <audio controls src={msg.content} />}
//           </div>
//         ))}
//         {recording && (
//           <div className="chat-bubble user">
//             <Waveform size={40} lineWeight={3.5} speed={1} />
//           </div>
//         )}
//       </div>

//       <div className="chat-input">
//         <label htmlFor="imgInput"><FaImage size={20} /></label>
//         <input type="file" id="imgInput" onChange={handleImageUpload} hidden />

//         <input
//           type="text"
//           value={input}
//           placeholder="اكتب رسالة"
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) =>
//             e.key === "Enter" &&
//             input.trim() &&
//             sendMessage({ type: "text", content: input.trim() })
//           }
//         />

//         <button onClick={handleAudioRecord}>
//           {recording ? <FaStop size={20} /> : <FaMicrophone size={20} />}
//         </button>

//         <button
//           onClick={() =>
//             input.trim() && sendMessage({ type: "text", content: input.trim() })
//           }
//         >
//           <FaPaperPlane />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatPage;


// import React, { useState, useRef, useEffect } from "react";
// import { FaMicrophone, FaPaperPlane, FaImage, FaStop } from "react-icons/fa";
// import { Waveform } from "@uiball/loaders";
// import "./ChatPage.css";

// const ChatPage = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [recording, setRecording] = useState(false);
//   const [audioChunks, setAudioChunks] = useState([]);
//   const mediaRecorderRef = useRef(null);

//   const sendMessage = (type, content) => {
//     const newMessage = { type, content, from: "user", id: Date.now() };
//     setMessages([...messages, newMessage]);
//     setInput("");

//     // Simulate bot response
//     setTimeout(() => {
//       setMessages((prev) => [
//         ...prev,
//         { type: "text", content: "تم التحليل ✅", from: "bot", id: Date.now() + 1 },
//       ]);
//     }, 1000);
//   };

//   const handleAudioRecord = async () => {
//     if (!recording) {
//       setRecording(true);
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const mediaRecorder = new MediaRecorder(stream);
//       mediaRecorderRef.current = mediaRecorder;
//       let chunks = [];

//       mediaRecorder.ondataavailable = (e) => {
//         if (e.data.size > 0) chunks.push(e.data);
//       };

//       mediaRecorder.onstop = () => {
//         const audioBlob = new Blob(chunks, { type: "audio/webm" });
//         const audioUrl = URL.createObjectURL(audioBlob);
//         sendMessage("audio", audioUrl);
//         setRecording(false);
//       };

//       setAudioChunks(chunks);
//       mediaRecorder.start();
//     } else {
//       mediaRecorderRef.current.stop();
//     }
//   };

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const imageUrl = URL.createObjectURL(file);
//       sendMessage("image", imageUrl);
//     }
//   };

//   return (
//     <div className="chat-page">
//       <header className="chat-header">
//         <img src="/profile.png" alt="Bot" className="avatar" />
//         <h2>مستشار الزراعة</h2>
//       </header>

//       <div className="chat-messages">
//         {messages.map((msg) => (
//           <div key={msg.id} className={`chat-bubble ${msg.from}`}>
//             {msg.type === "text" && <p>{msg.content}</p>}
//             {msg.type === "image" && <img src={msg.content} alt="img" className="chat-img" />}
//             {msg.type === "audio" && (
//               <div className="audio-wave">
//                 <audio controls src={msg.content}></audio>
//               </div>
//             )}
//           </div>
//         ))}
//         {recording && (
//           <div className="chat-bubble user">
//             <Waveform size={40} lineWeight={3.5} speed={1} color="#0e806a" />
//           </div>
//         )}
//       </div>

//       <div className="chat-input">
//         <label htmlFor="imgInput"><FaImage size={20} /></label>
//         <input type="file" id="imgInput" onChange={handleImageUpload} hidden />
//         <input
//           type="text"
//           value={input}
//           placeholder="اكتب رسالة"
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && sendMessage("text", input)}
//         />
//         <button onClick={handleAudioRecord}>
//           {recording ? <FaStop size={20} /> : <FaMicrophone size={20} />}
//         </button>
//         <button onClick={() => sendMessage("text", input)}><FaPaperPlane /></button>
//       </div>
//     </div>
//   );
// };


// export default ChatPage;

// // ChatPage.js
// import React, { useRef, useState } from 'react';
// import { ArrowLeft, Mic, Image as ImageIcon } from 'lucide-react';
// import { motion } from 'framer-motion';
// import './ChatPage.css';

// export default function ChatPage() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [recording, setRecording] = useState(false);
//   const [mediaRecorder, setMediaRecorder] = useState(null);
//   const [audioBlob, setAudioBlob] = useState(null);
//   const [previewUrl, setPreviewUrl] = useState(null);

//   const fileInputRef = useRef();

//   const handleSendMessage = () => {
//     if (input.trim() !== '') {
//       setMessages([...messages, { type: 'text', content: input, sender: 'user' }]);
//       setInput('');
//     }
//   };

//   const handlePhotoUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setMessages([...messages, { type: 'image', content: reader.result, sender: 'user' }]);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleStartRecording = async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     const recorder = new MediaRecorder(stream);
//     setMediaRecorder(recorder);
//     const chunks = [];

//     recorder.ondataavailable = (e) => chunks.push(e.data);
//     recorder.onstop = () => {
//       const blob = new Blob(chunks, { type: 'audio/webm' });
//       const url = URL.createObjectURL(blob);
//       setMessages([...messages, { type: 'audio', content: url, sender: 'user' }]);
//     };

//     recorder.start();
//     setRecording(true);
//   };

//   const handleStopRecording = () => {
//     if (mediaRecorder) {
//       mediaRecorder.stop();
//       setRecording(false);
//     }
//   };

//   return (
//     <div className="chat-container">
//       <div className="chat-header">
//         <ArrowLeft size={24} />
//         <img
//           src="https://randomuser.me/api/portraits/women/44.jpg"
//           alt="profile"
//           className="chat-avatar"
//         />
//         <span className="chat-name">Laila</span>
//       </div>

//       <div className="chat-body">
//         {messages.map((msg, index) => (
//           <motion.div
//             key={index}
//             className={`chat-bubble ${msg.sender === 'user' ? 'user' : 'bot'}`}
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//           >
//             {msg.type === 'text' && <span>{msg.content}</span>}
//             {msg.type === 'image' && (
//               <img src={msg.content} alt="uploaded" className="chat-image" />
//             )}
//             {msg.type === 'audio' && (
//               <audio controls className="chat-audio">
//                 <source src={msg.content} type="audio/webm" />
//               </audio>
//             )}
//           </motion.div>
//         ))}
//       </div>

//       <div className="chat-footer">
//         <button onClick={() => fileInputRef.current.click()}>
//           <ImageIcon size={22} />
//         </button>
//         <input
//           type="file"
//           accept="image/*"
//           ref={fileInputRef}
//           onChange={handlePhotoUpload}
//           hidden
//         />
//         <input
//           type="text"
//           placeholder="Type a message"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
//         />
//         <button
//           onMouseDown={handleStartRecording}
//           onMouseUp={handleStopRecording}
//           className={`mic-button ${recording ? 'recording' : ''}`}
//         >
//           <Mic size={22} />
//         </button>
//       </div>
//     </div>
//   );
// }


// import React, { useState, useRef } from "react";
// import { Send, Mic, Image as ImageIcon, ArrowLeft } from "lucide-react";

// const ChatPage = () => {
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [isRecording, setIsRecording] = useState(false);
//   const mediaRecorderRef = useRef(null);
//   const audioChunksRef = useRef([]);
//   const fileInputRef = useRef(null);

//   const handleSendMessage = () => {
//     if (newMessage.trim() !== "") {
//       setMessages([...messages, { type: "text", content: newMessage, fromUser: true }]);
//       setNewMessage("");
//     }
//   };

//   const handleStartRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const mediaRecorder = new MediaRecorder(stream);
//       mediaRecorderRef.current = mediaRecorder;
//       audioChunksRef.current = [];
//       setIsRecording(true);

//       mediaRecorder.ondataavailable = (event) => {
//         audioChunksRef.current.push(event.data);
//       };

//       mediaRecorder.onstop = () => {
//         setIsRecording(false);
//         const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
//         const audioUrl = URL.createObjectURL(audioBlob);
//         setMessages((prev) => [...prev, { type: "audio", content: audioUrl, fromUser: true }]);
//       };

//       mediaRecorder.start();
//     } catch (err) {
//       alert("⚠️ لم يتم منح صلاحية الميكروفون");
//       setIsRecording(false);
//     }
//   };

//   const handleStopRecording = () => {
//     if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
//       mediaRecorderRef.current.stop();
//     }
//   };

//   const handleImageUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const imageUrl = URL.createObjectURL(file);
//       setMessages([...messages, { type: "image", content: imageUrl, fromUser: true }]);
//     }
//   };

//   return (
//     <div className="flex flex-col h-screen bg-[#f0fdf4]">
//       {/* Header */}
//       <div className="bg-green-600 text-white px-4 py-3 flex items-center shadow-md">
//         <ArrowLeft className="mr-4 cursor-pointer" />
//         <img src="/profile.jpg" alt="Profile" className="w-10 h-10 rounded-full mr-3" />
//         <div>
//           <h2 className="text-lg font-bold">الدعم الفني</h2>
//           <p className="text-sm text-white/80">متصل الآن</p>
//         </div>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-2 flex flex-col">
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`max-w-[75%] rounded-2xl px-4 py-2 shadow text-white ${
//               msg.fromUser ? "bg-green-500 self-end" : "bg-gray-300 text-black self-start"
//             }`}
//           >
//             {msg.type === "text" && <span>{msg.content}</span>}
//             {msg.type === "image" && <img src={msg.content} alt="User Upload" className="rounded-lg" />}
//             {msg.type === "audio" && <audio controls src={msg.content} className="w-full" />} 
//           </div>
//         ))}
//       </div>

//       {/* Recording status */}
//       {isRecording && (
//         <div className="text-center text-red-600 font-semibold mb-1 animate-pulse">
//           🎙️ جاري التسجيل...
//         </div>
//       )}

//       {/* Input Area */}
//       <div className="p-4 flex items-center gap-2 border-t bg-white">
//         <button
//           onClick={() => fileInputRef.current.click()}
//           className="p-2 rounded-full bg-green-100 hover:bg-green-200 text-green-700"
//         >
//           <ImageIcon size={20} />
//         </button>
//         <input
//           type="file"
//           accept="image/*"
//           className="hidden"
//           ref={fileInputRef}
//           onChange={handleImageUpload}
//         />
//         <input
//           type="text"
//           placeholder="أكتب رسالة..."
//           className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//         />
//         <button
//           onClick={handleSendMessage}
//           className="p-2 rounded-full bg-green-500 hover:bg-green-600 text-white"
//         >
//           <Send size={20} />
//         </button>
//         <button
//           onMouseDown={handleStartRecording}
//           onMouseUp={handleStopRecording}
//           className="p-2 rounded-full bg-green-100 hover:bg-green-200 text-green-700"
//         >
//           <Mic size={20} />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatPage;

// import React, { useState } from 'react';
// import { Send } from 'lucide-react';

// const ChatPage = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');

//   const handleSend = () => {
//     if (!input.trim()) return;

//     const newMessage = { text: input, sender: 'user' };
//     setMessages([...messages, newMessage]);
//     setInput('');
    
//     // simulate response
//     setTimeout(() => {
//       setMessages(prev => [...prev, { text: 'تم استلام الرسالة ✅', sender: 'bot' }]);
//     }, 1000);
//   };

//   return (
//     <div className="h-screen flex flex-col bg-green-50">
//       <div className="p-4 bg-green-600 text-white text-xl font-semibold text-center shadow-md">
//         شات المساعد الذكي
//       </div>

//       <div className="flex-1 overflow-y-auto p-4 space-y-2">
//         {messages.map((msg, i) => (
//           <div key={i} className={`p-2 rounded-xl max-w-xs ${msg.sender === 'user' ? 'bg-green-100 self-end' : 'bg-white self-start shadow'}`}>
//             {msg.text}
//           </div>
//         ))}
//       </div>

//       <div className="p-4 border-t flex items-center gap-2">
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           className="flex-1 p-2 border rounded-lg"
//           placeholder="أكتب رسالة..."
//           onKeyDown={(e) => e.key === 'Enter' && handleSend()}
//         />
//         <button onClick={handleSend} className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition">
//           <Send size={20} />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatPage;
