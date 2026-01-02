'use strict';

// ==========================================
// FitSyn - AI-Powered Fitness Tracker
// Advanced Workout Tracking Application
// ==========================================

// DOM Elements
const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
const inputLaps = document.querySelector('.form__input--laps');
const formClose = document.getElementById('formClose');
const clearAllBtn = document.getElementById('clearAll');
const emptyState = document.getElementById('emptyState');
const welcomeToast = document.getElementById('welcomeToast');
const toastClose = document.getElementById('toastClose');
const particlesContainer = document.getElementById('particles');

// Stats elements
const totalWorkoutsEl = document.getElementById('totalWorkouts');
const totalDistanceEl = document.getElementById('totalDistance');
const totalCaloriesEl = document.getElementById('totalCalories');

// Calorie calculation constants (MET values)
const MET_VALUES = {
  running: 9.8,
  cycling: 7.5,
  hiking: 6.0,
  swimming: 8.0,
  yoga: 3.0
};

// Activity emojis
const ACTIVITY_EMOJIS = {
  running: '🏃',
  cycling: '🚴',
  hiking: '🥾',
  swimming: '🏊',
  yoga: '🧘'
};

// ==========================================
// Particle Animation System
// ==========================================
class ParticleSystem {
  constructor(container) {
    this.container = container;
    this.particleCount = 30;
    this.init();
  }

  init() {
    for (let i = 0; i < this.particleCount; i++) {
      this.createParticle(i);
    }
  }

  createParticle(index) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    // Random positioning and timing
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${(index / this.particleCount) * 15}s`;
    particle.style.animationDuration = `${15 + Math.random() * 10}s`;

    // Random size variation
    const size = 2 + Math.random() * 4;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    this.container.appendChild(particle);
  }
}

// Initialize particles
if (particlesContainer) {
  new ParticleSystem(particlesContainer);
}

// ==========================================
// Workout Classes
// ==========================================

class Workout {
  id = Date.now() + Math.random().toString(36).substr(2, 9);
  date = new Date();

  constructor(lat, lng, distance, duration) {
    this.lat = lat;
    this.lng = lng;
    this.distance = distance;
    this.duration = duration;
  }

  _setDescription() {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    const day = this.date.getDate();
    const suffix = day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th';
    this.description = `${this.type.charAt(0).toUpperCase() + this.type.slice(1)} on ${months[this.date.getMonth()]} ${day}${suffix}`;
  }

  _calcCalories() {
    const weight = 70; // Average weight in kg
    const timeInHours = this.duration / 60;
    this.calories = Math.round(MET_VALUES[this.type] * weight * timeInHours);
    return this.calories;
  }

  _calcIntensity() {
    if (this.type === 'running') {
      const pace = this.duration / this.distance;
      this.intensity = pace > 7 ? 'low' : pace > 5 ? 'medium' : 'high';
    } else if (this.type === 'cycling') {
      const speed = this.distance / (this.duration / 60);
      this.intensity = speed < 15 ? 'low' : speed < 25 ? 'medium' : 'high';
    } else if (this.type === 'hiking') {
      const pace = this.duration / this.distance;
      this.intensity = pace > 15 ? 'low' : pace > 10 ? 'medium' : 'high';
    } else if (this.type === 'swimming') {
      const pace = this.duration / this.distance;
      this.intensity = pace > 30 ? 'low' : pace > 20 ? 'medium' : 'high';
    } else if (this.type === 'yoga') {
      this.intensity = this.duration < 30 ? 'low' : this.duration < 60 ? 'medium' : 'high';
    }
    return this.intensity;
  }
}

class Running extends Workout {
  type = 'running';

  constructor(lat, lng, distance, duration, cadence) {
    super(lat, lng, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
    this._calcCalories();
    this._calcIntensity();
  }

  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  type = 'cycling';

  constructor(lat, lng, distance, duration, elevationGain) {
    super(lat, lng, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
    this._setDescription();
    this._calcCalories();
    this._calcIntensity();
  }

  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

class Hiking extends Workout {
  type = 'hiking';

  constructor(lat, lng, distance, duration, elevationGain) {
    super(lat, lng, distance, duration);
    this.elevationGain = elevationGain;
    this.calcPace();
    this._setDescription();
    this._calcCalories();
    this._calcIntensity();
  }

  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Swimming extends Workout {
  type = 'swimming';

  constructor(lat, lng, distance, duration, laps) {
    super(lat, lng, distance, duration);
    this.laps = laps;
    this.calcPace();
    this._setDescription();
    this._calcCalories();
    this._calcIntensity();
  }

  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Yoga extends Workout {
  type = 'yoga';

  constructor(lat, lng, distance, duration) {
    super(lat, lng, distance, duration);
    this._setDescription();
    this._calcCalories();
    this._calcIntensity();
  }
}

// ==========================================
// Main Application Class
// ==========================================

class App {
  #map;
  #mapE;
  #workouts = [];
  #markers = [];
  #mapZoomLevel = 14;

  constructor() {
    // Get user's position
    this._getPosition();

    // Get data from local storage
    this._getLocalStorage();

    // Attach event handlers
    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggleInputFields.bind(this));
    containerWorkouts.addEventListener('click', this._handleWorkoutClick.bind(this));

    if (formClose) {
      formClose.addEventListener('click', this._hideForm.bind(this));
    }

    if (clearAllBtn) {
      clearAllBtn.addEventListener('click', this._confirmClearAll.bind(this));
    }

    if (toastClose) {
      toastClose.addEventListener('click', () => {
        welcomeToast.classList.add('hidden');
      });
    }

    // Hide welcome toast after 6 seconds
    setTimeout(() => {
      if (welcomeToast) welcomeToast.classList.add('hidden');
    }, 6000);

    // Update stats
    this._updateStats();
    this._updateEmptyState();
  }

  _getPosition() {
    // Default: Mumbai, India
    const defaultLat = 19.0760;
    const defaultLng = 72.8777;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        () => {
          this._loadMap({
            coords: { latitude: defaultLat, longitude: defaultLng }
          });
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      this._loadMap({
        coords: { latitude: defaultLat, longitude: defaultLng }
      });
    }
  }

  _loadMap(position) {
    const { latitude, longitude } = position.coords;

    this.#map = L.map('map', {
      zoomControl: true,
      attributionControl: false
    }).setView([latitude, longitude], this.#mapZoomLevel);

    // Dark themed map tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 20,
      subdomains: 'abcd'
    }).addTo(this.#map);

    // Add zoom control to bottom right
    this.#map.zoomControl.setPosition('bottomright');

    // Map click handler
    this.#map.on('click', this._showForm.bind(this));

    // Render existing markers
    this.#workouts.forEach(workout => {
      this._renderWorkoutMarker(workout);
    });
  }

  _showForm(e) {
    this.#mapE = e;
    form.classList.remove('hidden');

    // Focus on first input after animation
    setTimeout(() => inputDistance.focus(), 300);
  }

  _hideForm() {
    // Clear inputs
    inputDistance.value = '';
    inputDuration.value = '';
    inputCadence.value = '';
    inputElevation.value = '';
    if (inputLaps) inputLaps.value = '';

    form.classList.add('hidden');
  }

  _toggleInputFields() {
    const type = inputType.value;

    const cadenceRow = document.querySelector('.form__row--cadence');
    const elevationRow = document.querySelector('.form__row--elevation');
    const lapsRow = document.querySelector('.form__row--laps');

    // Hide all optional rows first
    cadenceRow.classList.add('form__row--hidden');
    elevationRow.classList.add('form__row--hidden');
    if (lapsRow) lapsRow.classList.add('form__row--hidden');

    // Show relevant row based on type
    switch (type) {
      case 'running':
        cadenceRow.classList.remove('form__row--hidden');
        break;
      case 'cycling':
      case 'hiking':
        elevationRow.classList.remove('form__row--hidden');
        break;
      case 'swimming':
        if (lapsRow) lapsRow.classList.remove('form__row--hidden');
        break;
      case 'yoga':
        // No additional fields for yoga
        break;
    }
  }

  _newWorkout(e) {
    e.preventDefault();

    // Check if map was clicked
    if (!this.#mapE) {
      return this._showAlert('Please click on the map first to select a location', 'error');
    }

    const { lat, lng } = this.#mapE.latlng;
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;

    let workout;

    // Validation helper
    const isValid = (...inputs) => inputs.every(inp => Number.isFinite(inp) && inp > 0);

    // Create workout based on type
    switch (type) {
      case 'running': {
        const cadence = +inputCadence.value;
        if (!isValid(distance, duration, cadence)) {
          return this._showAlert('Please enter valid positive numbers for all fields', 'error');
        }
        workout = new Running(lat, lng, distance, duration, cadence);
        break;
      }

      case 'cycling': {
        const elevation = +inputElevation.value;
        if (!isValid(distance, duration) || !Number.isFinite(elevation)) {
          return this._showAlert('Please enter valid numbers for all fields', 'error');
        }
        workout = new Cycling(lat, lng, distance, duration, elevation);
        break;
      }

      case 'hiking': {
        const elevation = +inputElevation.value;
        if (!isValid(distance, duration) || !Number.isFinite(elevation)) {
          return this._showAlert('Please enter valid numbers for all fields', 'error');
        }
        workout = new Hiking(lat, lng, distance, duration, elevation);
        break;
      }

      case 'swimming': {
        const laps = inputLaps ? +inputLaps.value : 0;
        if (!isValid(distance, duration)) {
          return this._showAlert('Please enter valid numbers for all fields', 'error');
        }
        workout = new Swimming(lat, lng, distance, duration, laps || 0);
        break;
      }

      case 'yoga': {
        if (!isValid(duration)) {
          return this._showAlert('Please enter a valid duration', 'error');
        }
        // Yoga doesn't need distance, set to 0
        workout = new Yoga(lat, lng, 0, duration);
        break;
      }
    }

    // Add to workouts array
    this.#workouts.push(workout);

    // Render workout marker on map
    this._renderWorkoutMarker(workout);

    // Render workout in list
    this._renderWorkout(workout);

    // Save to localStorage
    this._setLocalStorage();

    // Update stats
    this._updateStats();
    this._updateEmptyState();

    // Hide form
    this._hideForm();

    // Reset map event
    this.#mapE = null;

    // Show success message
    this._showAlert(`${workout.type.charAt(0).toUpperCase() + workout.type.slice(1)} workout added successfully!`, 'success');
  }

  _showAlert(message, type = 'error') {
    // Remove existing alerts
    document.querySelectorAll('.custom-alert').forEach(el => el.remove());

    const alertEl = document.createElement('div');
    alertEl.className = `custom-alert ${type === 'success' ? 'success-alert' : ''}`;
    alertEl.innerHTML = `
      <span>${type === 'success' ? '✅' : '⚠️'}</span>
      <span>${message}</span>
    `;

    document.body.appendChild(alertEl);

    setTimeout(() => {
      alertEl.style.animation = 'alertSlideDown 0.3s ease reverse';
      setTimeout(() => alertEl.remove(), 300);
    }, 3000);
  }

  _renderWorkoutMarker(workout) {
    const emoji = ACTIVITY_EMOJIS[workout.type] || '📍';

    const marker = L.marker([workout.lat, workout.lng])
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 280,
          minWidth: 200,
          closeOnClick: false,
          autoClose: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(`
        <div class="popup-content">
          <div class="popup-emoji">${emoji}</div>
          <div class="popup-title">${workout.description}</div>
          <div class="popup-stats">
            ${workout.distance > 0 ? `${workout.distance} km • ` : ''}${workout.duration} min • ${workout.calories} kcal
          </div>
        </div>
      `)
      .openPopup();

    this.#markers.push({ id: workout.id, marker });
  }

  _renderWorkout(workout) {
    const emoji = ACTIVITY_EMOJIS[workout.type] || '📍';

    let detailsHtml = '';

    // Common details for most workouts
    if (workout.distance > 0) {
      detailsHtml += `
        <div class="workout__details">
          <span class="workout__icon">📏</span>
          <span class="workout__value">${workout.distance}</span>
          <span class="workout__unit">km</span>
        </div>
      `;
    }

    detailsHtml += `
      <div class="workout__details">
        <span class="workout__icon">⏱️</span>
        <span class="workout__value">${workout.duration}</span>
        <span class="workout__unit">min</span>
      </div>
    `;

    // Type-specific details
    if (workout.type === 'running') {
      detailsHtml += `
        <div class="workout__details">
          <span class="workout__icon">⚡</span>
          <span class="workout__value">${workout.pace.toFixed(1)}</span>
          <span class="workout__unit">min/km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">🦶</span>
          <span class="workout__value">${workout.cadence}</span>
          <span class="workout__unit">spm</span>
        </div>
      `;
    }

    if (workout.type === 'cycling') {
      detailsHtml += `
        <div class="workout__details">
          <span class="workout__icon">⚡</span>
          <span class="workout__value">${workout.speed.toFixed(1)}</span>
          <span class="workout__unit">km/h</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⛰️</span>
          <span class="workout__value">${workout.elevationGain}</span>
          <span class="workout__unit">m</span>
        </div>
      `;
    }

    if (workout.type === 'hiking') {
      detailsHtml += `
        <div class="workout__details">
          <span class="workout__icon">⚡</span>
          <span class="workout__value">${workout.pace.toFixed(1)}</span>
          <span class="workout__unit">min/km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⛰️</span>
          <span class="workout__value">${workout.elevationGain}</span>
          <span class="workout__unit">m</span>
        </div>
      `;
    }

    if (workout.type === 'swimming' && workout.laps) {
      detailsHtml += `
        <div class="workout__details">
          <span class="workout__icon">⚡</span>
          <span class="workout__value">${workout.pace.toFixed(1)}</span>
          <span class="workout__unit">min/km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">🔄</span>
          <span class="workout__value">${workout.laps}</span>
          <span class="workout__unit">laps</span>
        </div>
      `;
    }

    const html = `
      <li class="workout workout--${workout.type}" data-id="${workout.id}">
        <button class="workout__delete" title="Delete workout">×</button>
        <div class="workout__header">
          <h2 class="workout__title">
            <span class="workout__type-icon">${emoji}</span>
            ${workout.description}
          </h2>
        </div>
        ${detailsHtml}
        <div class="workout__stats">
          <div class="workout__stat">
            <span class="workout__stat-label">🔥</span>
            <span class="workout__stat-value">${workout.calories} kcal</span>
          </div>
          <div class="workout__stat">
            <span class="workout__stat-label">Intensity:</span>
            <span class="workout__stat-value intensity--${workout.intensity}">${workout.intensity.toUpperCase()}</span>
          </div>
        </div>
      </li>
    `;

    form.insertAdjacentHTML('afterend', html);
  }

  _handleWorkoutClick(e) {
    // Handle delete button
    if (e.target.classList.contains('workout__delete')) {
      this._deleteWorkout(e);
      return;
    }

    // Handle workout card click
    const workoutEl = e.target.closest('.workout');
    if (!workoutEl) return;

    const workout = this.#workouts.find(w => w.id === workoutEl.dataset.id);
    if (!workout) return;

    this.#map.setView([workout.lat, workout.lng], this.#mapZoomLevel + 1, {
      animate: true,
      pan: { duration: 0.5 },
    });
  }

  _deleteWorkout(e) {
    const workoutEl = e.target.closest('.workout');
    if (!workoutEl) return;

    const workoutId = workoutEl.dataset.id;

    // Find and remove marker
    const markerObj = this.#markers.find(m => m.id === workoutId);
    if (markerObj) {
      this.#map.removeLayer(markerObj.marker);
      this.#markers = this.#markers.filter(m => m.id !== workoutId);
    }

    // Remove from workouts array
    this.#workouts = this.#workouts.filter(w => w.id !== workoutId);

    // Remove from DOM with animation
    workoutEl.style.transform = 'translateX(-100%)';
    workoutEl.style.opacity = '0';
    setTimeout(() => workoutEl.remove(), 300);

    // Update localStorage
    this._setLocalStorage();

    // Update stats
    this._updateStats();
    this._updateEmptyState();

    this._showAlert('Workout deleted', 'success');
  }

  _confirmClearAll() {
    if (this.#workouts.length === 0) {
      return this._showAlert('No workouts to clear', 'error');
    }

    if (confirm('Are you sure you want to delete all workouts? This cannot be undone.')) {
      this.reset();
    }
  }

  _updateStats() {
    const totalWorkouts = this.#workouts.length;
    const totalDistance = this.#workouts.reduce((sum, w) => sum + (w.distance || 0), 0);
    const totalCalories = this.#workouts.reduce((sum, w) => sum + (w.calories || 0), 0);

    if (totalWorkoutsEl) totalWorkoutsEl.textContent = totalWorkouts;
    if (totalDistanceEl) totalDistanceEl.textContent = totalDistance.toFixed(1);
    if (totalCaloriesEl) totalCaloriesEl.textContent = totalCalories.toLocaleString();
  }

  _updateEmptyState() {
    if (!emptyState) return;

    if (this.#workouts.length === 0) {
      emptyState.classList.remove('hidden');
    } else {
      emptyState.classList.add('hidden');
    }
  }

  _setLocalStorage() {
    localStorage.setItem('fitsyn-workouts', JSON.stringify(this.#workouts));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('fitsyn-workouts'));

    if (!data || !data.length) return;

    // Reconstruct workout objects
    this.#workouts = data.map(w => {
      let workout;

      switch (w.type) {
        case 'running':
          workout = new Running(w.lat, w.lng, w.distance, w.duration, w.cadence);
          break;
        case 'cycling':
          workout = new Cycling(w.lat, w.lng, w.distance, w.duration, w.elevationGain);
          break;
        case 'hiking':
          workout = new Hiking(w.lat, w.lng, w.distance, w.duration, w.elevationGain);
          break;
        case 'swimming':
          workout = new Swimming(w.lat, w.lng, w.distance, w.duration, w.laps);
          break;
        case 'yoga':
          workout = new Yoga(w.lat, w.lng, w.distance, w.duration);
          break;
        default:
          return null;
      }

      // Preserve original id and date
      workout.id = w.id;
      workout.date = new Date(w.date);

      return workout;
    }).filter(Boolean);

    // Render workouts in sidebar
    this.#workouts.forEach(w => this._renderWorkout(w));
  }

  reset() {
    localStorage.removeItem('fitsyn-workouts');
    location.reload();
  }
}

// ==========================================
// Initialize Application
// ==========================================
const app = new App();

// Expose reset method globally for debugging
window.resetFitSyn = () => app.reset();
