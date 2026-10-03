/**
 * FARMER OF LIFE — Master Application Engine (main.js)
 * Manages theme toggling, synthesized nature audio, navigation, 
 * interactive widgets, calculators, and user feedback.
 */

// Universal image error fallback for GitHub Pages & Local
document.addEventListener('error', function(e) {
  if (e.target && e.target.tagName === 'IMG') {
    var img = e.target;
    var src = img.getAttribute('src');
    if (src && !img.dataset.hasFallenBack) {
      img.dataset.hasFallenBack = 'true';
      if (src.indexOf('img/') === 0) {
        img.src = src.replace('img/', '');
      } else if (src.indexOf('/') === -1) {
        img.src = 'img/' + src;
      }
    }
  }
}, true);

// ==========================================
// 1. Synthesized Nature Audio Engine
// ==========================================
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.windNode = null;
    this.gainNode = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleAmbience() {
    this.init();
    if (this.isPlaying) {
      this.stopAmbience();
      return false;
    } else {
      this.startAmbience();
      return true;
    }
  }

  startAmbience() {
    if (this.isPlaying) return;
    try {
      // Create pink noise buffer for forest wind
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        data[i] *= 0.04;
        b6 = white * 0.115926;
      }

      this.windSource = this.ctx.createBufferSource();
      this.windSource.buffer = buffer;
      this.windSource.loop = true;

      // Low pass filter to simulate rustling breeze
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, this.ctx.currentTime);

      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(0.01, this.ctx.currentTime);
      this.gainNode.gain.exponentialRampToValueAtTime(0.18, this.ctx.currentTime + 2);

      this.windSource.connect(filter);
      filter.connect(this.gainNode);
      this.gainNode.connect(this.ctx.destination);

      this.windSource.start();
      this.isPlaying = true;
    } catch (err) {
      console.warn('Audio engine start failed:', err);
    }
  }

  stopAmbience() {
    if (!this.isPlaying || !this.gainNode) return;
    try {
      this.gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1);
      setTimeout(() => {
        if (this.windSource) this.windSource.stop();
        this.isPlaying = false;
      }, 1000);
    } catch (err) {
      this.isPlaying = false;
    }
  }

  playNodeChime() {
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (harmonious bell)
      const f = freqs[Math.floor(Math.random() * freqs.length)];
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.9);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.9);
    } catch (err) {
      // Audio fallback silent
    }
  }
}

window.soundEngine = new SoundEngine();

// ==========================================
// 2. Global Toast System
// ==========================================
window.showToast = function(msg, icon = '🍃') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span style="font-size: 1.25rem;">${icon}</span> <span>${msg}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4200);
};

// ==========================================
// 3. Main Document Initialization
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('farmer_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('farmer_theme', nextTheme);
      updateThemeIcon(nextTheme);
      window.showToast(`Switched to ${nextTheme === 'dark' ? 'Night Soil' : 'Morning Sunlight'} theme`);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeToggle) return;
    themeToggle.innerHTML = theme === 'dark' 
      ? '<i class="fas fa-sun"></i>' 
      : '<i class="fas fa-moon"></i>';
  }

  // Sound Toggle Button
  const soundToggle = document.getElementById('soundToggle');
  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      const active = window.soundEngine.toggleAmbience();
      soundToggle.innerHTML = active 
        ? '<i class="fas fa-volume-up"></i>' 
        : '<i class="fas fa-volume-mute"></i>';
      soundToggle.style.color = active ? 'var(--accent-gold)' : 'var(--text-muted)';
      window.showToast(active ? 'Forest breeze ambience started' : 'Ambience paused');
    });
  }

  // Sticky Navbar Scroll Listener
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (header) {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  });

  // Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      mobileToggle.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    // Close when clicking nav link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        if (mobileToggle) mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });
  }

  // Dropdown menus on mobile
  document.querySelectorAll('.dropdown-toggle').forEach(dropdown => {
    dropdown.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        dropdown.parentElement.classList.toggle('open');
      }
    });
  });

  // Accordions
  document.querySelectorAll('.accordion-header').forEach(hdr => {
    hdr.addEventListener('click', () => {
      const item = hdr.parentElement;
      item.classList.toggle('active');
    });
  });

  // Interactive Garden (Intention Sprouter)
  initGardenWidget();

  // Soil Quiz Engine (if on soil.html)
  initSoilQuiz();

  // Seasons Wheel (if on seasons.html)
  initSeasonsSelector();

  // Cultivator Pledge Generator (if on call-to-action.html)
  initPledgeGenerator();

  // Upgraded Botanical Suite Initializers
  initSanctuaryHUD();
  initSeasonAssessment();
  initHabitTracker();
  initWisdomOracle();
});


// ==========================================
// 4. Interactive Garden Sprouter
// ==========================================
function initGardenWidget() {
  const btnPlant = document.getElementById('btnPlantIntention');
  const inputIntention = document.getElementById('inputIntention');
  const sproutsWall = document.getElementById('sproutsWall');

  if (!btnPlant || !inputIntention || !sproutsWall) return;

  const defaultSprouts = [
    'Sow patience in difficult conversations',
    'Nurture 8 hours of deep restorative sleep',
    'Read 20 pages of timeless literature daily',
    'Water relationships with gratitude',
    'Prune compulsive social media checking'
  ];

  // Load from local storage or defaults
  let stored = JSON.parse(localStorage.getItem('farmer_sprouts') || 'null');
  if (!stored) {
    stored = defaultSprouts;
    localStorage.setItem('farmer_sprouts', JSON.stringify(stored));
  }

  function renderSprouts() {
    sproutsWall.innerHTML = '';
    stored.forEach((item, idx) => {
      const span = document.createElement('div');
      span.className = 'sprout-item';
      span.innerHTML = `<i class="fas fa-seedling"></i> <span>${escapeHTML(item)}</span>`;
      sproutsWall.appendChild(span);
    });
  }

  renderSprouts();

  btnPlant.addEventListener('click', () => {
    const val = inputIntention.value.trim();
    if (!val) {
      window.showToast('Please type an intention to plant into the soil.', '⚠️');
      return;
    }
    stored.unshift(val);
    if (stored.length > 12) stored.pop();
    localStorage.setItem('farmer_sprouts', JSON.stringify(stored));
    renderSprouts();
    inputIntention.value = '';
    window.showToast('Your intention has been planted into the communal garden!', '🌱');
    if (window.soundEngine) window.soundEngine.playNodeChime();
  });
}

// ==========================================
// 5. Soil pH Assessment Quiz (soil.html)
// ==========================================
function initSoilQuiz() {
  const quizForm = document.getElementById('soilQuizForm');
  const resultBox = document.getElementById('soilQuizResult');
  if (!quizForm || !resultBox) return;

  quizForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(quizForm);
    let totalScore = 0;
    let answered = 0;

    for (let entry of data.entries()) {
      totalScore += parseInt(entry[1], 10);
      answered++;
    }

    if (answered < 5) {
      window.showToast('Please evaluate all 5 soil layers to calculate your pH.', '⚠️');
      return;
    }

    let title, desc, ph;
    if (totalScore >= 16) {
      ph = '6.8 (Prime Fertile Loam)';
      title = 'Lush, Organically Rich Soil';
      desc = 'Your foundational habits, sleep, and emotional roots are exceptionally well nourished. You are primed to support vigorous growth and high yield.';
    } else if (totalScore >= 10) {
      ph = '5.9 (Slightly Compacted Clay)';
      title = 'Moderately Balanced Soil';
      desc = 'Your roots have strong points, but drainage is needed. Identify where stress or irregular nourishment is causing mild toxicity.';
    } else {
      ph = '4.8 (Depleted Acidic Ground)';
      title = 'Parched & Nutrient-Deficient Soil';
      desc = 'Do not force plants to grow right now. First step: add compost, protect your rest, and prune external demands to regenerate the ground.';
    }

    resultBox.style.display = 'block';
    resultBox.innerHTML = `
      <div style="background: var(--bg-card); border: 2px solid var(--accent-primary); border-radius: var(--radius-lg); padding: 2rem; margin-top: 2rem; text-align: center; box-shadow: var(--shadow-lg);">
        <span class="section-badge"><i class="fas fa-flask"></i> Soil pH Result: ${ph}</span>
        <h3 style="font-family: var(--font-serif); font-size: 1.85rem; color: var(--text-gold); margin: 0.75rem 0;">${title}</h3>
        <p style="color: var(--text-muted); max-width: 600px; margin: 0 auto 1.5rem; line-height: 1.7;">${desc}</p>
        <a href="growth.html" class="btn btn-primary"><i class="fas fa-arrow-right"></i> Proceed to Daily Growth Protocol</a>
      </div>
    `;
    resultBox.scrollIntoView({ behavior: 'smooth' });
    window.showToast('Soil Health Diagnosis Calculated', '🧪');
  });
}

// ==========================================
// 6. Seasons Wheel Selector (seasons.html)
// ==========================================
function initSeasonsSelector() {
  const cards = document.querySelectorAll('.season-phase-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const seasonName = card.getAttribute('data-season-name');
      window.showToast(`Selected your current life season: ${seasonName}`, '🍂');
    });
  });
}

// ==========================================
// 7. Cultivator's Pledge Generator (call-to-action.html)
// ==========================================
function initPledgeGenerator() {
  const btnGenerate = document.getElementById('btnGeneratePledge');
  const inputName = document.getElementById('pledgeName');
  const certificateBox = document.getElementById('pledgeCertificate');

  if (!btnGenerate || !inputName || !certificateBox) return;

  btnGenerate.addEventListener('click', () => {
    const name = inputName.value.trim() || 'A Dedicated Cultivator';
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    certificateBox.style.display = 'block';
    certificateBox.innerHTML = `
      <div class="certificate-frame" style="border: 4px double var(--accent-gold); padding: 3rem; background: var(--bg-card); border-radius: var(--radius-xl); text-align: center; max-width: 720px; margin: 2rem auto; box-shadow: var(--shadow-lg), var(--glow-gold);">
        <div style="font-size: 2.5rem; color: var(--accent-gold); margin-bottom: 0.5rem;"><i class="fas fa-tree"></i></div>
        <h2 style="font-family: var(--font-display); font-size: 2rem; color: var(--text-main); margin-bottom: 0.5rem;">The Cultivator's Sacred Covenant</h2>
        <p style="color: var(--accent-gold); text-transform: uppercase; letter-spacing: 0.15em; font-size: 0.85rem; margin-bottom: 2rem;">Decree of the Farmer of Life</p>
        
        <p style="font-size: 1.15rem; color: var(--text-muted); line-height: 1.8; margin-bottom: 2rem; font-style: italic;">
          "I hereby renounce the fever of mindless hustle and the illusion of instant harvest. 
          I commit to honoring the soil of my body and mind, trusting the slow quiet germination of honest seeds, 
          embracing the discipline of daily watering, and accepting the wisdom of all four seasons."
        </p>

        <div style="display: flex; justify-content: space-around; align-items: flex-end; margin-top: 3rem; border-top: 1px solid var(--border-medium); padding-top: 1.5rem;">
          <div>
            <div style="font-family: var(--font-serif); font-size: 1.5rem; color: var(--text-gold); border-bottom: 1px dashed var(--border-medium); padding-bottom: 0.25rem;">${escapeHTML(name)}</div>
            <div style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase; margin-top: 0.35rem;">Cultivator Signature</div>
          </div>
          <div>
            <div style="font-size: 1.1rem; color: var(--text-main); border-bottom: 1px dashed var(--border-medium); padding-bottom: 0.25rem;">${date}</div>
            <div style="font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase; margin-top: 0.35rem;">Consecration Date</div>
          </div>
        </div>

        <div style="margin-top: 2.5rem; display: flex; justify-content: center; gap: 1rem;">
          <button class="btn btn-outline btn-sm" onclick="window.print()"><i class="fas fa-print"></i> Print Covenant</button>
          <a href="index.html" class="btn btn-primary btn-sm"><i class="fas fa-home"></i> Return to Root Trunk</a>
        </div>
      </div>
    `;

    certificateBox.scrollIntoView({ behavior: 'smooth' });
    window.showToast(`Covenant generated for ${name}!`, '📜');
    if (window.soundEngine) window.soundEngine.playNodeChime();
  });
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

// ==========================================
// 8. Upgraded Floating Sanctuary HUD
// ==========================================
function initSanctuaryHUD() {
  const hud = document.getElementById('sanctuaryHUD');
  const hudSoundBtn = document.getElementById('hudSoundBtn');
  const hudScrollTop = document.getElementById('hudScrollTop');
  const soundToggle = document.getElementById('soundToggle');

  if (hudSoundBtn) {
    hudSoundBtn.addEventListener('click', () => {
      const active = window.soundEngine.toggleAmbience();
      if (hud) hud.classList.toggle('playing', active);
      if (soundToggle) {
        soundToggle.innerHTML = active 
          ? '<i class="fas fa-volume-up"></i>' 
          : '<i class="fas fa-volume-mute"></i>';
        soundToggle.style.color = active ? 'var(--accent-gold)' : 'var(--text-muted)';
      }
      const text = hudSoundBtn.querySelector('.hud-sound-text');
      if (text) text.textContent = active ? 'Ambience: On' : 'Forest Sound';
      window.showToast(active ? 'Forest wind ambience flowing' : 'Ambience resting');
    });
  }

  if (hudScrollTop) {
    hudScrollTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// ==========================================
// 9. Interactive Life Season Diagnostic Tool
// ==========================================
function initSeasonAssessment() {
  const options = document.querySelectorAll('.season-option-btn');
  const resultBox = document.getElementById('seasonResultBox');
  if (!options.length || !resultBox) return;

  const seasonWisdom = {
    spring: {
      badge: '🌸 Season of Spring (ការចាប់ផ្តើម)',
      title: 'Tender Germination & Inception',
      quote: 'Do not rush the blossom. Protect the fresh green shoots from harsh winds.',
      action: 'Clarify your intentions. Choose 2-3 essential seeds to plant and commit to gentle daily watering.',
      link: 'seeds.html',
      linkText: 'Explore Seeds of Intent →'
    },
    summer: {
      badge: '☀️ Season of Summer (ការលូតលាស់ខ្លាំង)',
      title: 'Vigorous Growth & Sunlight Energy',
      quote: 'Sunlight is abundant, but vigilance is required to weed out distractions.',
      action: 'Channel high vitality into deliberate deep work. Ensure regular irrigation of physical health.',
      link: 'growth.html',
      linkText: 'Explore Daily Growth Protocol →'
    },
    autumn: {
      badge: '🍂 Season of Autumn (រដូវប្រមូលផល)',
      title: 'Golden Harvest & Gratitude',
      quote: 'The branches bow heavy with ripe fruit. True fulfillment is in the sharing.',
      action: 'Acknowledge your milestones with deep humility. Distribute your surplus to nourish your community.',
      link: 'harvest.html',
      linkText: 'Explore The Golden Harvest →'
    },
    winter: {
      badge: '❄️ Season of Winter (ការសម្រាកសន្សំកម្លាំង)',
      title: 'Sacred Dormancy & Root Renewal',
      quote: 'Winter is not death. Beneath the snow, the deep roots gather secret sap.',
      action: 'Release guilt over slowing down. Prune dead branches, reflect deeply, and replenish your spirit.',
      link: 'soil.html',
      linkText: 'Explore Deep Soil & Rest →'
    }
  };

  options.forEach(opt => {
    opt.addEventListener('click', () => {
      options.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');

      const seasonKey = opt.getAttribute('data-season');
      const data = seasonWisdom[seasonKey];
      if (!data) return;

      resultBox.style.display = 'block';
      resultBox.innerHTML = `
        <div class="anim-fade-up">
          <span class="section-badge">${data.badge}</span>
          <h3 style="font-family: var(--font-serif); font-size: 1.85rem; color: var(--text-gold); margin: 0.75rem 0;">${data.title}</h3>
          <p style="font-style: italic; color: #fff; font-size: 1.1rem; margin-bottom: 1rem;">"${data.quote}"</p>
          <p style="color: var(--text-muted); max-width: 680px; margin: 0 auto 1.5rem; line-height: 1.7;">${data.action}</p>
          <a href="${data.link}" class="btn btn-gold"><i class="fas fa-compass"></i> ${data.linkText}</a>
        </div>
      `;
      resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      if (window.soundEngine) window.soundEngine.playNodeChime();
      window.showToast(`Identified: ${data.badge}`, '🌾');
    });
  });
}

// ==========================================
// 10. Daily Habit Sprout Growth Tracker
// ==========================================
function initHabitTracker() {
  const container = document.getElementById('habitTrackerContainer');
  if (!container) return;

  const defaultHabits = [
    { id: 'h1', text: '10 Minutes Mindful Stillness & Deep Breath', done: false },
    { id: 'h2', text: 'Nourish Physical Soil (Hydration & Fresh Meal)', done: false },
    { id: 'h3', text: '1 Hour Uninterrupted Intentional Work', done: false },
    { id: 'h4', text: 'A Quiet Word of Gratitude or Kindness', done: false },
    { id: 'h5', text: 'Sunset Screen Curfew & Soul Rest', done: false }
  ];

  const todayKey = 'farmer_habits_' + new Date().toISOString().slice(0, 10);
  let habits = JSON.parse(localStorage.getItem(todayKey) || 'null');
  if (!habits) {
    habits = defaultHabits;
    localStorage.setItem(todayKey, JSON.stringify(habits));
  }

  function renderHabits() {
    container.innerHTML = '';
    const completedCount = habits.filter(h => h.done).length;
    const pct = Math.round((completedCount / habits.length) * 100);

    const listDiv = document.createElement('div');
    listDiv.className = 'habit-list';

    habits.forEach((habit, idx) => {
      const item = document.createElement('div');
      item.className = `habit-item ${habit.done ? 'completed' : ''}`;
      item.innerHTML = `
        <div class="habit-left">
          <div class="habit-check">${habit.done ? '<i class="fas fa-check"></i>' : ''}</div>
          <span class="habit-text">${escapeHTML(habit.text)}</span>
        </div>
        <span style="font-size: 0.85rem; color: ${habit.done ? 'var(--accent-primary)' : 'var(--text-dim)'};">
          ${habit.done ? 'Nourished 💧' : 'Dry'}
        </span>
      `;

      item.addEventListener('click', () => {
        habit.done = !habit.done;
        localStorage.setItem(todayKey, JSON.stringify(habits));
        renderHabits();
        if (habit.done) {
          window.showToast('Seed watered! Habit completed.', '🌱');
          if (window.soundEngine) window.soundEngine.playNodeChime();
        }
      });

      listDiv.appendChild(item);
    });

    container.appendChild(listDiv);

    // Progress Bar & Sprout Status
    const statusDiv = document.createElement('div');
    statusDiv.style.marginTop = '1.5rem';
    statusDiv.innerHTML = `
      <div style="display: flex; justify-content: space-between; font-size: 0.9rem; font-weight: 600;">
        <span>Sprout Health: <strong style="color: var(--accent-gold);">${pct}% Vitality</strong></span>
        <span>${completedCount} of ${habits.length} Habits Watered</span>
      </div>
      <div class="sprout-progress-bar">
        <div class="sprout-progress-fill" style="width: ${pct}%;"></div>
      </div>
      <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.75rem; text-align: center;">
        ${pct === 100 ? '🎉 Magnificent! Your living tree is in full bloom today!' : 'Tend each habit gently like watering a tender green leaf.'}
      </p>
    `;
    container.appendChild(statusDiv);
  }

  renderHabits();
}

// ==========================================
// 11. Botanical Wisdom Oracle (Khmer & English)
// ==========================================
function initWisdomOracle() {
  const btnPickSeed = document.getElementById('btnPickSeed');
  const quoteKhmer = document.getElementById('oracleKhmer');
  const quoteEn = document.getElementById('oracleEn');
  const quoteBox = document.getElementById('oracleQuoteBox');
  const btnCopy = document.getElementById('btnCopyWisdom');

  if (!btnPickSeed || !quoteKhmer || !quoteEn) return;

  const wisdomSeeds = [
    {
      khmer: 'អ្នកមិនអាចទាញពន្លកឱ្យលូតលាស់លឿនបានឡើយ មានតែការថែទាំដីឱ្យមានជីជាតិប៉ុណ្ណោះ។',
      en: 'You cannot pull a sprout to make it grow faster; you can only nurture the fertile soil.'
    },
    {
      khmer: 'ដើមឈើធំដែលមានមែកសាខាត្រសុំត្រសាយ សុទ្ធតែកើតចេញពីគ្រាប់ពូជតូចមួយក្នុងភាពស្ងប់ស្ងាត់។',
      en: 'Mighty trees with sprawling canopies began from a single silent seed in the dark.'
    },
    {
      khmer: 'រដូវរងាមិនមែនជាការស្លាប់ទេ តែជាការប្រមូលកម្លាំងជ័រឈើសម្រាប់និទាឃរដូវដ៏រុងរឿង។',
      en: 'Winter is not death; it is the gathering of sacred sap for a luminous spring.'
    },
    {
      khmer: 'ឈប់រត់ប្រណាំងដោយការភ័យស្លន់ស្លោ ចូររៀនរស់នៅដោយគោរពច្បាប់ធម្មជាតិ។',
      en: 'Cease frantic sprinting; learn to cultivate your existence by natural law.'
    },
    {
      khmer: 'ដាំគ្រាប់ពូជនៃសេចក្តីស្មោះត្រង់ថ្ងៃនេះ អ្នកនឹងប្រមូលផលជាសន្តិភាពនៃចិត្តថ្ងៃស្អែក។',
      en: 'Sow seeds of integrity today, and you shall harvest inner peace tomorrow.'
    },
    {
      khmer: 'ឫសដែលចាក់ជ្រៅក្នុងដី នឹងការពារដើមឈើមិនឱ្យដួលរលំនៅពេលមានព្យុះសង្ឃរា។',
      en: 'Roots anchored deep into the soil preserve the tree when violent tempests rage.'
    },
    {
      khmer: 'ផ្លែផ្កាដ៏ផ្អែមល្ហែម ត្រូវតែចែករំលែកជាមួយសហគមន៍ ទើបបង្កើតជាព្រៃឈើដ៏គង់វង្ស។',
      en: 'Sweet fruit must be shared with the grove to cultivate an enduring forest.'
    }
  ];

  let lastIdx = 0;

  function pickRandomSeed() {
    let nextIdx;
    do {
      nextIdx = Math.floor(Math.random() * wisdomSeeds.length);
    } while (nextIdx === lastIdx && wisdomSeeds.length > 1);
    lastIdx = nextIdx;

    if (quoteBox) quoteBox.style.opacity = '0';
    setTimeout(() => {
      quoteKhmer.textContent = wisdomSeeds[nextIdx].khmer;
      quoteEn.textContent = `"${wisdomSeeds[nextIdx].en}"`;
      if (quoteBox) quoteBox.style.opacity = '1';
    }, 200);

    if (window.soundEngine) window.soundEngine.playNodeChime();
  }

  btnPickSeed.addEventListener('click', pickRandomSeed);

  if (btnCopy) {
    btnCopy.addEventListener('click', () => {
      const fullText = `${quoteKhmer.textContent}\n${quoteEn.textContent} — Farmer of Life`;
      navigator.clipboard.writeText(fullText).then(() => {
        window.showToast('Wisdom copied to clipboard!', '📋');
      });
    });
  }
}

