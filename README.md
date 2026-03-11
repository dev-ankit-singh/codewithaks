# AKS — Personal Portfolio Website

A full-stack personal portfolio website with a **Node.js/Express** backend and a **MongoDB** database for handling contact form submissions.

---

## 📁 Project Structure

```
aks/
├── models/
│   └── Contact.js        # Mongoose schema for contact form data
├── public/
│   ├── images/           # Static image assets
│   ├── index.html        # Main portfolio page
│   ├── style.css         # Stylesheet
│   ├── script.js         # Frontend JavaScript
│   └── resume.pdf        # Downloadable resume
├── server.js             # Express server & API routes
├── package.json
└── README.md
```

---

## 🚀 Features

- **Responsive Design** — Optimized for all screen sizes (mobile, tablet, desktop)
- **Sticky Navigation** — Header remains fixed while scrolling on all devices
- **Contact Form** — Submissions are saved to MongoDB via a REST API
- **Resume Download** — Visitors can download the resume directly
- **Timeline Section** — Visual display of education/experience

---

## 🛠️ Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | HTML, CSS, JavaScript             |
| Backend    | Node.js, Express.js v5            |
| Database   | MongoDB (via Mongoose)            |
| Middleware | body-parser, cors                 |

---

## ⚙️ Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) running locally

---

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd aks
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start MongoDB** (ensure it is running locally on the default port `27017`)

4. **Start the server**
   ```bash
   node server.js
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

---

## 🔗 API Endpoints

| Method | Endpoint       | Description                        |
|--------|----------------|------------------------------------|
| POST   | `/api/contact` | Save a contact form submission     |

### Contact Request Body
```json
{
  "name": "name",
  "email": "email@example.com",
  "message": "Hello!"
}
```

### Response
```json
{ "success": true, "message": "Message sent successfully!" }
```

---

## 🗄️ Database

- **Database name:** `xyz`
- **Collection:** `contacts`
- **Fields:** `name`, `email`, `message`, `date` (auto-set to current timestamp)

---

## 📄 License

ISC
