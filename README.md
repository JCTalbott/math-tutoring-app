# Math Tutor App

A secure educational web application with three practice sections for different math topics.

## Features

- **Secure Authentication**: Firebase email/password authentication
- **Geometry Section**: Practice angle relationships with parallel lines and transversals
- **Calculus Section**: Master derivative rules and function differentiation
- **Algebra Section**: Practice polynomial multiplication using the FOIL method

## Sections

### 📐 Geometry
- Interactive SVG diagram showing parallel lines and a transversal
- Practice identifying angle relationships: corresponding, consecutive, alternative, alternative interior, vertical, and linear pair
- Visual feedback with highlighted angles
- Score tracking and explanations

### 📊 Calculus
- Practice identifying which derivative rule to apply
- Covers: Power Rule, Chain Rule, Product Rule, Quotient Rule, and basic derivatives (ln, sin, cos, exp)
- Function-based problems with detailed explanations
- Rules reference guide

### 🔢 Algebra
- Polynomial multiplication practice
- Uses FOIL method for binomial multiplication
- Input validation and answer checking
- FOIL method reference and examples

## Setup Instructions

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Firebase**:
   - Create a new Firebase project at https://console.firebase.google.com
   - Enable Authentication with Email/Password
   - Copy your Firebase config to `src/firebase/config.js`
   - Replace the placeholder values with your actual Firebase configuration

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## Firebase Configuration

Update `src/firebase/config.js` with your Firebase project details:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

## Deployment to Netlify

1. **Connect your repository** to Netlify
2. **Set build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Deploy** - the app is configured with `netlify.toml` for automatic deployment

## Security Features

- All sections require authentication
- Protected routes prevent unauthorized access
- User sessions managed through Firebase Auth
- Secure email/password authentication

## Technologies Used

- React 18 with Vite
- React Router for navigation
- Firebase Authentication
- CSS Grid and Flexbox for responsive design
- SVG for interactive geometry diagrams

## Browser Support

- Modern browsers with ES6+ support
- Responsive design works on desktop, tablet, and mobile devices
