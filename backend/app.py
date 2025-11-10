import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from dotenv import load_dotenv

# Tải các biến môi trường từ file .env
load_dotenv()

app = Flask(__name__)
CORS(app) # Cho phép request từ mọi nguồn (để frontend gọi)

# Lấy API key từ file .env
API_KEY = os.getenv('OPENWEATHER_API_KEY')

# URL cơ sở của OpenWeatherMap
WEATHER_URL = "http://api.openweathermap.org/data/2.5/weather"
FORECAST_URL = "http://api.openweathermap.org/data/2.5/forecast"

# Tạo một "đường dẫn" (route) cho thời tiết hiện tại
@app.route('/api/weather')
def get_current_weather():
    # Lấy tất cả các tham số (q=, lat=, lon=, units=, lang=)
    # mà frontend đã gửi
    params = request.args.to_dict()

    # Thêm API key bí mật của chúng ta vào
    params['appid'] = API_KEY

    try:
        # Gọi OpenWeatherMap từ backend
        response = requests.get(WEATHER_URL, params=params)
        response.raise_for_status() # Ném lỗi nếu status code không phải 200

        # Trả dữ liệu (JSON) về cho frontend
        return jsonify(response.json()), response.status_code

    except requests.exceptions.HTTPError as err:
        # Trả lỗi về cho frontend
        return jsonify(err.response.json()), err.response.status_code
    except Exception as e:
        return jsonify({"message": str(e)}), 500

# Tạo một "đường dẫn" (route) cho dự báo
@app.route('/api/forecast')
def get_weather_forecast():
    params = request.args.to_dict()
    params['appid'] = API_KEY

    try:
        response = requests.get(FORECAST_URL, params=params)
        response.raise_for_status()

        return jsonify(response.json()), response.status_code

    except requests.exceptions.HTTPError as err:
        return jsonify(err.response.json()), err.response.status_code
    except Exception as e:
        return jsonify({"message": str(e)}), 500

# Chạy server
if __name__ == '__main__':
    app.run(debug=True, port=5000) # Chạy ở cổng 5000