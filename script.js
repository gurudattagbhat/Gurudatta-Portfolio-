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
  document.querySelectorAll('.btn-primary, .btn-secondary, .social-btn, .filter-btn, .nav-link, .avatar-contact-badge').forEach(btn => {
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
    }, { passive: true });

    const mouse = { x: null, y: null, radius: 150 };
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    const particles = [];
    const particleCount = Math.min(Math.floor(width / 16), 105);

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.55;
        this.vy = (Math.random() - 0.5) * 0.55;
        this.radius = Math.random() * 1.8 + 1;
        this.color = Math.random() > 0.45 ? '#00ff9d' : '#a855f7';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Gentle mouse attraction & interaction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= (dx / dist) * force * 1.5;
            this.y -= (dy / dist) * force * 1.5;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animateCanvas() {
      ctx.clearRect(0, 0, width, height);

      const pLen = particles.length;

      // 1. Draw connecting lines between nearby particles
      for (let a = 0; a < pLen; a++) {
        particles[a].update();

        for (let b = a + 1; b < pLen; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.strokeStyle = `rgba(0, 255, 157, ${(1 - dist / 130) * 0.7})`;
            ctx.lineWidth = 0.55;
            ctx.stroke();
          }
        }
      }

      // 2. Draw all particle dots on top
      for (let i = 0; i < pLen; i++) {
        particles[i].draw();
      }

      requestAnimationFrame(animateCanvas);
    }
    requestAnimationFrame(animateCanvas);
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
      <div>- <span style="color:var(--neon-cyan);">resume</span>   : View and download official CV</div>
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
    resume: `
      <div style="color: var(--neon-emerald);">=== RESUME / CURRICULUM VITAE ===</div>
      <div>Candidate: <strong>Gurudatta Ganapati Bhat</strong> (MCA Scholar)</div>
      <div>Focus: Full-Stack Web Development | AI/ML | Software Engineering</div>
      <div>File: <code>Gurudatta_CV.pdf</code> (1.7 MB Verified Document)</div>
      <div style="margin-top: 0.5rem;">Actions:</div>
      <div>• <a href="assets/resumes/Gurudatta_CV.pdf" download="Gurudatta_Bhat_Resume.pdf" style="color: var(--neon-cyan); text-decoration: underline;">Download Gurudatta_CV.pdf</a></div>
      <div>• <a href="assets/resumes/Gurudatta_CV.pdf" target="_blank" rel="noopener noreferrer" style="color: var(--neon-emerald); text-decoration: underline;">Open PDF in New Window</a></div>
      <div>• Direct Anchor: <a href="#resume" style="color: #fff; text-decoration: underline;">Jump to #resume Section</a></div>
    `,
    skills: `
      <div style="color: var(--neon-purple);">=== TECHNICAL SKILLS ===</div>
      <div>• Programming: Python, Java, C</div>
      <div>• Web Dev: HTML5, CSS3, JavaScript (ES6+), NodeJS, ReactJS</div>
      <div>• Databases: MongoDB, MySQL, SQLite</div>
      <div>• Tools: VS Code, GitHub, Jupyter, Streamlit, Antigravity, Cursor, Netbeans</div>
    `,
    projects: `
      <div style="color: var(--neon-emerald);">=== FEATURED ENGINEERING PROJECTS (8) ===</div>
      <div>1. <strong>Local Handz</strong> - Home Services Platform (PHP, MySQL, JavaScript)</div>
      <div>2. <strong>Community Recycling Marketplace</strong> - Flask + SQLite Green Initiative</div>
      <div>3. <strong>CollabSpace</strong> - Real-Time Workspace (Spring Boot, WebSocket, MySQL)</div>
      <div>4. <strong>BeFit</strong> - AI Nutrition & Wellness Tracker (Python, Streamlit)</div>
      <div>5. <strong>ToolsEZ</strong> - All-in-One Utility Web Tools (JS, HTML5, CSS3)</div>
      <div>6. <strong>PathFinder</strong> - AI Resume Analyzer & Job Matcher (Python, AI/NLP)</div>
      <div>7. <strong>Study Mate AI</strong> - Intelligent AI Academic Companion (Node.js, Groq AI, Express)</div>
      <div>8. <strong>CareerPilot PRO</strong> - Multi-Platform Job Aggregator & AI ATS Doctor (MERN, Groq AI)</div>
    `,
    certs: `
      <div style="color: var(--neon-cyan);">=== VERIFIED CERTIFICATIONS & CREDENTIALS (17) ===</div>
      <div>1. [1M1B & AICTE] 1M1B Green Internship Certificate</div>
      <div>2. [EF SET] EF SET English Certificate (C2 Proficient - 84/100)</div>
      <div>3. [UIUC] Pattern Discovery in Data Mining</div>
      <div>4. [UIUC] Data Visualization</div>
      <div>5. [UIUC] Text Retrieval and Search Engines</div>
      <div>6. [IBM] Computer Networks and Network Security</div>
      <div>7. [Board Infinity] Quality Improvement and Management</div>
      <div>8. [IBM] Introduction to Artificial Intelligence (AI)</div>
      <div>9. [IBM] Introduction to Software Engineering</div>
      <div>10. [DeepLearning.AI] Applied Statistics for Data Analytics</div>
      <div>11. [Packt] Advanced Data Structures and Algorithms</div>
      <div>12. [Meta] Introduction to Databases</div>
      <div>13. [IBM] Java Programming for Beginners</div>
      <div>14. [EDUCBA] Machine Learning with Python & Statistics</div>
      <div>15. [Meta] Introduction to Front-End Development</div>
      <div>16. [UPenn] Data Analysis Using Python</div>
      <div>17. [IBM] Data Analysis with Python</div>
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
   * 5b. PROJECT CARDS SPOTLIGHT & AUDIO ENGINE (NO TILT / NO SCAN)
   * ------------------------------------------------------------------------ */
  const initProjectMotionGraphics = () => {
    if (!projectCards.length) return;

    let soundThrottle = 0;

    projectCards.forEach(card => {
      let bounds = null;

      const onMouseEnter = () => {
        bounds = card.getBoundingClientRect();

        // Play subtle cyber interaction chirp
        const now = Date.now();
        if (now - soundThrottle > 280) {
          soundThrottle = now;
          if (typeof synth !== 'undefined' && synth && synth.enabled && synth.playBeep) {
            synth.playBeep(1800, 0.02);
          }
        }
      };

      const onMouseMove = (e) => {
        if (!bounds) bounds = card.getBoundingClientRect();
        const mouseX = e.clientX - bounds.left;
        const mouseY = e.clientY - bounds.top;

        // Update CSS variables for smooth radial cursor spotlight
        card.style.setProperty('--mouse-x', `${mouseX}px`);
        card.style.setProperty('--mouse-y', `${mouseY}px`);
      };

      const onMouseLeave = () => {
        bounds = null;
      };

      card.addEventListener('mouseenter', onMouseEnter);
      card.addEventListener('mousemove', onMouseMove);
      card.addEventListener('mouseleave', onMouseLeave);
    });
  };

  initProjectMotionGraphics();

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

  // High-performance Scroll Spy using native IntersectionObserver (zero layout thrashing)
  const navObserverOptions = {
    root: null,
    rootMargin: '-20% 0px -65% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute('id');
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
    });
  }, navObserverOptions);

  spySections.forEach(sec => navObserver.observe(sec));

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

  /* ------------------------------------------------------------------------
   * 11. DEDICATED RESUME PREVIEW MODAL CONTROLLER
   * ------------------------------------------------------------------------ */
  const resumeModal = document.getElementById('resume-modal');
  const resumeModalClose = document.getElementById('resume-modal-close');
  const resumeModalIframe = document.getElementById('resume-modal-iframe');
  const resumeOpenModalBtn = document.getElementById('resume-open-modal-btn');
  const heroResumeBtn = document.getElementById('hero-resume-btn');
  const resumeDownloadBtn = document.getElementById('resume-download-btn');
  const resumeOpenBtn = document.getElementById('resume-open-btn');
  const resumePdfPath = 'assets/resumes/Gurudatta_CV.pdf';

  function openResumeModal() {
    if (typeof synth !== 'undefined' && synth && synth.playBeep) {
      synth.playBeep(1200, 0.08);
    }
    if (resumeModalIframe) {
      resumeModalIframe.src = `${resumePdfPath}#view=FitH&toolbar=1`;
    }
    if (resumeModal) {
      resumeModal.classList.add('active');
      resumeModal.setAttribute('aria-hidden', 'false');
    }
    document.body.style.overflow = 'hidden';
    showToast('Loading Gurudatta_CV.pdf Preview...');
  }

  function closeResumeModal() {
    if (typeof synth !== 'undefined' && synth && synth.playBeep) {
      synth.playBeep(800, 0.05);
    }
    if (resumeModal) {
      resumeModal.classList.remove('active');
      resumeModal.setAttribute('aria-hidden', 'true');
    }
    document.body.style.overflow = '';
    if (resumeModalIframe) {
      resumeModalIframe.src = '';
    }
  }

  if (resumeOpenModalBtn) {
    resumeOpenModalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openResumeModal();
    });
  }

  if (heroResumeBtn) {
    heroResumeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openResumeModal();
    });
  }

  if (resumeModalClose) {
    resumeModalClose.addEventListener('click', (e) => {
      e.stopPropagation();
      closeResumeModal();
    });
  }

  if (resumeModal) {
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) {
        closeResumeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && resumeModal && resumeModal.classList.contains('active')) {
      closeResumeModal();
    }
  });

  if (resumeDownloadBtn) {
    resumeDownloadBtn.addEventListener('click', () => {
      if (typeof synth !== 'undefined' && synth && synth.playBeep) {
        synth.playBeep(1500, 0.1);
      }
      showToast('Downloading Gurudatta_CV.pdf...');
    });
  }

  if (resumeOpenBtn) {
    resumeOpenBtn.addEventListener('click', () => {
      if (typeof synth !== 'undefined' && synth && synth.playBeep) {
        synth.playBeep(1300, 0.08);
      }
    });
  }

  /* ------------------------------------------------------------------------
   * 12. ACADEMIC TIMELINE SCROLL-DRIVEN CONNECTING LINE ANIMATION
   * ------------------------------------------------------------------------ */
  const timelineContainer = document.getElementById('timeline-container');
  const timelineProgressLine = document.getElementById('timeline-progress-line');
  const timelineProgressHead = document.getElementById('timeline-progress-head');
  const timelineItems = document.querySelectorAll('.timeline-item');

  if (timelineContainer && timelineProgressLine) {
    let ticking = false;

    function updateTimelineOnScroll() {
      const containerRect = timelineContainer.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Line begins extending downward as soon as top of timeline enters the middle-bottom portion of viewport
      const triggerPoint = windowHeight * 0.65;
      const containerTop = containerRect.top;
      const containerHeight = containerRect.height;

      // Distance from trigger point to container top
      let currentProgress = triggerPoint - containerTop;
      
      // Clamp between 0 and full container height
      currentProgress = Math.max(0, Math.min(currentProgress, containerHeight));

      // Apply line height
      timelineProgressLine.style.height = `${currentProgress}px`;

      // Active photon head spark
      if (timelineProgressHead) {
        if (currentProgress > 10 && currentProgress < containerHeight) {
          timelineProgressHead.classList.add('active');
        } else {
          timelineProgressHead.classList.remove('active');
        }
      }

      // Check each dot / item connection
      timelineItems.forEach(item => {
        const node = item.querySelector('.timeline-node');
        if (!node) return;

        // Position of node center relative to container top
        const nodeTop = item.offsetTop + node.offsetTop + (node.offsetHeight / 2);

        // When the glowing line reaches or passes the node
        if (currentProgress >= nodeTop - 6) {
          if (!item.classList.contains('active')) {
            item.classList.add('active');
            node.classList.add('active');
            try {
              if (synth && synth.enabled && synth.playBeep) {
                const idx = parseInt(item.getAttribute('data-timeline-idx') || '0', 10);
                synth.playBeep(900 + (idx * 160), 0.05);
              }
            } catch (e) {}
          }
        } else {
          item.classList.remove('active');
          node.classList.remove('active');
        }
      });

      ticking = false;
    }

    function onTimelineScroll() {
      if (!ticking) {
        requestAnimationFrame(updateTimelineOnScroll);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onTimelineScroll, { passive: true });
    window.addEventListener('resize', onTimelineScroll, { passive: true });

    // Initial check on load
    updateTimelineOnScroll();
  }

});
