# BE docs

## BaseURLs

`http://localhost:8000/api`

`https://dadn-2.onrender.com/api`

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
- Khi đăng nhập thành công, sẽ có một token trả về. Mọi người lưu token này vào để fetch API.

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

### 3. Đổi mật khẩu

- **URL:** `/changePassword`
- **Phương thức:** `POST`
- **Mô tả:** Đổi mật khẩu ứng với username gửi về.
- **Nội dung yêu cầu:**
  ```json
  {
    "username": "string",
    "password": "string",
    "newpassword": "string"
  }
  ```

**_Yêu cầu token ở header của request._**

- **Phản hồi:**
  - `200 OK`: Đăng nhập thành công.
  - `401 Unauthorized`: Mật khẩu không chính xác.
  - `409 Conflict`: Không tìm thấy tên người dùng.
  - `400 Bad Request`: Thiếu tên người dùng hoặc mật khẩu.
  - `500 Internal Server Error`: Lỗi server.

### 4. Lấy Dữ Liệu Nhiệt Độ Từ Adafruit

- **URL:** `/adafruit-thermal-data`
- **Phương thức:** `GET`
- **Mô tả:** Lấy dữ liệu nhiệt độ từ Adafruit.
- **Phản hồi:**
  - `200 OK`: Trả về dữ liệu nhiệt độ.
  - `500 Internal Server Error`: Lỗi server.

**_Yêu cầu token ở header của request._**

### 5. Lấy Dữ Liệu Đèn Từ Adafruit

- **URL:** `/adafruit-light-data`
- **Phương thức:** `GET`
- **Mô tả:** Lấy dữ liệu đèn từ Adafruit.
- **Phản hồi:**
  - `200 OK`: Trả về dữ liệu đèn.
  - `500 Internal Server Error`: Lỗi server.

**_Yêu cầu token ở header của request._**

### 6. Lấy Dữ Liệu Độ Ẩm Đất Từ Adafruit

- **URL:** `/adafruit-earth-humid-data`
- **Phương thức:** `GET`
- **Mô tả:** Lấy dữ liệu độ ẩm đất từ Adafruit.
- **Phản hồi:**
  - `200 OK`: Trả về dữ liệu độ ẩm đất.
  - `500 Internal Server Error`: Lỗi server.

**_Yêu cầu token ở header của request._**

### 7. Lấy Dữ Liệu Độ Ẩm Không Khí Từ Adafruit

- **URL:** `/adafruit-humid-data`
- **Phương thức:** `GET`
- **Mô tả:** Lấy dữ liệu độ ẩm không khí từ Adafruit.
- **Phản hồi:**
  - `200 OK`: Trả về dữ liệu độ ẩm không khí.
  - `500 Internal Server Error`: Lỗi server.

**_Yêu cầu token ở header của request._**

## Ví dụ fetch data (ReactJS)

Fetch data nhiệt độ:

```javascript
const [adafruitData, setAdafruitData] = useState([]);

const API = `${BaseURL}/adafruit-thermal-data`;

async function fetchAdafruitData() {
  try {
    const response = await fetch(API,
        headers: {
          Authorization: `Bearer ${token}`,
        },
    );
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
