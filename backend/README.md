# BE docs

## BaseURLs

http://localhost:8000/api

## Endpoints

### 1. Đăng Ký Người Dùng

- **URL:** `/register`
- **Phương thức:** `POST`
- **Mô tả:** Đăng ký người dùng mới.
- **Nội dung yêu cầu:**
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Phản hồi:**
  - `200 OK`: Đăng ký người dùng thành công.
  - `409 Conflict`: Tên người dùng đã tồn tại.
  - `400 Bad Request`: Thiếu tên người dùng hoặc mật khẩu.
  - `500 Internal Server Error`: Lỗi server.

### 2. Đăng Nhập Người Dùng

- **URL:** `/login`
- **Phương thức:** `POST`
- **Mô tả:** Đăng nhập.
- **Nội dung yêu cầu:**
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Phản hồi:**
  - `200 OK`: Đăng nhập thành công.
  - `401 Unauthorized`: Mật khẩu không chính xác.
  - `409 Conflict`: Không tìm thấy tên người dùng.
  - `400 Bad Request`: Thiếu tên người dùng hoặc mật khẩu.
  - `500 Internal Server Error`: Lỗi server.

### 3. Lấy Dữ Liệu Nhiệt Độ Từ Adafruit

- **URL:** `/adafruit-thermal-data`
- **Phương thức:** `GET`
- **Mô tả:** Lấy dữ liệu nhiệt độ từ Adafruit.
- **Phản hồi:**
  - `200 OK`: Trả về dữ liệu nhiệt độ.
  - `500 Internal Server Error`: Lỗi server.

### 4. Lấy Dữ Liệu Đèn và Quạt Từ Adafruit

- **URL:** `/adafruit-lightfan-data`
- **Phương thức:** `GET`
- **Mô tả:** Lấy dữ liệu về đèn và quạt từ Adafruit.
- **Phản hồi:**
  - `200 OK`: Trả về dữ liệu về đèn và quạt.
  - `500 Internal Server Error`: Lỗi server.


## Ví dụ fetch data

Ví dụ lấy data nhiệt độ:

```javascript
const [adafruitData, setAdafruitData] = useState([]);

const API = "http://localhost:8000/api/adafruit-thermal-data";

async function fetchAdafruitData() {
  try {
    const response = await fetch(API);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    setAdafruitData(data);
  } catch (error) {
    console.error('Error fetching Adafruit data:', error);
  }
}

useEffect(() => {
  fetchAdafruitData();
}, []);
```

Hiển thị data:
```jsx
<div className="adafruit-component-content">
  {adafruitData ? (
    <pre>{JSON.stringify(adafruitData, null, 2)}</pre>
    ) : (
    <p>Loading Adafruit data...</p>
  )}
</div>
```

