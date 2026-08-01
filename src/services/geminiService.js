

//<<Comment Function>>
// Hàm này là: Xử lý việc gửi tin nhắn tới AI Gemini qua Backend API
//<</.....>>
export const sendChatMessage = async (chatHistory, newMessage) => {
  try {
    const formattedHistory = [];
    let expectedRole = 'user';

    for (const msg of chatHistory) {
      if (msg.id === 1 || msg.id === "1" || msg.text.includes("gián đoạn kết nối") || msg.text.includes("[LỖI")) {
        continue;
      }
      
      const role = msg.sender === 'user' ? 'user' : 'model';
      
      if (role === expectedRole) {
        formattedHistory.push({
          role: role,
          parts: [{ text: msg.text }],
        });
        expectedRole = expectedRole === 'user' ? 'model' : 'user';
      }
    }

    // Thêm tin nhắn mới vào lịch sử
    formattedHistory.push({
      role: 'user',
      parts: [{ text: newMessage }],
    });

    // Gọi API Backend
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/AI/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ contents: formattedHistory })
    });

    const data = await response.json();

    if (data && data.text) {
      return data.text;
    }
    
    return "Không nhận được phản hồi từ AI.";
  } catch (error) {
    console.error("Backend AI Error:", error);
    return `[LỖI HỆ THỐNG]: ${error.response?.data?.error || error.message || JSON.stringify(error)}`;
  }
};
