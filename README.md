# 🛍️ KMT Marketplace Backend API

<div dir="rtl">

## 📋 نظرة عامة

Backend API متكامل لمنصة سوق إلكتروني (Marketplace) مبني باستخدام Node.js و Express.js. يوفر نظام مصادقة آمن، إدارة المنتجات، ودمج مع WhatsApp لإرسال رموز التحقق.

</div>

## 🌟 Features

### 🔐 Authentication & Security
- **Phone-based Authentication** - تسجيل دخول عبر رقم الهاتف
- **JWT Token Authentication** - نظام مصادقة آمن باستخدام JWT
- **Password Hashing** - تشفير كلمات المرور باستخدام bcrypt (12 rounds)
- **OTP Verification** - رموز تحقق يتم إرسالها عبر WhatsApp
- **Rate Limiting** - حماية من الهجمات والاستخدام المفرط
- **Input Validation** - التحقق من جميع المدخلات
- **CORS Protection** - حماية من Cross-Origin Requests

### 📱 WhatsApp Integration
- **Baileys Integration** - دمج مع WhatsApp Web API
- **QR Code Authentication** - مصادقة عبر QR Code
- **Automatic OTP Sending** - إرسال تلقائي لرموز التحقق
- **Session Management** - إدارة جلسات WhatsApp تلقائياً

### 🛍️ Product Management
- **CRUD Operations** - إنشاء، قراءة، تحديث، حذف المنتجات
- **Image Upload** - رفع حتى 5 صور لكل منتج
- **Image to Base64** - تحويل الصور إلى Base64 للعرض
- **Category Filtering** - تصفية حسب الفئة
- **Pagination** - تقسيم النتائج إلى صفحات
- **Search & Filter** - بحث وتصفية متقدمة

### 🏗️ Architecture & Code Quality
- **MVC Pattern** - معمارية منظمة (Models, Views, Controllers)
- **Middleware System** - نظام middleware مرن
- **Error Handling** - معالجة شاملة للأخطاء
- **Environment Variables** - إدارة آمنة للمتغيرات
- **Code Organization** - كود منظم وسهل الصيانة

## 🛠️ Tech Stack

### Core
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB

### Authentication & Security
- **JWT (jsonwebtoken)** - Token-based authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **express-rate-limit** - Rate limiting

### WhatsApp Integration
- **@whiskeysockets/baileys** - WhatsApp Web API client
- **qrcode** - QR code generation
- **pino** - Logging

### File Handling
- **multer** - File upload handling

### Utilities
- **dotenv** - Environment variables
- **cors** - Cross-Origin Resource Sharing

## 📁 Project Structure

```
kmt-backend/
├── config/
│   ├── database.js          # MongoDB connection configuration
│   └── whatsapp.js          # WhatsApp Baileys client setup
├── controllers/
│   ├── authController.js    # Authentication logic
│   └── itemController.js   # Product/Item management logic
├── middleware/
│   ├── auth.js             # JWT authentication middleware
│   ├── errorHandler.js     # Global error handling
│   ├── qrAuth.js           # QR code route protection
│   ├── rateLimiter.js      # Rate limiting configuration
│   └── validation.js       # Input validation rules
├── models/
│   ├── item.js             # Product/Item schema
│   └── user.js             # User schema with password hashing
├── routes/
│   ├── auth.js             # Authentication routes
│   ├── items.js            # Product/Item routes
│   └── index.js            # Main routes & QR code route
├── uploads/                # Uploaded images directory
├── auth_info_baileys/      # WhatsApp session data
├── app.js                  # Main application entry point
├── upload.js               # Multer configuration
├── .env                    # Environment variables (not in repo)
├── .gitignore              # Git ignore rules
└── package.json            # Dependencies
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Step 1: Clone Repository
```bash
git clone https://github.com/yourusername/kmt-backend.git
cd kmt-backend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Environment Configuration
Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRE=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# QR Code Protection
QR_SECRET=your-secure-qr-secret-token
```

### Step 4: Generate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 5: Start Server
```bash
npm start
```

### Step 6: Setup WhatsApp
1. Visit `http://localhost:3000/back/qr?secret=YOUR_QR_SECRET`
2. Scan QR code with your WhatsApp
3. Wait for "WhatsApp Client is ready!" message

## 📡 API Endpoints

### Authentication Endpoints

#### Register User
```http
POST /back/auth/register
Content-Type: application/json

{
  "phoneNumber": "201234567890",
  "username": "johndoe",
  "password": "securepassword123"
}
```

#### Verify Account
```http
POST /back/auth/verify
Content-Type: application/json

{
  "phoneNumber": "201234567890",
  "verificationCode": "123456"
}
```

#### Login
```http
POST /back/auth/login
Content-Type: application/json

{
  "phoneNumber": "201234567890",
  "password": "securepassword123"
}
```

#### Reset Password (Send Code)
```http
POST /back/auth/reset-password
Content-Type: application/json

{
  "phoneNumber": "201234567890"
}
```

#### Update Password
```http
POST /back/auth/update-password
Content-Type: application/json

{
  "phoneNumber": "201234567890",
  "verificationCode": "123456",
  "newPassword": "newsecurepassword123"
}
```

### Product/Item Endpoints

#### Get All Items
```http
GET /back/items?page=1&limit=20&category=Cars&condition=new
Authorization: Bearer <token> (optional)
```

#### Get Single Item
```http
GET /back/items/:id
```

#### Create Item
```http
POST /back/items
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "title": "iPhone 13 Pro",
  "description": "Like new condition",
  "price": 25000,
  "location": "Cairo",
  "category": "Electronics",
  "condition": "used",
  "subcategory": "Mobile Phones",
  "images": [file1, file2, ...]
}
```

#### Update Item
```http
PUT /back/items/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

#### Delete Item
```http
DELETE /back/items/:id
Authorization: Bearer <token>
```

### Other Endpoints

#### Health Check
```http
GET /back/health
```

#### QR Code (Protected)
```http
GET /back/qr?secret=YOUR_QR_SECRET
```

#### Admin Panel
```http
GET /back
```

## 🔒 Security Features

### Password Security
- ✅ Bcrypt hashing with 12 rounds
- ✅ Minimum 6 characters requirement
- ✅ Never exposed in API responses

### Authentication
- ✅ JWT tokens with expiration
- ✅ Token verification on protected routes
- ✅ User verification required before login

### API Protection
- ✅ Rate limiting (100 requests/15min general, 5/15min auth)
- ✅ Input validation on all endpoints
- ✅ CORS configuration
- ✅ QR code route protection

### Data Protection
- ✅ Environment variables for sensitive data
- ✅ Password never logged or exposed
- ✅ Secure file upload validation

## 📊 Database Schema

### User Schema
```javascript
{
  phoneNumber: String (unique, required),
  username: String (required, 3-30 chars),
  password: String (hashed, required),
  verificationCode: String,
  verificationCodeExpiry: Date,
  verified: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Item Schema
```javascript
{
  title: String (required, max 4 words),
  description: String (required, max 1000 chars),
  price: Number (required, min 0),
  location: String (required),
  condition: Enum ['new', 'used'],
  category: Enum ['Cars', 'Property', 'Services', ...],
  subcategory: String,
  images: [String],
  status: Enum ['active', 'sold'] (default: 'active'),
  sellerid: String (required),
  sellername: String (required),
  datePosted: Date (default: now)
}
```

## 🧪 Testing

### Test Authentication Flow
1. Register a new user
2. Check WhatsApp for verification code
3. Verify account with code
4. Login with credentials
5. Use JWT token for protected routes

### Test Product Management
1. Create item with images (requires auth)
2. Get all items (public)
3. Get single item (public)
4. Update item (requires auth + ownership)
5. Delete item (requires auth + ownership)

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Check `.env` file has correct `MONGODB_URI`
- Verify MongoDB cluster is accessible
- Check network connectivity

### WhatsApp Connection Issues
- Delete `auth_info_baileys` folder and restart
- Ensure internet connection is stable
- Check if WhatsApp Web API is accessible in your region

### Authentication Issues
- Verify JWT_SECRET is set in `.env`
- Check token expiration
- Ensure user is verified before login

## 📝 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | 3000 |
| `NODE_ENV` | Environment | No | development |
| `MONGODB_URI` | MongoDB connection string | Yes | - |
| `JWT_SECRET` | JWT signing secret | Yes | - |
| `JWT_EXPIRE` | Token expiration | No | 7d |
| `CORS_ORIGIN` | Allowed origin | No | * |
| `QR_SECRET` | QR code access secret | No | kmt-admin-2024 |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

ISC License

## 👤 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- [Baileys](https://github.com/WhiskeySockets/Baileys) - WhatsApp Web API
- [Express.js](https://expressjs.com/) - Web framework
- [Mongoose](https://mongoosejs.com/) - MongoDB ODM

---

<div align="center">
  Made with ❤️ using Node.js & Express.js
</div>
