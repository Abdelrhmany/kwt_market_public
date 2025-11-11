# Environment Variables Setup

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration
# Replace with your actual MongoDB connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority&appName=ClusterName

# JWT Configuration
# IMPORTANT: Change this to a strong random string in production
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-characters
JWT_EXPIRE=7d

# CORS Configuration
# Set to your frontend URL in production
CORS_ORIGIN=http://localhost:3000

# QR Code Protection
# Secret token to access QR code page (change this!)
QR_SECRET=your-secure-qr-secret-token
```

## Security Notes

1. **Never commit `.env` file to version control**
2. **Use strong, random JWT_SECRET** (at least 32 characters)
3. **Change default MongoDB credentials**
4. **Set NODE_ENV=production in production environment**
5. **Restrict CORS_ORIGIN to your actual frontend domain in production**

## Generating JWT Secret

You can generate a secure JWT secret using:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

