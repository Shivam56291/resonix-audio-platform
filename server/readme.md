<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./src/public/white-logo.png">
    <source media="(prefers-color-scheme: light)" srcset="./src/public/logo.png">
    <img src="./src/public/logo.png" width="140" alt="Resonix Logo">
  </picture>
</p>

<h1 align="center">
Resonix Backend Server
</h1>

<p align="center">
<b>Scalable backend powering the Resonix audio streaming platform</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-Backend-green?style=for-the-badge&logo=node.js"/>
  <img src="https://img.shields.io/badge/Express.js-API-black?style=for-the-badge&logo=express"/>
  <img src="https://img.shields.io/badge/MongoDB-Database-darkgreen?style=for-the-badge&logo=mongodb"/>
  <img src="https://img.shields.io/badge/TypeScript-TypeSafe-blue?style=for-the-badge&logo=typescript"/>
</p>

---

## ✨ Server Responsibilities

<div align="center">

| 🔐 Security & Auth | 🎵 Media & Content | 🧠 Data & Architecture |
| :----------------: | :----------------: | :--------------------: |
| **Authentication & Authorization** <br/> Secure user access control | **Audio Upload & Streaming APIs** <br/> Efficient media handling | **Modular Architecture** <br/> Scalable & maintainable design |
| **Email Verification & Password Reset** <br/> Account recovery flows | **Playlists, Favorites & History** <br/> User content management | **Pagination & Aggregation** <br/> Optimized data fetching |
| **Request Validation** <br/> Sanitized & verified inputs | **Recommendations & Auto Playlists** <br/> Smart content discovery | **Secure Media URLs** <br/> Protected asset delivery |

</div>

---

<p align="center">
MVC Pattern · Type-Safe APIs · Centralized Validation
</p>

---

## 🛠 Tech Stack

| 🧱 Layer    | ⚙ Technologies                          |
| :--------- | :-------------------------------------- |
| Core       | Node.js, Express, TypeScript            |
| Database   | MongoDB, Mongoose                       |
| Security   | JWT, Hashing, Secure Tokens             |
| Media      | Cloudinary, Formidable                  |
| Utilities  | Yup, Nodemailer, Cron Jobs              |

---

## 🔐 Environment Variables

Create a `.env` file in the **server root**.

```env
# Database
MONGODB_URI=          # MongoDB connection string

# Server
PORT=                 # Server port (e.g., 5000)

# Email (Mailtrap or other SMTP)
MAILTRAP_USER=        # SMTP username
MAILTRAP_PASS=        # SMTP password
VERIFICATION_EMAIL=   # Email address for sending verification emails
SIGN_IN_URL=          # Frontend login URL
PASSWORD_RESET_LINK=  # Frontend password reset URL

# Security
JWT_SECRET=           # Secret key for JWT signing

# Cloudinary (for media uploads)
CLOUD_NAME=           # Cloudinary cloud name
CLOUD_KEY=            # Cloudinary API key
CLOUD_SECRET=         # Cloudinary API secret

```

<p align="center"> ⚠️ Do not commit `.env` to version control </p>

---

<div align="center">

| 🔄 Core API Capabilities | 🔐 Auth | 🎧 Media |
| :---------------------: | :-----: | :------: |
| User Registration & Verification | JWT-based Sign In | Audio Upload / Update / Delete |
| Password Reset Flow | Favorites & Playlists | History & Recently Played |
| Public Profiles & Followers | Recommendations Engine | &nbsp; |

</div>

---

<div align="center">

| 🧪 Validation | 🛡 Guards | ⚙ Error Handling |
| :-----------: | :------: | :--------------: |
| Yup Schema Validation | Auth Guard | Async Error Handling |
| Central Validator Middleware | isVerified Guard | &nbsp; |

</div>


---


## 🚀 Status

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active_Development-orange?style=for-the-badge"/>
</p>

<p align="center">
Backend is actively evolving with performance, security, and feature improvements.
</p>

---

## 👨‍💻 Author

<p align="center">
<b>Shivam</b><br/>
Backend & Full-Stack Developer
</p>

<p align="center">
⭐ Star the repo if you find it useful
</p>
