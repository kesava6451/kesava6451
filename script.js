/* ═══════════════════════════════════════════════════════════
   DevOps Portfolio — script.js
   • Canvas particle network (hero background)
   • Typed text effect
   • Terminal animation
   • Navbar scroll behavior
   • Scroll-reveal (IntersectionObserver)
   • Animated counters
   • Skill bar fill animation
   • Hamburger mobile menu
   • Contact form handler
═══════════════════════════════════════════════════════════ */

'use strict';

// ─── Wait for DOM ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initCanvas();
  initNavbar();
  initTyped();
  initTerminal();
  initScrollReveal();
  initCounters();
  initSkillBars();
  initHamburger();
  initContactForm();
});

/* ══════════════════════════════════════════
   1. HERO CANVAS — particle network
══════════════════════════════════════════ */
function initCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles, mouse = { x: -9999, y: -9999 };
  const PARTICLE_COUNT = 80;
  const MAX_DIST = 130;
  const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#a5b4fc'];

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.r  = Math.random() * 2 + 1.2;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.alpha = Math.random() * 0.6 + 0.3;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Mouse repulsion
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 90) {
        const force = (90 - dist) / 90 * 0.04;
        this.vx += dx / dist * force;
        this.vy += dy / dist * force;
      }

      // Speed limit
      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (speed > 1.2) { this.vx = this.vx / speed * 1.2; this.vy = this.vy / speed * 1.2; }

      // Wrap edges
      if (this.x < 0)  this.x = W;
      if (this.x > W)  this.x = 0;
      if (this.y < 0)  this.y = H;
      if (this.y > H)  this.y = 0;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.restore();
    }
  }

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX_DIST) {
          const alpha = (1 - d / MAX_DIST) * 0.25;
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = '#6366f1';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawLines();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
    loop();
  }

  window.addEventListener('resize', () => {
    resize();
    particles.forEach(p => { p.x = Math.min(p.x, W); p.y = Math.min(p.y, H); });
  });

  document.getElementById('hero').addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  document.getElementById('hero').addEventListener('mouseleave', () => {
    mouse.x = -9999; mouse.y = -9999;
  });

  init();
}

/* ══════════════════════════════════════════
   2. NAVBAR — scroll behavior + active link
══════════════════════════════════════════ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function onScroll() {
    // Scrolled class
    if (window.scrollY > 30) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');

    // Active link
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 120) current = section.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ══════════════════════════════════════════
   3. TYPED TEXT EFFECT
══════════════════════════════════════════ */
function initTyped() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrases = ['Engineer', 'Architect', 'Automation Expert', 'Cloud Builder', 'GitOps Wizard'];
  let pIdx = 0, cIdx = 0, deleting = false;

  function type() {
    const word = phrases[pIdx];
    if (!deleting) {
      el.textContent = word.slice(0, ++cIdx);
      if (cIdx === word.length) {
        setTimeout(() => { deleting = true; tick(); }, 2400);
        return;
      }
    } else {
      el.textContent = word.slice(0, --cIdx);
      if (cIdx === 0) {
        deleting = false;
        pIdx = (pIdx + 1) % phrases.length;
      }
    }
    tick();
  }

  function tick() {
    const delay = deleting ? 55 : (cIdx === phrases[pIdx].length ? 80 : 80);
    setTimeout(type, delay);
  }

  setTimeout(tick, 700);
}

/* ══════════════════════════════════════════
   4. TERMINAL ANIMATION
══════════════════════════════════════════ */
function initTerminal() {
  const cmdEl    = document.getElementById('terminal-cmd');
  const outputEl = document.getElementById('terminal-output');
  if (!cmdEl || !outputEl) return;

  const sessions = [
    {
      cmd: 'kubectl get pods -n production',
      output: `NAME                          READY   STATUS
api-deployment-7d4f9-kx2p8    2/2     Running
db-statefulset-0              1/1     Running
cache-deployment-5bc9-rqz4t   1/1     Running
worker-job-8bm9w              1/1     Running
[4/4 running] ✓ All healthy`,
      color: '#10b981'
    },
    {
      cmd: 'terraform apply -auto-approve',
      output: `Plan: 3 to add, 2 to change, 0 to destroy.

Apply complete!
  + aws_eks_cluster.main
  + aws_rds_instance.db
  ~ aws_security_group.ingress

Apply complete! Resources: 3 added, 2 changed.`,
      color: '#6366f1'
    },
    {
      cmd: 'helm upgrade --install myapp ./chart',
      output: `Release "myapp" has been upgraded. Happy helming!
NAME: myapp
LAST DEPLOYED: $(date)
NAMESPACE: default
STATUS: deployed
REVISION: 7 ✓`,
      color: '#06b6d4'
    },
    {
      cmd: 'docker build -t kesava/app:latest .',
      output: `[+] Building 4.2s (12/12) FINISHED
 => [internal] load build context     0.1s
 => [1/5] FROM node:18-alpine         0.0s
 => [2/5] WORKDIR /app                0.0s
 => [5/5] RUN npm run build           3.2s
 => exporting to image                0.3s
Successfully built image ✓`,
      color: '#f59e0b'
    }
  ];

  let sessIdx = 0;

  function runSession(sess) {
    cmdEl.textContent = '';
    outputEl.textContent = '';
    outputEl.style.color = sess.color;

    let i = 0;
    const typeCmd = () => {
      if (i < sess.cmd.length) {
        cmdEl.textContent += sess.cmd[i++];
        setTimeout(typeCmd, 35);
      } else {
        setTimeout(() => showOutput(sess), 300);
      }
    };
    typeCmd();
  }

  function showOutput(sess) {
    const lines = sess.output.split('\n');
    let lineIdx = 0;

    const showLine = () => {
      if (lineIdx < lines.length) {
        outputEl.textContent += (lineIdx > 0 ? '\n' : '') + lines[lineIdx++];
        setTimeout(showLine, 130);
      }
    };
    showLine();

    // Schedule next session
    setTimeout(() => {
      sessIdx = (sessIdx + 1) % sessions.length;
      runSession(sessions[sessIdx]);
    }, (lines.length * 130) + 3500);
  }

  runSession(sessions[0]);
}

/* ══════════════════════════════════════════
   5. SCROLL REVEAL — IntersectionObserver
══════════════════════════════════════════ */
function initScrollReveal() {
  // Add reveal class to all target elements
  const targets = [
    '.about-content', '.about-image-wrapper',
    '.skill-category', '.project-card',
    '.timeline-item', '.cert-card',
    '.contact-item', '.contact-form',
    '.skill-bars-section',
  ];

  targets.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${i * 0.07}s`;
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════════
   6. ANIMATED COUNTERS (hero stats)
══════════════════════════════════════════ */
function initCounters() {
  const counters = document.querySelectorAll('.stat-value[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.target;
      const duration = 1500;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.round(ease * target);
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target;
      }

      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════════
   7. SKILL BAR ANIMATION
══════════════════════════════════════════ */
function initSkillBars() {
  const bars = document.querySelectorAll('.bar-fill[data-width]');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const bar = entry.target;
      // Small delay so the reveal animation completes first
      setTimeout(() => {
        bar.style.width = `${bar.dataset.width}%`;
      }, 300);
      observer.unobserve(bar);
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
}

/* ══════════════════════════════════════════
   8. HAMBURGER MOBILE MENU
══════════════════════════════════════════ */
function initHamburger() {
  const btn   = document.getElementById('hamburger');
  const links = document.getElementById('nav-links');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
    // Animate spans
    const spans = btn.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // Close on link click
  links.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      btn.setAttribute('aria-expanded', false);
      btn.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
}

/* ══════════════════════════════════════════
   9. CONTACT FORM
══════════════════════════════════════════ */
function initContactForm() {
  const form      = document.getElementById('contact-form');
  const successEl = document.getElementById('form-success');
  const submitBtn = document.getElementById('form-submit-btn');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // Simple validation
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let valid = true;
    inputs.forEach(input => {
      if (!input.value.trim()) {
        input.style.borderColor = '#f87171';
        valid = false;
      } else {
        input.style.borderColor = '';
      }
    });
    if (!valid) return;

    // Simulate send
    const span = submitBtn.querySelector('span');
    span.textContent = 'Sending…';
    submitBtn.disabled = true;

    setTimeout(() => {
      span.textContent = 'Send Message';
      submitBtn.disabled = false;
      form.reset();
      successEl.classList.add('visible');
      setTimeout(() => successEl.classList.remove('visible'), 5000);
    }, 1500);
  });

  // Clear error state on input
  form.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('input', () => { el.style.borderColor = ''; });
  });
}

/* ══════════════════════════════════════════
   10. SMOOTH RETURN TO TOP (logo click)
══════════════════════════════════════════ */
document.querySelector('.nav-logo')?.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
