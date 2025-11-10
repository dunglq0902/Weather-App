# Ứng dụng Thời tiết (Weather App)

Đây là một ứng dụng web đơn giản lấy dữ liệu từ OpenWeatherMap.

## Cài đặt

1.  Clone repository này về.
2.  Frontend (HTML/CSS/JS) có thể chạy trực tiếp bằng Live Server.

## Chạy Backend (Python)

1.  Di chuyển vào thư mục backend: `cd backend`
2.  Cài đặt các thư viện: `pip install -r requirements.txt` (Bạn nên tạo file này)
3.  **Quan trọng:** Tạo một file tên là `.env` bên trong thư mục `backend`.
4.  Thêm API key của bạn vào file `.env` với nội dung:
    ```
    OPENWEATHER_API_KEY=your_actual_api_key_goes_here
    ```
5.  Chạy server: `python app.py`

Server backend sẽ chạy ở `http://localhost:5000`.