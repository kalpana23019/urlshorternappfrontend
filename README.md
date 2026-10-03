# Shortly — URL Shortener Frontend

A modern **React + Vite dashboard** for the Shortly URL Shortener and Click Analytics platform.

The frontend allows users to create short URLs, customize aliases, set expiration dates, manage links, generate QR codes, and monitor click analytics through an interactive dashboard.

## 🚀 Live Demo

**Shortly — URL Shortener**

https://shortly-url-shortener-vert.vercel.app/

## 🔗 Backend API

The frontend communicates with the Spring Boot REST API deployed on Render:

https://url-shortener-backend-spe4.onrender.com

## 📂 Backend Repository

https://github.com/kalpana23019/UrlShortenerApplication

---

# ✨ Features

## 🔗 URL Shortening

Create short URLs from long URLs.

Example:

```text
https://www.example.com/very/long/url
                  ↓
https://your-domain/q0V
```

The frontend sends the URL to the Spring Boot backend and displays the generated short URL.

---

## 🏷️ Custom Aliases

Users can optionally create a custom short URL.

Example:

```text
Original:
https://github.com/kalpana23019

Custom alias:
github

Result:
https://your-domain/github
```

The backend validates alias availability and returns an appropriate error if the alias is already taken.

---

## ⏳ URL Expiration

Users can optionally select an expiration date and time.

Example:

```text
Expiry:
31 December 2026, 11:59 PM
```

Expired links are handled by the backend and return an appropriate `410 Gone` response.

---

## 📊 Analytics Dashboard

The dashboard displays click analytics for each shortened URL.

It includes:

* Total clicks
* Unique visitors
* Top countries
* Top referrers
* Clicks over the last 7 days
* Link performance
* Click activity visualization

Analytics can automatically refresh periodically so that the dashboard reflects new clicks.

---

## 🌍 Country Analytics

The dashboard displays the countries generating clicks.

Example:

```text
India       25
USA          8
Germany      4
UK           3
```

Country information is calculated by the backend from the visitor's IP address.

---

## 🔗 Referrer Analytics

The dashboard displays where visitors came from.

Example:

```text
Direct        20
Google         8
LinkedIn       5
Other          2
```

---

## 📱 QR Code

Users can generate a QR code for a shortened URL.

The QR code can be scanned from a mobile device to open the short URL.

---

## 🚫 Link Management

The frontend supports link deactivation.

When a link is deactivated, the backend prevents further redirects.

The frontend displays the corresponding status/message to the user.

---

## 🔄 Live Analytics

The dashboard periodically refreshes analytics so users can observe changes in click activity without manually refreshing the entire page.

---

# 🛠️ Tech Stack

| Technology    | Purpose                        |
| ------------- | ------------------------------ |
| React         | Frontend UI                    |
| Vite          | Development and build tool     |
| JavaScript    | Application logic              |
| CSS           | Styling                        |
| Axios / Fetch | API communication              |
| React Hooks   | State and lifecycle management |
| Vercel        | Frontend deployment            |
| Git & GitHub  | Version control                |

---

# 🏗️ Frontend Architecture

```text
                         User
                          |
                          ▼
              ┌─────────────────────┐
              │    React Frontend   │
              │        Vite         │
              └──────────┬──────────┘
                         |
                         | HTTP / HTTPS
                         ▼
              ┌─────────────────────┐
              │   Spring Boot API   │
              │       Render        │
              └──────────┬──────────┘
                         |
                         ▼
                    MySQL / Railway
```

---

# 📁 Project Structure

```text
urlshorternappfrontend/
│
├── public/
│   ├── favicon.svg
│   └── icons.svg
│
├── src/
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

---

# 🔌 Backend API Integration

The frontend uses an environment variable to determine which backend API it should communicate with.

The API configuration is:

```javascript
const API =
  import.meta.env.VITE_API_URL || "http://localhost:8080";
```

This provides two environments:

```text
Development
    ↓
http://localhost:8080

Production
    ↓
https://url-shortener-backend-spe4.onrender.com
```

---

# 🔐 Environment Variables

Create a `.env` file in the project root for local development.

```env
VITE_API_URL=http://localhost:8080
```

For production, Vercel uses:

```env
VITE_API_URL=https://url-shortener-backend-spe4.onrender.com
```

### Important

Never commit `.env` files containing private credentials.

The `.gitignore` should contain:

```gitignore
.env
.env.local
.env.*.local
```

---

# 💻 Run Locally

## Prerequisites

Install:

* Node.js
* npm
* Git

Check Node.js:

```bash
node -v
```

Check npm:

```bash
npm -v
```

---

## 1. Clone the Repository

```bash
git clone https://github.com/kalpana23019/urlshorternappfrontend.git
```

Move into the project:

```bash
cd urlshorternappfrontend
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment

Create:

```text
.env
```

Add:

```env
VITE_API_URL=http://localhost:8080
```

Make sure the Spring Boot backend is running on:

```text
http://localhost:8080
```

---

## 4. Start Development Server

```bash
npm run dev
```

Vite will provide a local URL similar to:

```text
http://localhost:5173
```

Open the URL in your browser.

---

# 🏭 Production Build

Create a production build:

```bash
npm run build
```

The generated production files will be placed in:

```text
dist/
```

To preview the production build locally:

```bash
npm run preview
```

---

# 🌐 Deployment

The frontend is deployed using **Vercel**.

Deployment flow:

```text
GitHub
   ↓
Vercel
   ↓
React + Vite
   ↓
Render Backend
```

The production environment variable is:

```text
VITE_API_URL
```

with the value:

```text
https://url-shortener-backend-spe4.onrender.com
```

Every time changes are pushed to the GitHub `main` branch, Vercel can automatically build and deploy the updated frontend.

---

# 🔄 Application Flow

## Create Short URL

```text
User enters long URL
        ↓
React state
        ↓
POST /api/urls
        ↓
Spring Boot
        ↓
MySQL
        ↓
Short URL returned
        ↓
React displays result
```

---

## Redirect

```text
User clicks short URL
        ↓
Render Backend
        ↓
Caffeine Cache
        ↓
Original URL
        ↓
Redirect
        ↓
Async click analytics
```

---

## Analytics

```text
React Dashboard
       ↓
GET /api/urls/{code}/analytics
       ↓
Spring Boot
       ↓
MySQL
       ↓
Analytics JSON
       ↓
React Dashboard
```

---

# 📊 Dashboard Sections

The dashboard provides information such as:

### Link Performance

Displays the selected shortened URL and its performance.

### Total Clicks

Shows the total number of recorded clicks.

### Unique Visitors

Shows the number of distinct visitors based on the backend visitor identification mechanism.

### Countries

Displays the top countries generating traffic.

### Referrers

Displays the most common traffic sources.

### 7-Day Click Activity

Displays click activity across the previous seven days.

---

# 🧩 React Concepts Used

This project demonstrates practical use of React concepts including:

* Functional components
* `useState`
* `useEffect`
* `useCallback`
* `useRef`
* Event handling
* Controlled form inputs
* Conditional rendering
* API requests
* Asynchronous JavaScript
* Component-based UI design
* Environment variables
* Production builds

---

# 🎯 Main User Flow

```text
1. Enter long URL
        ↓
2. Optional custom alias
        ↓
3. Optional expiry date
        ↓
4. Create short URL
        ↓
5. Copy/open short URL
        ↓
6. Visitors click the URL
        ↓
7. Backend records analytics
        ↓
8. Dashboard displays analytics
```

---

# 🧪 Example

Create:

```text
Long URL:
https://github.com/kalpana23019
```

The backend may return:

```text
https://url-shortener-backend-spe4.onrender.com/q0W
```

Opening the short URL redirects the visitor to:

```text
https://github.com/kalpana23019
```

The dashboard then records the click and updates the analytics.

---

# 🔒 CORS Configuration

The production frontend is hosted on Vercel while the backend is hosted on Render.

Therefore, the Spring Boot backend allows requests from:

```text
http://localhost:5173
```

and the production Vercel domain:

```text
https://shortly-url-shortener-vert.vercel.app
```

This allows the frontend to communicate securely with the backend.

---

# 📱 Responsive Design

The frontend is designed to work across:

* Desktop
* Laptop
* Tablet
* Mobile browsers

The dashboard adapts its layout based on screen size.

---

# 🔮 Future Improvements

Possible frontend improvements include:

* User authentication
* Personal URL management
* URL history
* Advanced analytics charts
* Dark/light theme improvements
* Copy-to-clipboard animations
* Export analytics as CSV
* Custom domain management
* Better mobile dashboard experience
* Advanced filtering and date ranges
* Real-time analytics using WebSockets

---

# 🌍 Deployment

**Frontend:** Vercel

**Backend:** Render

**Database:** Railway MySQL

The complete production architecture is:

```text
                         Internet
                            │
                            ▼
              ┌────────────────────────┐
              │   React + Vite         │
              │   Vercel               │
              │                        │
              │   Shortly Dashboard    │
              └────────────┬───────────┘
                           │
                         HTTPS
                           │
                           ▼
              ┌────────────────────────┐
              │   Spring Boot REST API │
              │   Render               │
              └────────────┬───────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │   MySQL                │
              │   Railway              │
              └────────────────────────┘
```

---

# 👩‍💻 Author

**Kalpana Patil**

Java Full Stack Developer

GitHub:
https://github.com/kalpana23019

LinkedIn:
https://www.linkedin.com/in/kalpana-patil-ak2790/

---

# ⭐ Project

**Shortly — URL Shortener & Click Analytics**

A full-stack URL shortening platform built with **React, Vite, Java, Spring Boot, MySQL, Caffeine, Docker, Render, Railway, and Vercel**.
