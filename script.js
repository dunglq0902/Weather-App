// Lấy tham chiếu đến các phần tử HTML
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const weatherResult = document.getElementById('weatherResult');
const forecastResult = document.getElementById('forecastResult');


// ⭐ ĐỊNH NGHĨA URL BACKEND CỦA CHÚNG TA
const BACKEND_URL = 'http://localhost:5000';

// ===========================================
// XỬ LÝ SỰ KIỆN CLICK (Không đổi)
// ===========================================

searchBtn.addEventListener('click', () => {
    const city = cityInput.value;
    if (city) {
        const searchParam = `q=${city}`;
        fetchAllWeather(searchParam);
    } else {
        alert('Vui lòng nhập tên thành phố!');
    }
});

locationBtn.addEventListener('click', () => {
    getUserLocation();
});

function fetchAllWeather(searchParam) {
    // Thêm các tham số chung vào
    const fullParams = `${searchParam}&units=metric&lang=vi`;
    
    getWeather(fullParams);
    getForecast(fullParams);
}

// ===========================================
// HÀM LẤY VỊ TRÍ (Không đổi)
// ===========================================
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onLocationSuccess, onLocationError);
        weatherResult.innerHTML = '<p>Đang lấy vị trí của bạn...</p>';
        forecastResult.innerHTML = ''; 
    } else {
        alert("Trình duyệt của bạn không hỗ trợ định vị.");
    }
}

function onLocationSuccess(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const searchParam = `lat=${lat}&lon=${lon}`;
    fetchAllWeather(searchParam);
}

function onLocationError(error) {
    // ... (Giữ nguyên hàm này)
    let errorMessage = "Có lỗi xảy ra khi lấy vị trí: ";
    switch(error.code) {
        case error.PERMISSION_DENIED:
            errorMessage = "Bạn đã từ chối quyền truy cập vị trí.";
            break;
        case error.POSITION_UNAVAILABLE:
            errorMessage = "Không thể xác định vị trí của bạn.";
            break;
        case error.TIMEOUT:
            errorMessage = "Yêu cầu lấy vị trí hết hạn.";
            break;
        default:
            errorMessage = "Lỗi không xác định.";
    }
    console.error('Lỗi Geolocation:', error);
    weatherResult.innerHTML = `<p style="color: red;">${errorMessage}</p>`;
}


// ===========================================
// HÀM LẤY THỜI TIẾT HIỆN TẠI (Đã sửa)
// ===========================================
async function getWeather(searchParam) {
    weatherResult.innerHTML = '<p>Đang tải dữ liệu...</p>';
    
    // ⭐ THAY ĐỔI: Gọi đến backend của chúng ta
    // Không cần &appid=${apiKey} nữa
    const apiUrl = `${BACKEND_URL}/api/weather?${searchParam}`;

    try {
        const response = await fetch(apiUrl); // Gọi đến localhost:5000
        
        // Backend của chúng ta đã xử lý lỗi và trả về JSON lỗi
        // nên chúng ta chỉ cần đọc nó
        const data = await response.json(); 
        
        if (!response.ok) {
            // Hiển thị lỗi mà backend gửi về
            throw new Error(data.message || 'Lỗi từ máy chủ.');
        }
        
        displayWeather(data);
    } catch (error) {
        console.error('Lỗi khi gọi API (hiện tại):', error);
        weatherResult.innerHTML = `<p style="color: red;">Lỗi: ${error.message}</p>`;
    }
}

// ===========================================
// HÀM LẤY DỰ BÁO 5 NGÀY (Đã sửa)
// ===========================================
async function getForecast(searchParam) {
    forecastResult.innerHTML = ''; 

    // ⭐ THAY ĐỔI: Gọi đến backend của chúng ta
    const forecastApiUrl = `${BACKEND_URL}/api/forecast?${searchParam}`;

    try {
        const response = await fetch(forecastApiUrl); // Gọi đến localhost:5000
        const data = await response.json();
        
        if (!response.ok) {
             throw new Error(data.message || 'Lỗi từ máy chủ.');
        }
        
        // Cập nhật tên thành phố (giữ nguyên logic cũ)
        if (data && data.city) {
            const currentCityElement = weatherResult.querySelector('h3');
            if (currentCityElement && currentCityElement.innerHTML.includes('vị trí của bạn')) {
                currentCityElement.innerHTML = `Thời tiết tại ${data.city.name}`;
            }
        }
        
        displayForecast(data);

    } catch (error) {
        console.error('Lỗi khi gọi API (dự báo):', error);
    }
}

// ===========================================
// CÁC HÀM HIỂN THỊ (Không đổi)
// ===========================================
// (Giữ nguyên toàn bộ 2 hàm displayWeather và displayForecast)

function displayWeather(data) {
    const cityName = data.name;
    const temperature = data.main.temp;
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;

    const cityDisplayName = cityName ? `Thời tiết tại ${cityName}` : 'Thời tiết tại vị trí của bạn';

    weatherResult.innerHTML = `
        <h3>${cityDisplayName}</h3>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
        <p><strong>Nhiệt độ:</strong> ${temperature}°C</p>
        <p><strong>Tình trạng:</strong> ${description}</p>
        <p><strong>Độ ẩm:</strong> ${humidity}%</p>
        <p><strong>Tốc độ gió:</strong> ${windSpeed} m/s</p>
    `;
}

function displayForecast(data) {
    const dailyForecasts = data.list.filter(item => {
        return item.dt_txt.includes("12:00:00");
    });

    let forecastHTML = '<h3>Dự báo 5 ngày (lúc 12:00 trưa)</h3>';
    forecastHTML += '<div class="forecast-container">'; 

    dailyForecasts.forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayOfWeek = date.toLocaleDateString('vi-VN', { weekday: 'short' });
        const dateOfMonth = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });

        const temp = day.main.temp;
        const icon = day.weather[0].icon;
        const description = day.weather[0].description;

        forecastHTML += `
            <div class="forecast-day">
                <p><strong>${dayOfWeek}</strong></p>
                <p>${dateOfMonth}</p>
                <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${description}">
                <p><strong>${temp}°C</strong></p>
            </div>
        `;
    });

    forecastHTML += '</div>';
    forecastResult.innerHTML = forecastHTML;
}