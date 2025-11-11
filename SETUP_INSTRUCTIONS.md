# تعليمات الإعداد السريع

## المشكلة الحالية
```
Error: The `uri` parameter to `openUri()` must be a string, got "undefined"
```

## الحل

### 1. تحديث ملف `.env`

افتح ملف `.env` في المجلد الرئيسي للمشروع وقم بتحديث القيم التالية:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration
# ⚠️ مهم: استبدل هذا بـ MongoDB connection string الخاص بك
MONGODB_URI=mongodb+srv://abdelrhman:abdelrhman@cluster1.5vt9t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1

# JWT Configuration
JWT_SECRET=7b250445d526a53ca994cfe7830922b7f5c2c10d785be1910154e4909b5249f4
JWT_EXPIRE=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### 2. إذا لم يكن لديك MongoDB connection string:

#### خيار 1: استخدام MongoDB Atlas (مجاني)
1. اذهب إلى [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. أنشئ حساب مجاني
3. أنشئ cluster جديد
4. احصل على connection string من "Connect" → "Connect your application"
5. استبدل `<password>` بكلمة المرور الخاصة بك

#### خيار 2: استخدام MongoDB محلي
```env
MONGODB_URI=mongodb://localhost:27017/kmt-db
```

### 3. بعد التحديث

احفظ الملف ثم شغّل:
```bash
npm start
```

## ملاحظات أمنية

⚠️ **مهم جداً:**
- لا تشارك ملف `.env` مع أحد
- لا ترفعه على GitHub
- استخدم كلمات مرور قوية لـ MongoDB
- في الإنتاج، استخدم JWT_SECRET أقوى

## التحقق من الإعداد

بعد تشغيل `npm start`، يجب أن ترى:
```
✅ MongoDB Connected: cluster1-shard-00-00.xxxxx.mongodb.net
Server running on port 3000
Environment: development
```

