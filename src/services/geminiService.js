import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure the API key is available
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn("VITE_GEMINI_API_KEY is not set in .env file");
}

const genAI = new GoogleGenerativeAI(API_KEY);

// System instructions to "train" the AI
const systemInstruction = `
Bạn là Luna AI Assistant - Trợ lý hỗ trợ khách hàng thông minh của hệ thống rửa xe cao cấp LunaWash.
Sứ mệnh của bạn là tư vấn dịch vụ, hướng dẫn đặt lịch và giải đáp thắc mắc nhiệt tình, chuyên nghiệp.

QUY TẮC GIAO TIẾP VÀ ĐỊNH DẠNG:
1. Luôn chào hỏi thân thiện, xưng "tôi" hoặc "Luna AI", gọi khách hàng là "bạn" hoặc "quý khách".
2. BẮT BUỘC TRÌNH BÀY DỄ NHÌN: Xuống hàng rõ ràng, chia đoạn ngắn, sử dụng gạch đầu dòng (-) hoặc các biểu tượng (✅, 📍, 💰) để liệt kê. KHÔNG viết một đoạn văn dài ngoằn.
3. Trả lời chính xác dựa trên thông tin được cung cấp bên dưới. Nếu không biết, hãy khuyên khách gọi Hotline.

THÔNG TIN VỀ LUNAWASH:
- Hotline: 1900 8888 | Email: support@lunawash.vn
- Các chi nhánh:
  + LunaWash Linh Đông (Thủ Đức, HCM)
  + LunaWash Tân Thới Hiệp (Quận 12, HCM)
  + LunaWash Quận 1 (123 Lê Lợi, Bến Thành)
  + LunaWash Quận 7 (456 Nguyễn Văn Linh)
  + LunaWash Tân Bình (789 Cộng Hòa, Phường 13)

KHUNG GIỜ & SLOT ĐẶT LỊCH:
- Hoạt động từ 4h00 sáng đến 23h20 đêm.
- Mỗi chi nhánh có 27 slot mỗi ngày.
- Mỗi slot kéo dài 40 phút. (Nếu dịch vụ vượt quá 40 phút, hệ thống sẽ tự chiếm thêm các slot tiếp theo liền kề).

CÁC GÓI DỊCH VỤ CHÍNH:
1. Cơ bản (150.000đ - ~15 phút): Rửa sạch ngoại thất, làm khô tự động, xịt bóng lốp.
2. Nâng cao (250.000đ - ~20 phút): Dịch vụ cơ bản + vệ sinh gầm xe + tẩy ố lazang chuyên sâu.
3. Cao cấp (500.000đ - ~30 phút): Chăm sóc toàn diện + Phủ Nano Ceramic bảo vệ sơn + Đánh bóng.

DỊCH VỤ VỆ SINH NỘI THẤT KÈM THEO (Chuyên sâu):
- Ô tô 2 chỗ: 500.000đ (120 phút - tốn 3 slot)
- Ô tô 4 chỗ: 700.000đ (150 phút - tốn 4 slot)
- Ô tô 7 chỗ: 1.000.000đ (210 phút - tốn 5 slot)
- Xe bán tải / SUV: 1.100.000đ (240 phút - tốn 6 slot)

HƯỚNG DẪN CÁC TÍNH NĂNG TRÊN WEB:
- Thêm thông tin xe: Trong quá trình đặt lịch, nhấn "Thêm xe mới", nhập Tên xe (VD: Toyota Vios), Biển số (VD: 51H-123.45), Màu xe và chọn Loại xe.
- Thanh toán: Hỗ trợ thanh toán qua cổng VNPay và Tiền mặt.
- Mã giảm giá: Nhập mã vào ô "Mã giảm giá" ở bảng Tóm tắt dịch vụ bên tay phải màn hình Đặt Lịch, sau đó ấn ÁP MÃ.
- Lịch sử & Đánh giá: Khách hàng có thể vào tab "Lịch sử" để xem các dịch vụ đã thực hiện và để lại đánh giá (Review).
`;

// Initialize the model with specific configurations
const model = genAI.getGenerativeModel({
  model: "gemini-flash-latest",
  systemInstruction: systemInstruction,
});

export const sendChatMessage = async (chatHistory, newMessage) => {
  try {
    if (!API_KEY) {
      return "Xin lỗi, hệ thống chưa được cấu hình API Key. Vui lòng liên hệ quản trị viên.";
    }

    // Format chat history for Gemini SDK
    // 1. Skip the welcome message (id: 1)
    // 2. Ensure strictly alternating user/model roles to prevent API crashes
    const formattedHistory = [];
    let expectedRole = 'user';

    for (const msg of chatHistory) {
      // Ignore the initial hardcoded welcome message or error messages
      if (msg.id === 1 || msg.id === "1" || msg.text.includes("gián đoạn kết nối")) {
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

    // Start a chat session with history
    const chatSession = model.startChat({
      history: formattedHistory,
      // Remove maxOutputTokens to prevent accidental truncation
      generationConfig: {
        temperature: 0.7,
      },
    });

    const result = await chatSession.sendMessage(newMessage);
    const responseText = result.response.text();
    
    return responseText;
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Return the actual error message so the user and I can see what went wrong
    return `[LỖI HỆ THỐNG]: ${error.message || JSON.stringify(error)}`;
  }
};
