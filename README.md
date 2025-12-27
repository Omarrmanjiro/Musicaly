# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
-------------------------------------------------------------------------------
# 🎵 Musicaly — Music Streaming App (Expo Router)

Musicaly is a mobile music streaming app built with **Expo (React Native)** using the **modern Expo Router architecture**.

We use:
- Deezer API → music & previews
- Firebase → authentication
- Expo Router → navigation (file-based)

---

## ⚙️ PROJECT SETUP (FOR EVERY TEAM MEMBER)

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Omarrmanjiro/Musicaly.git
cd musicaly


2️⃣ Install dependencies
npm install

Create .env file (DO NOT COMMIT)//if needed not rn
EXPO_PUBLIC_DEEZER_API=https://api.deezer.com
EXPO_PUBLIC_FIREBASE_API_KEY=xxxx
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=xxxx
EXPO_PUBLIC_FIREBASE_PROJECT_ID=xxxx

4️⃣ Run the project
npx expo start

 5 project structure

musicaly/
│
├── app/                 # UI & ROUTES ONLY
│   ├── (auth)/
│   ├── (tabs)/
│   ├── modal.js
│   └── _layout.js
│
├── src/                 # LOGIC ONLY (NO ROUTES)
│   ├── components/
│   ├── context/
│   ├── services/
│   ├── storage/
│   └── styles/
│
├── .env                 # NOT PUSHED
├── app.json
└── README.md



###############################################################################
👥 TEAM ROLES & RESPONSIBILITIES
👤 MEMBER 1 — REGISTER & LOGIN
🎯 Responsibility

User authentication (Firebase)

✅ Tasks

Login screen

Register screen

Handle auth state

Redirect after login

📂 Files you CAN touch
app/(auth)/login.js
app/(auth)/register.js
src/context/AuthContext.js
src/services/firebaseAuth.js
src/storage/userStorage.js





👤 MEMBER 2 — MAIN PAGE & SEARCH
🎯 Responsibility

Home screen + music search

✅ Tasks

Home page UI

Search music via Deezer

Display results

Select track

📂 Files you CAN touch
app/(tabs)/index.js
app/(tabs)/explore.js
src/services/deezer.js
src/context/MusicContext.js


👤 MEMBER 3 — MUSIC PLAYER & PROFILE
🎯 Responsibility

Play music + user profile

✅ Tasks

Play / pause preview

Handle audio lifecycle

Profile screen UI

Display user info

📂 Files you CAN touch
app/modal.js
app/(tabs)/profile.js
src/services/audio.js



MEMBER 4 — PAYMENT SIMULATION & PLAYLIST
🎯 Responsibility

Premium simulation + custom playlists

✅ Tasks

Payment UI (fake / simulated)

Create playlist UI

Save playlist locally

Load saved playlists

📂 Files you CAN touch
app/(tabs)/payment.js
app/(tabs)/playlist.js
src/storage/playlistStorage.js



do not touchhhhhh
(GLOBAL CONFIG) 
Handles:

Firebase config

Deezer API config

.env values

Global routing

Context providers

Final merge to main

🚫 Team members must NOT change global config.


##############################################################
🌿 GIT WORKFLOW
exampleee:::
Each member creates a branch:
git checkout -b feature/login

Commit & push:
git add .
git commit -m "feat: login screen"
git push origin feature/login