export const uploadToCloudinary = async (file) => {
    const url = "https://api.cloudinary.com/v1_1/day2utr9z/upload";
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", "unsigned_chat");
    fd.append("folder", "chat_uploads");
  
    const res = await fetch(url, { method: "POST", body: fd });
    if (!res.ok) throw new Error("Cloudinary upload failed");
    const data = await res.json();
    return data.secure_url;
  };
  