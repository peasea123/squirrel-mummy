# Squirrel Mummy

A minimal, cinematic, mystery-themed website built with Next.js and deployed on Vercel.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set the Password

Create a `.env.local` file in the project root:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and set your password:

```
SQUIRREL_MUMMY_PASSWORD=your_secret_password
```

### 3. Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

## Deployment

This project is ready for immediate deployment to Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add the environment variable in Vercel's dashboard:
   - **Variable:** `SQUIRREL_MUMMY_PASSWORD`
   - **Value:** Your chosen password
4. Deploy

## Project Structure

```
squirrelmummy/
├── app/
│   ├── api/
│   │   └── verify/
│   │       └── route.js          # Password verification API
│   ├── enter/
│   │   ├── page.js               # Password gate page
│   │   └── enter.module.css
│   ├── inner/
│   │   ├── page.js               # Secret inner page
│   │   └── inner.module.css
│   ├── layout.js                 # Root layout
│   ├── globals.css               # Global styles
│   ├── page.js                   # Landing page
│   └── landing.module.css
├── public/
│   └── SquirrelMummy.png         # Hero image
├── .env.local.example            # Environment template
├── package.json
├── next.config.js
└── README.md
```

## Pages

- **/** - Landing page with full-screen hero image
- **/enter** - Password gate with ceremonial language
- **/inner** - Secret archive page (password-protected)
- **/api/verify** - Password verification endpoint

## Security

- Password is stored in environment variables only
- Never exposed to client-side code
- Verified via secure API route
- Not accessible in version control (`.env.local` is in `.gitignore`)

## Design Philosophy

- Dark mode only
- Minimal, elegant typography
- Cinematic presentation
- Mystery and intrigue over clarity
- No unnecessary UI elements

---

*Some mysteries are not meant to be solved.*
