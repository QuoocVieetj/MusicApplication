// API Configuration
// Thay đổi API_BASE_URL theo IP/domain của máy chạy backend server

// Cách sử dụng:
// 1. Chạy backend server trên máy của bạn
// 2. Tìm IP address của máy (dùng lệnh: ifconfig trên Mac/Linux hoặc ipconfig trên Windows)
// 3. Thay đổi API_BASE_URL dưới đây thành IP của bạn
// 4. Đảm bảo mobile device và máy chạy backend ở cùng một mạng WiFi

// Ví dụ:
// - Nếu IP máy của bạn là 192.168.1.100 → API_BASE_URL = "http://192.168.1.100:8386"
// - Nếu chạy trên localhost (chỉ test trên máy) → API_BASE_URL = "http://localhost:8386"
// - Nếu có domain → API_BASE_URL = "https://yourdomain.com"

export const API_BASE_URL = "http://192.168.1.48:8386";

