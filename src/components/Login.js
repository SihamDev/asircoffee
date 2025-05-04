import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock } from 'react-icons/fi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch("https://fusionl.app.n8n.cloud/webhook/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (data.success) {
        // 🟢 خزّن الإيميل باش نستعملو فالـ Chat
        localStorage.setItem("userEmail", email);
        navigate('/chat');
      } else {
        setMessage(data.message || "خطأ في البريد أو كلمة المرور");
      }
    } catch (err) {
      setMessage("وقع خطأ أثناء الاتصال بالخادم");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#4c3b3a] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1/3">
        <img
          src="/asir.png"
          alt="خلفية"
          className="w-full h-full object-cover rounded-b-3xl opacity-60"
        />
      </div>

      <div className="absolute top-6 left-6 z-20">
        <img
          src="/logo.png"
          alt="لوغو"
          className="w-28 h-16 object-contain"
        />
      </div>

      <div className="bg-[#5a4a49] bg-opacity-90 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-full max-w-md relative z-10 space-y-8 mt-32">
        <h2 className="text-4xl font-bold text-center text-[#9b924f]">مرحباً</h2>

        <div className="space-y-6">
          <div className="relative text-right">
            <FiMail className="absolute top-1/2 left-4 transform -translate-y-1/2 text-[#9b924f] text-2xl" />
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-transparent border border-[#9b924f] rounded-xl text-white placeholder-[#c1b87a] focus:outline-none focus:ring-2 focus:ring-[#9b924f] text-right"
            />
          </div>

          <div className="relative text-right">
            <FiLock className="absolute top-1/2 left-4 transform -translate-y-1/2 text-[#9b924f] text-2xl" />
            <input
              type="password"
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-transparent border border-[#9b924f] rounded-xl text-white placeholder-[#c1b87a] focus:outline-none focus:ring-2 focus:ring-[#9b924f] text-right"
            />
          </div>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-[#9b924f] text-[#4c3b3a] py-3 rounded-xl hover:bg-[#8f8642] font-bold text-lg transition"
        >
          تسجيل الدخول
        </button>

        {message && <p className="text-center text-red-400 mt-2">{message}</p>}
      </div>
    </div>
  );
};




// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FiMail, FiLock } from 'react-icons/fi'; // Icons

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     try {
//       const res = await fetch("http://localhost:5678/webhook-test/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ email, password })
//       });

//       const data = await res.json();
//       if (data.success) {
//         navigate('/chat');
//       } else {
//         setMessage(data.message || "خطأ في البريد أو كلمة المرور");
//       }
//     } catch (err) {
//       setMessage("وقع خطأ أثناء الاتصال بالخادم");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#4c3b3a] relative overflow-hidden">
      
//       {/* Background Image */}
//       <div className="absolute top-0 left-0 w-full h-1/3">
//         <img
//           src="/asir.png"
//           alt="خلفية"
//           className="w-full h-full object-cover rounded-b-3xl opacity-60"
//         />
//       </div>

//       {/* Logo */}
//       <div className="absolute top-6 left-6 z-20">
//         <img
//           src="/logo.png"
//           alt="لوغو"
//           className="w-28 h-16 object-contain"
//         />
//       </div>

//       {/* Form */}
//       <div className="bg-[#5a4a49] bg-opacity-90 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-full max-w-md relative z-10 space-y-8 mt-32">

//         <h2 className="text-4xl font-bold text-center text-[#9b924f]">مرحباً</h2>

//         <div className="space-y-6">
//           {/* Email Field */}
//           <div className="relative text-right">
//             <FiMail className="absolute top-1/2 left-4 transform -translate-y-1/2 text-[#9b924f] text-2xl" />
//             <input
//               type="email"
//               placeholder="البريد الإلكتروني"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full pl-12 pr-4 py-3 bg-transparent border border-[#9b924f] rounded-xl text-white placeholder-[#c1b87a] focus:outline-none focus:ring-2 focus:ring-[#9b924f] text-right"
//             />
//           </div>

//           {/* Password Field */}
//           <div className="relative text-right">
//             <FiLock className="absolute top-1/2 left-4 transform -translate-y-1/2 text-[#9b924f] text-2xl" />
//             <input
//               type="password"
//               placeholder="كلمة المرور"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full pl-12 pr-4 py-3 bg-transparent border border-[#9b924f] rounded-xl text-white placeholder-[#c1b87a] focus:outline-none focus:ring-2 focus:ring-[#9b924f] text-right"
//             />
//           </div>
//         </div>

//         {/* Login Button */}
//         <button
//           onClick={handleLogin}
//           className="w-full bg-[#9b924f] text-[#4c3b3a] py-3 rounded-xl hover:bg-[#8f8642] font-bold text-lg transition"
//         >
//           تسجيل الدخول
//         </button>

//         {message && <p className="text-center text-red-400 mt-2">{message}</p>}

//       </div>
//     </div>
//   );
// };


// / import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FiMail, FiLock } from 'react-icons/fi'; // Icons

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     try {
//       const res = await fetch("http://localhost:5678/webhook-test/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ email, password })
//       });

//       const data = await res.json();
//       if (data.success) {
//         navigate('/chat');
//       } else {
//         setMessage(data.message || "خطأ في البريد أو كلمة المرور");
//       }
//     } catch (err) {
//       setMessage("وقع خطأ أثناء الاتصال بالخادم");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#4c3b3a] relative overflow-hidden">
      
//       {/* Background Image */}
//       <div className="absolute top-0 left-0 w-full h-1/3">
//         <img
//           src="/asir.png"
//           alt="خلفية"
//           className="w-full h-full object-cover rounded-b-3xl opacity-60"
//         />
//       </div>

//       {/* Logo */}
//       <div className="absolute top-6 left-6 z-20">
//         <img
//           src="/logo.png"
//           alt="لوغو"
//           className="w-28 h-16 object-contain"
//         />
//       </div>

//       {/* Form */}
//       <div className="bg-[#5a4a49] bg-opacity-90 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-full max-w-md relative z-10 space-y-8 mt-32">

//         <h2 className="text-4xl font-bold text-center text-[#9b924f]">مرحباً</h2>

//         <div className="space-y-6">
//           {/* Email Field */}
//           <div className="relative">
//             <FiMail className="absolute top-1/2 left-4 transform -translate-y-1/2 text-[#9b924f] text-2xl" />
//             <input
//               type="email"
//               placeholder="البريد الإلكتروني"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full pl-12 pr-4 py-3 bg-transparent border border-[#9b924f] rounded-xl text-white placeholder-[#c1b87a] focus:outline-none focus:ring-2 focus:ring-[#9b924f]"
//             />
//           </div>

//           {/* Password Field */}
//           <div className="relative">
//             <FiLock className="absolute top-1/2 left-4 transform -translate-y-1/2 text-[#9b924f] text-2xl" />
//             <input
//               type="password"
//               placeholder="كلمة المرور"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full pl-12 pr-4 py-3 bg-transparent border border-[#9b924f] rounded-xl text-white placeholder-[#c1b87a] focus:outline-none focus:ring-2 focus:ring-[#9b924f]"
//             />
//           </div>
//         </div>

//         {/* Login Button */}
//         <button
//           onClick={handleLogin}
//           className="w-full bg-[#9b924f] text-[#4c3b3a] py-3 rounded-xl hover:bg-[#8f8642] font-bold text-lg transition"
//         >
//           تسجيل الدخول
//         </button>

//         {message && <p className="text-center text-red-400 mt-2">{message}</p>}

//       </div>
//     </div>
//   );
// };



// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FiMail, FiLock } from 'react-icons/fi'; // أيقونات ايميل وباسوورد

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     try {
//       const res = await fetch("http://localhost:5678/webhook-test/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ email, password })
//       });

//       const data = await res.json();
//       if (data.success) {
//         navigate('/chat');
//       } else {
//         setMessage(data.message || "البريد الإلكتروني أو كلمة المرور غير صحيح");
//       }
//     } catch (err) {
//       setMessage("وقع خطأ في الاتصال مع الخادم");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#4c3b3a] relative overflow-hidden">

//       {/* خلفية الأوراق */}
//       <div className="absolute top-0 left-0 w-full h-1/3">
//         <img
//           src="/asir.png" // حط هنا صورة الخلفية ديالك
//           alt="خلفية"
//           className="w-full h-full object-cover rounded-b-3xl opacity-60"
//         />
//       </div>

//       {/* مكان اللوغو */}
//       <div className="absolute top-6 left-6 z-20">
//         <img
//           src="/logo.png" // حط هنا لوغو ديالك
//           alt="لوغو"
//           className="w-28 h-16 object-contain"
//         />
//       </div>

//       {/* الفورم */}
//       <div className="bg-white p-8 pt-12 rounded-3xl shadow-2xl w-full max-w-md relative z-10 space-y-6 mt-24">
        
//         {/* عنوان مرحباً */}
//         <h2 className="text-4xl font-bold text-center text-[#4c3b3a]">مرحباً</h2>

//         {/* حقل البريد الإلكتروني */}
//         <div className="relative">
//           <FiMail className="absolute top-1/2 left-3 transform -translate-y-1/2 text-[#9b924f] text-xl" />
//           <input
//             type="email"
//             placeholder="البريد الإلكتروني"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9b924f] text-right"
//           />
//         </div>

//         {/* حقل كلمة المرور */}
//         <div className="relative">
//           <FiLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-[#9b924f] text-xl" />
//           <input
//             type="password"
//             placeholder="كلمة المرور"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9b924f] text-right"
//           />
//         </div>

//         {/* زر تسجيل الدخول */}
//         <button
//           onClick={handleLogin}
//           className="w-full bg-[#9b924f] text-white py-3 rounded-xl hover:bg-[#8a813f] transition font-semibold text-lg"
//         >
//           تسجيل الدخول
//         </button>

//         {/* رسالة الخطأ */}
//         {message && <p className="text-center text-red-500">{message}</p>}
//       </div>
//     </div>
//   );
// };




// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const Login = () => {
//   const [fullName, setFullName] = useState('');
//   const [password, setPassword] = useState('');
//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     try {
//       const res = await fetch("http://localhost:5678/webhook-test/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ fullName, password })
//       });

//       const data = await res.json();
//       if (data.success) {
//         navigate('/chat');
//       } else {
//         setMessage(data.message || "كلمة السر أو الاسم الكامل غير صحيح");
//       }
//     } catch (err) {
//       setMessage("وقع خطأ في الاتصال مع الخادم");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-green-50 relative overflow-hidden">
      
//       {/* خلفية الأوراق */}
//       <div className="absolute top-0 left-0 w-full h-1/3">
//         <img
//           src="/asir.png" // هنا دير مسار الصورة ديال الأوراق
//           alt="خلفية الأوراق"
//           className="w-full h-full object-cover rounded-b-3xl"
//         />
//       </div>

//       {/* مكان اللوغو */}
//       <div className="absolute top-6 left-6 z-20">
//         <img
//           src="/logo.png" // هنا دير مسار اللوغو ديالك
//           alt="الشعار"
//           className="w-30 h-16"
//         />
//       </div>

//       <div className="bg-white p-8 pt-16 rounded-3xl shadow-2xl w-full max-w-md relative z-10 space-y-6 mt-24">
//         <h2 className="text-3xl font-bold text-center text-green-700">مرحباً بعودتك</h2>
//         <p className="text-center text-gray-400">سجل دخولك إلى حسابك</p>

//         <input
//           type="text"
//           placeholder="الاسم الكامل"
//           value={fullName}
//           onChange={(e) => setFullName(e.target.value)}
//           className="w-full p-3 border border-gray-300 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-green-500"
//         />

//         <input
//           type="password"
//           placeholder="كلمة المرور"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full p-3 border border-gray-300 rounded-xl text-right focus:outline-none focus:ring-2 focus:ring-green-500"
//         />

//         <div className="flex justify-between text-sm text-gray-500">
//           <label className="flex items-center space-x-2">
//             <input type="checkbox" className="accent-green-600" />
//             <span>تذكرني</span>
//           </label>
//           <button className="text-green-600 hover:underline">نسيت كلمة المرور؟</button>
//         </div>

//         <button
//           onClick={handleLogin}
//           className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition"
//         >
//           تسجيل الدخول
//         </button>

//         {message && <p className="text-center text-red-500">{message}</p>}

//         <p className="text-center text-gray-500 text-sm">
//           ليس لديك حساب؟ <span className="text-green-600 font-semibold hover:underline cursor-pointer">سجل الآن</span>
//         </p>
//       </div>
//     </div>
//   );
// };



// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     try {
//       const res = await fetch("http://localhost:5678/webhook-test/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ email, password })
//       });

//       const data = await res.json();
//       if (data.success) {
//         navigate('/chat');
//       } else {
//         setMessage(data.message || "كلمة السر أو البريد غير صحيح");
//       }
//     } catch (err) {
//       setMessage("وقع خطأ فالربط مع السيرفر");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
//       <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm space-y-4">
//         <h2 className="text-2xl font-bold text-center">تسجيل الدخول</h2>

//         <input
//           type="email"
//           placeholder="البريد الإلكتروني"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full p-2 border rounded-md text-right"
//         />

//         <input
//           type="password"
//           placeholder="كلمة السر"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full p-2 border rounded-md text-right"
//         />

//         <button
//           onClick={handleLogin}
//           className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
//         >
//           تسجيل الدخول
//         </button>

//         {message && <p className="text-center text-red-500 mt-2">{message}</p>}
//       </div>
//     </div>
//   );
// };






// import React, { useState } from 'react';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [message, setMessage] = useState('');

//   const handleLogin = async () => {
//     try {
//       const res = await fetch("http://localhost:5678/webhook-test/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ email, password })
//       });

//       const data = await res.json();
//       setMessage(data.message);
//     } catch (err) {
//       setMessage("وقع خطأ فالربط مع السيرفر");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
//       <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm space-y-4">
//         <h2 className="text-2xl font-bold text-center">تسجيل الدخول</h2>

//         <input
//           type="email"
//           placeholder="البريد الإلكتروني"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full p-2 border rounded-md text-right"
//         />

//         <input
//           type="password"
//           placeholder="كلمة السر"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full p-2 border rounded-md text-right"
//         />

//         <button
//           onClick={handleLogin}
//           className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
//         >
//           تسجيل الدخول
//         </button>

//         {message && <p className="text-center text-red-500 mt-2">{message}</p>}
//       </div>
//     </div>
//   );
// };

export default Login;



// import React from 'react';

// export default function Login() {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 to-green-700">
//       <div className="bg-green-800 bg-opacity-30 backdrop-blur-md p-10 rounded-2xl shadow-lg w-full max-w-md">
//         <h2 className="text-3xl font-bold text-center text-white mb-6">مرحبا بعودتك</h2>

//         <form className="space-y-5">
//           <div>
//             <label htmlFor="email" className="block text-sm text-white mb-2">
//               البريد الإلكتروني
//             </label>
//             <input
//               type="email"
//               id="email"
//               placeholder="example@gmail.com"
//               className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
//             />
//           </div>

//           <div>
//             <label htmlFor="password" className="block text-sm text-white mb-2">
//               كلمة المرور
//             </label>
//             <input
//               type="password"
//               id="password"
//               placeholder="••••••••"
//               className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition duration-200"
//           >
//             تسجيل الدخول
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
