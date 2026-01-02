# FitSyn - AI-Powered Fitness Tracker

<div align="center">

![FitSyn](https://img.shields.io/badge/FitSyn-AI%20Fitness-667eea?style=for-the-badge)
![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

**Track your fitness journey with an interactive map-based workout logger**

[Live Demo](https://fitnessmap.vercel.app) · [Report Bug](https://github.com/krishnakalwar432-ui/fitnessmap/issues) · [Request Feature](https://github.com/krishnakalwar432-ui/fitnessmap/issues)

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🏃 **Running** | Track distance, duration, pace, and cadence |
| 🚴 **Cycling** | Monitor speed and elevation gain |
| 🥾 **Hiking** | Log elevation with pace tracking |
| 🏊 **Swimming** | Track laps and distance |
| 🧘 **Yoga** | Log duration and intensity |
| 🔥 **Calories** | Automatic calorie estimation using MET values |
| 📊 **Intensity** | Visual LOW/MEDIUM/HIGH indicators |
| 📍 **Map Integration** | Click anywhere to log workouts at that location |
| 💾 **Persistence** | Data saved locally across sessions |
| 🎨 **Premium UI** | Dark glassmorphism design with animations |

---

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Git (for cloning)

### Installation

```bash
# Clone the repository
git clone https://github.com/krishnakalwar432-ui/fitnessmap.git

# Navigate to project
cd fitnessmap

# Start local server (choose one)
npx live-server
# OR
npm start
```

Open `http://localhost:3000` in your browser.

---

## 📖 How to Use

1. **Allow Location** - Grant geolocation access (optional - uses default location if denied)
2. **Click Map** - Click anywhere on the map to log a workout at that location
3. **Select Activity** - Choose from Running, Cycling, Hiking, Swimming, or Yoga
4. **Enter Details** - Fill in distance, duration, and activity-specific metrics
5. **Add Workout** - Click the button to save your session
6. **View Stats** - See total workouts, distance, and calories at the top
7. **Navigate** - Click any workout card to pan the map to its location
8. **Delete** - Hover over a workout and click × to remove it

---

## 🛠️ Tech Stack

- **HTML5** - Semantic structure
- **CSS3** - Glassmorphism, animations, CSS variables
- **JavaScript ES6+** - OOP with classes, async/await
- **Leaflet.js** - Interactive mapping
- **Geolocation API** - Browser location services
- **LocalStorage** - Client-side persistence

---

## 📁 Project Structure

```
fitsyn/
├── index.html      # Main HTML entry point
├── style.css       # All styling (500+ lines)
├── script.js       # Application logic (600+ lines)
├── vercel.json     # Vercel deployment config
├── package.json    # NPM configuration
├── .gitignore      # Git ignore rules
└── README.md       # Documentation
```

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Deploy with default settings

### Manual

Simply upload all files to any static hosting service (Netlify, GitHub Pages, etc.)

---

## 🔒 Privacy

FitSyn respects your privacy:
- ✅ All data stored locally in your browser
- ✅ No external data transmission
- ✅ No tracking or analytics
- ✅ Location data used only for map centering

---

## 🐛 Debugging

Open browser console and run:
```javascript
// Reset all workout data
resetFitSyn();
```

---

## 🤝 Part of FitSyn AI Fitness Suite

This application is a component of the larger FitSyn AI Fitness ecosystem, designed to provide comprehensive fitness tracking and AI-powered workout recommendations.

---

<div align="center">

Made with 💜 for fitness enthusiasts

</div>
