# DukaanMitra

AI + Voice assistant for small shopkeepers.

Features:
- Inventory management
- Sales and profit tracking
- Customer khata
- Low-stock alerts
- Hindi/Hinglish voice commands
- Optional Groq AI command understanding
- Dashboard

## Setup

### Backend
```bash
cd backend
npm install
```

Create `.env`:
```env
MONGO_URI=your_mongodb_atlas_connection_string
PORT=5000
GROQ_API_KEY=
```

Run:
```bash
npm run dev
```

### Frontend
Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in terminal.

Voice examples:
- "Maggi stock mein 10 aayi"
- "Aaj kitna profit hua"
- "Rahul ko 500 rupaye ka samaan diya"
- "Maggi ke 2 packet beche"
