# DEV@Deakin — P4 Login & Registration (React + Firebase)

## Setup
```
npm install
cp .env.example .env     # fill in your Firebase web-app config
npm run dev
```

1. Firebase Console > create project > Build > **Firestore Database** (create) > Project settings > add a **Web app** and copy the config into `.env`.
2. Firestore rules (development only, see note below):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    match /users/{email} { allow read, create: if true; allow update, delete: if false; }
  }
}
```

## Routes
`/` home · `/login` · `/signup` — Navbar and Footer are rendered once in `Layout` (App.jsx), so they are identical on every page.

## Flow
- **Sign up**: validates name (first + last), email format, password strength, confirm match, then bcrypt hash, saved in Firestore `users/{email}`, then redirect to `/login`.
- **Login**: fetch `users/{email}`, `bcrypt.compare`. Success redirects to `/`; failure shows a retry / sign-up prompt.

## Security note
This task has the browser check credentials against Firestore, so user documents (including hashes) must be readable by the client. Acceptable for a learning task, not for production; real apps should use Firebase Authentication or a server.

`.env` and `node_modules/` are in `.gitignore` — never commit them.
