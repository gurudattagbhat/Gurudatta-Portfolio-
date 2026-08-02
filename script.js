/* ==========================================================================
   FUTURISTIC CYBERNETIC INTERACTIVE ENGINE
   Developer: Gurudatta Ganapati Bhat
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------------
   * 1. WEB AUDIO API SYNTHESIZER FOR UI INTERACTIONS
   * ------------------------------------------------------------------------ */
  class AudioSynth {
    constructor() {
      this.ctx = null;
      this.enabled = true;
    }

    initCtx() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
      }
    }

    playClick() {
      if (!this.enabled) return;
      this.initCtx();
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    }

    playBeep(freq = 1200, duration = 0.08) {
      if (!this.enabled) return;
      this.initCtx();
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    }
  }

  const synth = new AudioSynth();

  // Sound Toggle Button
  const soundToggleBtn = document.getElementById('sound-toggle');
  const soundIcon = document.getElementById('sound-icon');
  
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      synth.enabled = !synth.enabled;
      if (synth.enabled) {
        soundIcon.className = 'fa-solid fa-volume-high';
        soundToggleBtn.style.borderColor = 'var(--neon-emerald)';
        synth.playBeep(1000, 0.1);
        showToast('Interaction Audio Activated');
      } else {
        soundIcon.className = 'fa-solid fa-volume-xmark';
        soundToggleBtn.style.borderColor = 'rgba(255,255,255,0.1)';
        showToast('Interaction Audio Muted');
      }
    });
  }

  // Play subtle sound on main buttons hover/click
  document.querySelectorAll('.btn-primary, .btn-secondary, .social-btn, .filter-btn, .nav-link').forEach(btn => {
    btn.addEventListener('click', () => synth.playClick());
  });

  /* ------------------------------------------------------------------------
   * 2. INTERACTIVE CYBER CANVAS PARTICLE MATRIX
   * ------------------------------------------------------------------------ */
  const canvas = document.getElementById('cyber-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const mouse = { x: null, y: null, radius: 150 };
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    });

    const particles = [];
    const particleCount = Math.min(Math.floor(width / 18), 85);

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 1.2;
        this.vy = (Math.random() - 0.5) * 1.2;
        this.radius = Math.random() * 2 + 1;
        this.color = Math.random() > 0.5 ? '#00ff9d' : '#a855f7';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse attraction
        if (mouse.x && mouse.y) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= (dx / dist) * force * 3;
            this.y -= (dy / dist) * force * 3;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animateCanvas() {
      ctx.clearRect(0, 0, width, height);

      // Connect particles
      for (let a = 0; a < particles.length; a++) {
        particles[a].update();
        particles[a].draw();

        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.strokeStyle = `rgba(0, 255, 157, ${1 - dist / 130})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animateCanvas);
    }
    animateCanvas();
  }

  /* ------------------------------------------------------------------------
   * 3. TYPEWRITER EFFECT IN HERO SECTION
   * ------------------------------------------------------------------------ */
  const typewriterElement = document.getElementById('typewriter-text');
  if (typewriterElement) {
    const words = [
      "Master of Computer Applications Scholar",
      "Full-Stack Web Developer",
      "AI & Machine Learning Enthusiast",
      "Cybersecurity & Cloud Tech Practitioner",
      "Python & Data Analysis Specialist"
    ];
    let wordIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    function type() {
      const currentWord = words[wordIdx];
      
      if (isDeleting) {
        typewriterElement.textContent = currentWord.substring(0, charIdx - 1);
        charIdx--;
      } else {
        typewriterElement.textContent = currentWord.substring(0, charIdx + 1);
        charIdx++;
      }

      let typeSpeed = isDeleting ? 40 : 80;

      if (!isDeleting && charIdx === currentWord.length) {
        typeSpeed = 2200; // Pause at full word
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        wordIdx = (wordIdx + 1) % words.length;
        typeSpeed = 400;
      }

      setTimeout(type, typeSpeed);
    }
    type();
  }

  /* ------------------------------------------------------------------------
   * 4. DEVELOPER CLI INTERACTIVE TERMINAL CONSOLE
   * ------------------------------------------------------------------------ */
  const terminalInput = document.getElementById('terminal-input');
  const terminalOutput = document.getElementById('terminal-output');
  const terminalBody = document.getElementById('terminal-body');

  const commands = {
    help: `
      <div style="color: var(--neon-emerald);">Available System Commands:</div>
      <div>- <span style="color:var(--neon-cyan);">bio</span>      : View professional background & summary</div>
      <div>- <span style="color:var(--neon-cyan);">skills</span>   : Output full technical skills breakdown</div>
      <div>- <span style="color:var(--neon-cyan);">projects</span> : Display showcase software projects</div>
      <div>- <span style="color:var(--neon-cyan);">certs</span>    : List verified Meta, IBM & Packt certifications</div>
      <div>- <span style="color:var(--neon-cyan);">contact</span>  : Display direct communication channels</div>
      <div>- <span style="color:var(--neon-cyan);">matrix</span>   : Trigger cyber visual animation test</div>
      <div>- <span style="color:var(--neon-cyan);">clear</span>    : Clear terminal screen</div>
    `,
    bio: `
      <div><strong style="color: #fff;">Gurudatta G Bhat</strong></div>
      <div>MCA Student & Aspiring Full-Stack Developer</div>
      <div>Focus Areas: AI/ML, Cybersecurity, Cloud Technologies & Modern Web Dev</div>
      <div>Building intelligent, scalable, and user-focused web applications with clean code.</div>
    `,
    skills: `
      <div style="color: var(--neon-purple);">=== TECHNICAL SKILLS ===</div>
      <div>• Programming: Python, Java, C</div>
      <div>• Web Dev: HTML5, CSS3, JavaScript (ES6+), NodeJS, ReactJS</div>
      <div>• Databases: MongoDB, MySQL, SQLite</div>
      <div>• Tools: VS Code, GitHub, Jupyter, Streamlit, Antigravity, Cursor, Netbeans</div>
    `,
    projects: `
      <div style="color: var(--neon-emerald);">=== FEATURED ENGINEERING PROJECTS (6) ===</div>
      <div>1. <strong>Local Handz</strong> - Home Services Platform (React, Node, MongoDB)</div>
      <div>2. <strong>Community Recycling Marketplace</strong> - Flask + SQLite Green Initiative</div>
      <div>3. <strong>CollabSpace</strong> - Real-Time Workspace (Spring Boot, WebSocket, MySQL)</div>
      <div>4. <strong>BeFit</strong> - AI Nutrition & Wellness Tracker (Python, Streamlit)</div>
      <div>5. <strong>ToolsEZ</strong> - All-in-One Utility Web Tools (JS, HTML5, CSS3)</div>
      <div>6. <strong>PathFinder</strong> - AI Resume Analyzer & Job Matcher (Python, AI/NLP)</div>
    `,
    certs: `
      <div style="color: var(--neon-cyan);">=== VERIFIED CERTIFICATIONS & CREDENTIALS (9) ===</div>
      <div>1. [EF SET] EF SET English Certificate (C2 Proficient - 84/100)</div>
      <div>2. [DeepLearning.AI] Applied Statistics for Data Analytics</div>
      <div>3. [Packt] Advanced Data Structures and Algorithms</div>
      <div>4. [Meta] Introduction to Databases</div>
      <div>5. [IBM] Java Programming for Beginners</div>
      <div>6. [EDUCBA] Machine Learning with Python & Statistics</div>
      <div>7. [Meta] Introduction to Front-End Development</div>
      <div>8. [UPenn] Data Analysis Using Python</div>
      <div>9. [IBM] Data Analysis with Python</div>
    `,
    contact: `
      <div style="color: var(--neon-emerald);">=== CONTACT CHANNELS ===</div>
      <div>Email: <a href="mailto:gurugbhat27@gmail.com" style="color:#fff;">gurugbhat27@gmail.com</a></div>
      <div>Edu Email: <a href="mailto:ggurudattaMCA25@stu.alliance.edu.in" style="color:#fff;">ggurudattaMCA25@stu.alliance.edu.in</a></div>
      <div>Phone: +91 9481411897</div>
      <div>LinkedIn: linkedin.com/in/gurudattagbhat/</div>
      <div>GitHub: github.com/gurudattagbhat</div>
    `,
    matrix: `
      <pre style="color: var(--neon-emerald); font-family: monospace; font-size: 0.75rem;">
  ______   __  __   ____    _____   _____     _     _____  _____   _    
 / _____| |  |  | |  _ \\  |  ___| |  _  \\   / \\   |_   _||_   _| / \\   
| |  ___  |  |  | | |_) | | |_    | | |  | / _ \\    | |    | |  / _ \\  
| | |_  | |  |  | |  _ <  |  _|   | | |  |/ ___ \\   | |    | | / ___ \\ 
 \\______/  \\______/|_| \\_\\ |_|    |_____//_/   \\_\\  |_|    |_|/_/   \\_\\
      </pre>
      <div style="color: var(--neon-cyan);">[SYSTEM] Cybermatic link verified. System operational.</div>
    `
  };

  function executeCommand(cmdText) {
    const trimmed = cmdText.trim().toLowerCase();
    synth.playBeep(1400, 0.05);

    // Echo input
    const inputEcho = document.createElement('div');
    inputEcho.className = 'terminal-line';
    inputEcho.innerHTML = `<span style="color: var(--neon-purple);">➜</span> <span style="color: var(--neon-cyan);">~/portfolio</span> ${cmdText}`;
    terminalOutput.appendChild(inputEcho);

    if (trimmed === 'clear') {
      terminalOutput.innerHTML = '';
    } else if (commands[trimmed]) {
      const response = document.createElement('div');
      response.className = 'terminal-line';
      response.innerHTML = commands[trimmed];
      terminalOutput.appendChild(response);
    } else if (trimmed !== '') {
      const errorMsg = document.createElement('div');
      errorMsg.className = 'terminal-line';
      errorMsg.innerHTML = `<span style="color: #ff5f56;">Command not recognized: '${cmdText}'. Type 'help' for command list.</span>`;
      terminalOutput.appendChild(errorMsg);
    }

    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = terminalInput.value;
        terminalInput.value = '';
        executeCommand(val);
      }
    });
  }

  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      executeCommand(cmd);
    });
  });

  /* ------------------------------------------------------------------------
   * 5. PROJECTS FILTERING SYSTEM
   * ------------------------------------------------------------------------ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category');
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.5s ease forward';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* Clickable Project Cards - Open Live Site */
  projectCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.project-link-icon') || e.target.closest('a')) {
        return;
      }
      const liveUrl = card.getAttribute('data-url');
      if (liveUrl) {
        if (typeof synth !== 'undefined' && synth && synth.playBeep) {
          synth.playBeep(1400, 0.06);
        }
        window.open(liveUrl, '_blank', 'noopener,noreferrer');
      }
    });
  });

  /* ------------------------------------------------------------------------
   * 6. SKILL BADGES ANIMATION OBSERVER
   * ------------------------------------------------------------------------ */
  const skillPills = document.querySelectorAll('.skill-tag-pill');
  const skillSection = document.getElementById('skills');

  if (skillSection && skillPills.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          skillPills.forEach((pill, idx) => {
            setTimeout(() => {
              pill.style.opacity = '1';
              pill.style.transform = 'translateY(0)';
            }, idx * 40);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    observer.observe(skillSection);
  }

  /* ------------------------------------------------------------------------
   * 7. CONTACT FORM TRANSMISSION HANDLER
   * ------------------------------------------------------------------------ */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const senderName = document.getElementById('sender-name')?.value || '';
      const senderEmail = document.getElementById('sender-email')?.value || '';
      const senderMessage = document.getElementById('sender-message')?.value || '';

      const recipientEmail = 'gurugbhat27@gmail.com';
      const subject = encodeURIComponent(`Portfolio Inquiry from ${senderName}`);
      const body = encodeURIComponent(`${senderMessage}\n\n-------------------------\nFrom: ${senderName}\nEmail: ${senderEmail}`);

      const mailtoUrl = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;

      if (typeof synth !== 'undefined' && synth && synth.playBeep) {
        synth.playBeep(1800, 0.15);
      }

      showToast('Launching mail client with your message...');

      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 400);

      contactForm.reset();
    });
  }

  /* ------------------------------------------------------------------------
   * 8. TOAST NOTIFICATION UTILITY
   * ------------------------------------------------------------------------ */
  function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    if (toast && toastMessage) {
      toastMessage.textContent = message;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3500);
    }
  }

  /* ------------------------------------------------------------------------
   * 9. MOBILE MENU & NAV ACTIVE SCROLL SPY
   * ------------------------------------------------------------------------ */
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');
  const navBackdrop = document.getElementById('nav-backdrop');
  const allNavLinks = document.querySelectorAll('.nav-link');
  const spySections = document.querySelectorAll('section[id]');

  function closeMobileNav() {
    if (navLinks) navLinks.classList.remove('mobile-open');
    if (navBackdrop) navBackdrop.classList.remove('active');
    if (mobileToggle) mobileToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    document.body.style.overflow = '';
  }

  function openMobileNav() {
    if (navLinks) navLinks.classList.add('mobile-open');
    if (navBackdrop) navBackdrop.classList.add('active');
    if (mobileToggle) mobileToggle.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  }

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      if (navLinks.classList.contains('mobile-open')) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  if (navBackdrop) {
    navBackdrop.addEventListener('click', closeMobileNav);
  }

  // Active link click handler with smooth scroll and active green underline update
  allNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          e.preventDefault();

          allNavLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');

          closeMobileNav();

          if (typeof synth !== 'undefined' && synth && synth.playBeep) {
            synth.playBeep(1600, 0.05);
          }

          const navHeight = 70;
          const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - navHeight;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Scroll Spy Observer to dynamically update green highlighter underline on scroll
  function updateScrollSpy() {
    let currentId = '';
    const scrollPosition = window.pageYOffset + 220;

    spySections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    if (currentId) {
      allNavLinks.forEach(l => {
        if (l.getAttribute('href') === `#${currentId}`) {
          l.classList.add('active');
        } else {
          l.classList.remove('active');
        }
      });
    }
  }

  window.addEventListener('scroll', updateScrollSpy);
  updateScrollSpy();

  /* ------------------------------------------------------------------------
   * 10. CERTIFICATE MODAL PREVIEW HANDLER
   * ------------------------------------------------------------------------ */
  const certModal = document.getElementById('cert-modal');
  const certModalClose = document.getElementById('cert-modal-close');
  const certModalTitle = document.getElementById('cert-modal-title');
  const certModalIssuer = document.getElementById('cert-modal-issuer');
  const certModalDate = document.getElementById('cert-modal-date');
  const certModalIframe = document.getElementById('cert-modal-iframe');
  const certModalVerify = document.getElementById('cert-modal-verify');
  const certModalDownload = document.getElementById('cert-modal-download');

  const certCards = document.querySelectorAll('.cert-card');

  if (certModal && certCards.length > 0) {
    certCards.forEach(card => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        
        try {
          if (typeof synth !== 'undefined' && synth && synth.playBeep) {
            synth.playBeep(1200, 0.08);
          }
        } catch (err) {}

        const title = card.getAttribute('data-title') || 'Certificate';
        const issuer = card.getAttribute('data-issuer') || 'Verified Credential';
        const icon = card.getAttribute('data-icon') || 'fa-solid fa-certificate';
        const iconColor = card.getAttribute('data-icon-color') || '#00ff9d';
        const date = card.getAttribute('data-date') || '';
        const pdf = card.getAttribute('data-pdf') || '';
        const verify = card.getAttribute('data-verify') || '#';

        if (certModalTitle) certModalTitle.textContent = title;
        if (certModalIssuer) {
          certModalIssuer.innerHTML = `<i class="${icon}" style="color: ${iconColor};"></i> ${issuer}`;
        }
        if (certModalDate) certModalDate.textContent = date ? `Completed: ${date}` : '';
        
        if (certModalIframe && pdf) {
          certModalIframe.src = encodeURI(pdf);
        }

        if (certModalVerify) {
          if (verify && verify !== '#') {
            certModalVerify.href = verify;
            certModalVerify.style.display = 'inline-flex';
          } else {
            certModalVerify.style.display = 'none';
          }
        }

        if (certModalDownload) certModalDownload.href = encodeURI(pdf);

        certModal.classList.add('active');
        certModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      });
    });

    function closeCertModal() {
      try {
        if (typeof synth !== 'undefined' && synth && synth.playBeep) {
          synth.playBeep(800, 0.05);
        }
      } catch (err) {}

      certModal.classList.remove('active');
      certModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (certModalIframe) certModalIframe.src = '';
    }

    if (certModalClose) {
      certModalClose.addEventListener('click', (e) => {
        e.stopPropagation();
        closeCertModal();
      });
    }

    certModal.addEventListener('click', (e) => {
      if (e.target === certModal) {
        closeCertModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && certModal.classList.contains('active')) {
        closeCertModal();
      }
    });
  }

});
