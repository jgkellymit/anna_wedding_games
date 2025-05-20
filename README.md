# Wedding Field Day Game Web App

A mobile-first web application designed for a wedding field day event. Includes a login page, event info tab, and an interactive "Assassins" word game.

---

## Features
- **Mobile-optimized UI** for seamless experience on all devices
- **Login** with a single global password (`tiki`)
- **Field Day Info** tab for event details
- **Assassins Game** tab:
  - Enter your name to receive a secret word
  - 5x4 grid of guest names
  - Click a name to guess their word
  - Guess the common theme for extra points

## Tech Stack
- **Frontend:** React + Vite
- **Styling:** Tailwind CSS
- **Backend:** Node.js + Express

---

## Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)

### Steps
1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd wedding-field-day-game
   ```
2. Install dependencies for both frontend and backend:
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```

---

## Usage

### Development
1. Start the backend server:
   ```bash
   cd server
   npm run dev
   ```
2. Start the frontend client:
   ```bash
   cd client
   npm run dev
   ```
3. Open your browser and go to [http://localhost:5173](http://localhost:5173)

### Production
- Build the frontend for production:
  ```bash
  cd client
  npm run build
  ```
- Serve the static files with your preferred web server or integrate with the backend as needed.

---

## Project Structure
```
wedding-field-day-game/
├── client/               # Frontend (React, Vite, Tailwind)
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── App.jsx       # Main app
│   │   └── ...
│   └── ...
├── server/               # Backend (Node.js, Express)
│   ├── index.js          # API server
│   └── ...
├── README.md
└── ...
```

---

## Development
- Follow best practices for React and Node development.
- Use environment variables for secrets (do not hardcode sensitive data).
- Lint and format code before committing.
- Pull requests and code reviews are encouraged.

---

## Deployment
1. Set up your production environment (e.g., Vercel, Netlify, Heroku, or your own server).
2. Push your code to the remote repository.
3. Configure environment variables and secrets as needed.
4. Build and serve the frontend, and run the backend server.

---

## Contributing
- Contributions are welcome! Please fork the repo and open a pull request.
- For major changes, open an issue first to discuss what you’d like to change.

---

## License
This project is for a private wedding event and does not store sensitive information. Please contact the maintainer for reuse or adaptation.

---

## Contact
For questions or support, contact the event organizer or open an issue in this repository.

---

