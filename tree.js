/**
 * FARMER OF LIFE — Tree of Life Interactive Engine (tree.js)
 * Procedural Fractal Tree with Dynamic Season Cycles, Node Detection, 
 * Branch Expansion, Sway Physics, and Spore Particles.
 */

class TreeOfLife {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    // Canvas size & ratio
    this.width = this.canvas.clientWidth || 500;
    this.height = this.canvas.clientHeight || 480;
    this.dpr = window.devicePixelRatio || 1;

    // Tree State
    this.season = 'spring'; // 'spring', 'summer', 'autumn', 'winter'
    this.growthProgress = 0; // 0 to 1
    this.targetGrowth = 1;
    this.swayTime = 0;
    this.isExpanded = true;
    this.hoveredNode = null;
    this.activeNode = null;
    this.mouse = { x: -1000, y: -1000, isDown: false };

    // Ambient floating spores / pollen
    this.particles = [];
    this.initParticles(35);

    // Life Pillar Nodes mapped along the branches
    this.nodes = [
      {
        id: 'soil',
        title: 'Soil & Roots',
        subtitle: 'Foundation, Health & Mindset',
        color: '#b27b46',
        branchAngle: -Math.PI / 2,
        relX: 0.5,
        relY: 0.88,
        radius: 14,
        link: 'soil.html',
        icon: '🌱',
        quote: 'As the soil is nurtured, so shall the trunk withstand the storm.'
      },
      {
        id: 'seeds',
        title: 'Seeds of Intent',
        subtitle: 'Aspirations & Clear Visions',
        color: '#48bb78',
        relX: 0.36,
        relY: 0.65,
        radius: 12,
        link: 'seeds.html',
        icon: '🌰',
        quote: 'Every mighty sequoia began as a quiet, unseen seed.'
      },
      {
        id: 'growth',
        title: 'Daily Growth',
        subtitle: 'Discipline, Sunlight & Care',
        color: '#2ecc71',
        relX: 0.66,
        relY: 0.58,
        radius: 13,
        link: 'growth.html',
        icon: '🌿',
        quote: 'A tree does not force its height; it drinks the rain and reaches upward.'
      },
      {
        id: 'seasons',
        title: 'Cycles & Seasons',
        subtitle: 'Patience Through Dormancy',
        color: '#e67e22',
        relX: 0.32,
        relY: 0.38,
        radius: 13,
        link: 'seasons.html',
        icon: '🍂',
        quote: 'Winter is not the end of life; it is the sanctuary of the roots.'
      },
      {
        id: 'community',
        title: 'Forest Community',
        subtitle: 'Mentors, Roots & Shared Light',
        color: '#e84393',
        relX: 0.68,
        relY: 0.36,
        radius: 12,
        link: 'community.html',
        icon: '🌸',
        quote: 'No tree stands alone. Underneath, a boundless network shares nourishment.'
      },
      {
        id: 'harvest',
        title: 'Golden Harvest',
        subtitle: 'Abundance, Wisdom & Legacy',
        color: '#f1c40f',
        relX: 0.50,
        relY: 0.22,
        radius: 15,
        link: 'harvest.html',
        icon: '🍎',
        quote: 'The true fruit of life is not what you keep, but the seeds you return to the earth.'
      }
    ];

    this.initEvents();
    this.resize();
    this.animate();
  }

  initParticles(count) {
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * (this.width || 500),
        y: Math.random() * (this.height || 480),
        radius: Math.random() * 2.5 + 0.8,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.5 - 0.2,
        alpha: Math.random() * 0.6 + 0.2,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        color: this.getSeasonParticleColor()
      });
    }
  }

  getSeasonParticleColor() {
    switch (this.season) {
      case 'spring': return 'rgba(232, 67, 147, '; // Pink petal dust
      case 'summer': return 'rgba(46, 204, 113, '; // Emerald spores
      case 'autumn': return 'rgba(243, 156, 18, '; // Amber gold flakes
      case 'winter': return 'rgba(164, 222, 249, '; // Ice frost dust
      default: return 'rgba(46, 204, 113, ';
    }
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width || 500;
    this.height = rect.height || 480;

    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
  }

  initEvents() {
    window.addEventListener('resize', () => this.resize());

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
      this.checkHover();
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
      this.hoveredNode = null;
    });

    this.canvas.addEventListener('click', () => {
      if (this.hoveredNode) {
        this.selectNode(this.hoveredNode);
        if (window.soundEngine) {
          window.soundEngine.playNodeChime();
        }
      }
    });

    // Mobile touch interaction
    this.canvas.addEventListener('touchstart', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const touch = e.touches[0];
      if (touch) {
        this.mouse.x = touch.clientX - rect.left;
        this.mouse.y = touch.clientY - rect.top;
        this.checkHover();
        if (this.hoveredNode) {
          this.selectNode(this.hoveredNode);
          if (window.soundEngine) window.soundEngine.playNodeChime();
        }
      }
    }, { passive: true });

    this.canvas.addEventListener('touchmove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const touch = e.touches[0];
      if (touch) {
        this.mouse.x = touch.clientX - rect.left;
        this.mouse.y = touch.clientY - rect.top;
        this.checkHover();
      }
    }, { passive: true });

    // Wire up seasonal controls if available
    document.querySelectorAll('.btn-season').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const season = e.currentTarget.getAttribute('data-season');
        if (season) this.setSeason(season);
        document.querySelectorAll('.btn-season').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
      });
    });

    // Wire expansion toggle button
    const expandBtn = document.getElementById('btnTreeExpand');
    if (expandBtn) {
      expandBtn.addEventListener('click', () => {
        this.toggleExpansion();
        expandBtn.innerHTML = this.isExpanded 
          ? '<i class="fas fa-cut"></i> <span>Prune Branches</span>' 
          : '<i class="fas fa-expand-alt"></i> <span>Expand Canopy</span>';
      });
    }

    // Auto-Timelapse Season Cycle button
    const timelapseBtn = document.getElementById('btnTreeTimelapse');
    if (timelapseBtn) {
      timelapseBtn.addEventListener('click', () => {
        this.toggleTimelapse(timelapseBtn);
      });
    }
  }

  toggleTimelapse(btn) {
    if (this.timelapseTimer) {
      clearInterval(this.timelapseTimer);
      this.timelapseTimer = null;
      if (btn) btn.innerHTML = '<i class="fas fa-play"></i> <span>Timelapse</span>';
      if (window.showToast) window.showToast('Season timelapse paused');
    } else {
      const seasons = ['spring', 'summer', 'autumn', 'winter'];
      let idx = seasons.indexOf(this.season);
      if (btn) btn.innerHTML = '<i class="fas fa-pause"></i> <span>Pause Cycle</span>';
      if (window.showToast) window.showToast('4-Season timelapse flowing', '⏳');
      this.timelapseTimer = setInterval(() => {
        idx = (idx + 1) % seasons.length;
        const nextSeason = seasons[idx];
        this.setSeason(nextSeason);
        document.querySelectorAll('.btn-season').forEach(b => {
          b.classList.toggle('active', b.getAttribute('data-season') === nextSeason);
        });
      }, 2500);
    }
  }

  setSeason(newSeason) {
    this.season = newSeason;
    this.particles.forEach(p => {
      p.color = this.getSeasonParticleColor();
    });
    // Trigger visual toast
    if (window.showToast) {
      window.showToast(`Season turned to ${newSeason.toUpperCase()} — Observe the changing canopy.`);
    }
  }

  toggleExpansion() {
    this.isExpanded = !this.isExpanded;
    this.targetGrowth = this.isExpanded ? 1 : 0.45;
  }

  checkHover() {
    let matched = null;
    for (const node of this.nodes) {
      const nx = node.relX * this.width;
      const ny = node.relY * this.height;
      const dx = this.mouse.x - nx;
      const dy = this.mouse.y - ny;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < node.radius + 8) {
        matched = node;
        break;
      }
    }

    if (this.hoveredNode !== matched) {
      this.hoveredNode = matched;
      this.canvas.style.cursor = matched ? 'pointer' : 'default';
      if (matched) {
        this.updateOverlayCard(matched);
      }
    }
  }

  selectNode(node) {
    this.activeNode = node;
    this.updateOverlayCard(node);
  }

  updateOverlayCard(node) {
    const titleEl = document.getElementById('treeNodeTitle');
    const descEl = document.getElementById('treeNodeDesc');
    const linkEl = document.getElementById('treeNodeLink');

    if (titleEl) titleEl.textContent = `${node.icon} ${node.title}`;
    if (descEl) descEl.textContent = node.quote;
    if (linkEl) {
      linkEl.href = node.link;
      linkEl.textContent = `Cultivate ${node.title.split(' ')[0]} →`;
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Growth smoothing
    this.growthProgress += (this.targetGrowth - this.growthProgress) * 0.05;
    this.swayTime += 0.02;

    this.ctx.clearRect(0, 0, this.width, this.height);

    // Draw ambient floating particles
    this.drawParticles();

    // Base coordinates
    const startX = this.width * 0.5;
    const startY = this.height * 0.88;
    const trunkLength = this.height * 0.28 * this.growthProgress;

    // Draw organic roots
    this.drawRoots(startX, startY);

    // Draw trunk & fractal branches
    this.drawBranch(startX, startY, trunkLength, -Math.PI / 2, 14 * this.growthProgress, 0);

    // Draw interactive Life Nodes
    this.drawNodes();
  }

  drawRoots(x, y) {
    this.ctx.save();
    this.ctx.strokeStyle = 'rgba(141, 91, 50, 0.45)';
    this.ctx.lineWidth = 4;
    this.ctx.lineCap = 'round';

    const rootPaths = [
      [-40, 35, -80, 50],
      [-15, 25, -30, 45],
      [20, 28, 45, 50],
      [45, 32, 90, 48]
    ];

    rootPaths.forEach(([c1x, c1y, endX, endY]) => {
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.quadraticCurveTo(x + c1x, y + c1y, x + endX, y + endY);
      this.ctx.stroke();
    });

    this.ctx.restore();
  }

  drawBranch(x, y, length, angle, width, depth) {
    if (depth > 6 || length < 6) return;

    // Gentle natural sway calculation
    const sway = Math.sin(this.swayTime + depth * 0.8) * 0.04 * (depth + 1);
    const finalAngle = angle + sway;

    const endX = x + Math.cos(finalAngle) * length;
    const endY = y + Math.sin(finalAngle) * length;

    // Branch styling
    this.ctx.save();
    this.ctx.lineWidth = Math.max(1.2, width);
    this.ctx.lineCap = 'round';

    // Luminous wood gradient from bark to sap
    const woodGrad = this.ctx.createLinearGradient(x, y, endX, endY);
    if (this.season === 'winter') {
      woodGrad.addColorStop(0, '#7f8c8d');
      woodGrad.addColorStop(0.5, '#bdc3c7');
      woodGrad.addColorStop(1, '#ffffff');
    } else if (this.season === 'autumn') {
      woodGrad.addColorStop(0, '#78281f');
      woodGrad.addColorStop(0.5, '#b9770e');
      woodGrad.addColorStop(1, '#e59866');
    } else {
      // Warm golden cedar with inner sap vitality
      woodGrad.addColorStop(0, '#6e3814');
      woodGrad.addColorStop(0.4, '#a0522d');
      woodGrad.addColorStop(0.8, '#d4883b');
      woodGrad.addColorStop(1, '#f8c291');
    }
    this.ctx.strokeStyle = woodGrad;

    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(endX, endY);
    this.ctx.stroke();

    // Inner sap energy highlight for main trunk & first branches
    if (depth <= 2 && this.season !== 'winter') {
      this.ctx.strokeStyle = 'rgba(255, 230, 160, 0.45)';
      this.ctx.lineWidth = Math.max(0.8, width * 0.25);
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(endX, endY);
      this.ctx.stroke();
    }

    // Draw foliage/leaves at higher branch depths
    if (depth >= 3) {
      this.drawLeafCluster(endX, endY, depth);
    }

    this.ctx.restore();

    // Branching recursion
    const subBranches = depth < 2 ? 3 : 2;
    const angleSpread = 0.48;
    const shrink = 0.72;

    if (depth === 0) {
      this.drawBranch(endX, endY, length * 0.75, finalAngle - 0.4, width * 0.7, depth + 1);
      this.drawBranch(endX, endY, length * 0.85, finalAngle + 0.05, width * 0.75, depth + 1);
      this.drawBranch(endX, endY, length * 0.72, finalAngle + 0.42, width * 0.68, depth + 1);
    } else {
      this.drawBranch(endX, endY, length * shrink, finalAngle - angleSpread, width * 0.65, depth + 1);
      this.drawBranch(endX, endY, length * shrink, finalAngle + angleSpread, width * 0.65, depth + 1);
    }
  }

  drawLeafCluster(x, y, depth) {
    if (this.season === 'winter' && depth < 5) return; // Sparse in winter

    this.ctx.save();
    let leafColor = 'rgba(72, 187, 120, 0.85)';
    let radius = 6.5;

    if (this.season === 'spring') {
      leafColor = depth % 2 === 0 ? 'rgba(244, 114, 182, 0.95)' : 'rgba(74, 222, 128, 0.95)';
      radius = 6.5;
    } else if (this.season === 'summer') {
      leafColor = 'rgba(34, 197, 94, 0.95)';
      radius = 8.5;
    } else if (this.season === 'autumn') {
      leafColor = depth % 2 === 0 ? 'rgba(245, 158, 11, 0.95)' : 'rgba(234, 88, 12, 0.95)';
      radius = 7.5;
    } else if (this.season === 'winter') {
      leafColor = 'rgba(224, 242, 254, 0.8)';
      radius = 4.5;
    }

    this.ctx.fillStyle = leafColor;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fill();

    // Subtle glow on leaf clusters
    this.ctx.shadowColor = leafColor;
    this.ctx.shadowBlur = 10;
    this.ctx.restore();
  }

  drawParticles() {
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.y < 0) {
        p.y = this.height;
        p.x = Math.random() * this.width;
      }
      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;

      this.ctx.fillStyle = `${p.color}${p.alpha})`;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  drawNodes() {
    const pulse = (Math.sin(this.swayTime * 2.5) + 1) * 0.5;

    this.nodes.forEach(node => {
      const nx = node.relX * this.width;
      const ny = node.relY * this.height;
      const isHovered = this.hoveredNode === node;
      const r = node.radius + (isHovered ? 5 : 0);

      this.ctx.save();

      // Outer aura ring with pulsating glow
      this.ctx.beginPath();
      this.ctx.arc(nx, ny, r + 8 + pulse * 5, 0, Math.PI * 2);
      this.ctx.fillStyle = isHovered 
        ? 'rgba(243, 156, 18, 0.45)' 
        : 'rgba(72, 187, 120, 0.25)';
      this.ctx.fill();

      // Core sphere with 3D radial gradient
      const grad = this.ctx.createRadialGradient(nx - 4, ny - 4, 2, nx, ny, r);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.4, node.color);
      grad.addColorStop(1, '#0b190f');

      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(nx, ny, r, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.lineWidth = isHovered ? 3 : 2;
      this.ctx.strokeStyle = isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.85)';
      this.ctx.stroke();

      // Clear Pill Badge for Node Label
      const label = `${node.icon} ${node.title}`;
      this.ctx.font = isHovered 
        ? 'bold 12px "Plus Jakarta Sans", sans-serif' 
        : '600 11px "Plus Jakarta Sans", sans-serif';
      
      const metrics = this.ctx.measureText(label);
      const pillW = metrics.width + 18;
      const pillH = 22;
      const pillX = nx - pillW / 2;
      const pillY = ny + r + 7;

      // Draw rounded pill background
      this.ctx.fillStyle = isHovered ? 'rgba(7, 20, 11, 0.95)' : 'rgba(10, 20, 13, 0.88)';
      this.ctx.strokeStyle = isHovered ? '#f59e0b' : node.color;
      this.ctx.lineWidth = isHovered ? 1.5 : 1;
      
      this.ctx.beginPath();
      if (this.ctx.roundRect) {
        this.ctx.roundRect(pillX, pillY, pillW, pillH, 11);
      } else {
        this.ctx.rect(pillX, pillY, pillW, pillH);
      }
      this.ctx.fill();
      this.ctx.stroke();

      // Draw crisp label text
      this.ctx.fillStyle = isHovered ? '#fbbf24' : '#ffffff';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(label, nx, pillY + pillH / 2);

      this.ctx.restore();
    });
  }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('treeCanvas')) {
    window.treeInstance = new TreeOfLife('treeCanvas');
  }
});
