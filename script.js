/* ============================================================
   AGENT_KERNEL — Interactive Systems
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================
     1. TERMINAL TYPING ANIMATION
     ========================================================== */
  const terminalText = document.getElementById('terminalText');
  const phrases = [
    '> INITIALIZING_KNOWLEDGE_MATRIX...',
    '> LOADING AGENT_PROTOCOLS...',
    '> CONNECTING TO SKILL_REGISTRY...',
    '> SYSTEM_READY // WELCOME BACK.',
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 60;

  function typeLoop() {
    const current = phrases[phraseIdx];

    if (!isDeleting) {
      // Typing forward
      terminalText.textContent = current.slice(0, charIdx + 1);
      charIdx++;

      if (charIdx === current.length) {
        // Finished typing — pause, then start deleting
        typingSpeed = 2000;
        isDeleting = true;
      } else {
        // Random micro-variation for realism
        typingSpeed = 40 + Math.random() * 50;
      }
    } else {
      // Deleting
      terminalText.textContent = current.slice(0, charIdx - 1);
      charIdx--;

      if (charIdx === 0) {
        // Finished deleting — move to next phrase
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        typingSpeed = 300;
      } else {
        typingSpeed = 20 + Math.random() * 20;
      }
    }

    setTimeout(typeLoop, typingSpeed);
  }

  // Kick off the typing loop
  setTimeout(typeLoop, 600);

  /* ==========================================================
     2. MOBILE MENU TOGGLE
     ========================================================== */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = mobileMenu.querySelectorAll('a');

  function openMenu() {
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    if (hamburger.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close menu when a link is clicked
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  /* ==========================================================
     3. NAV SCROLL EFFECTS (border glow + active link)
     ========================================================== */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = [];

  // Collect all sections referenced by nav links
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      const section = document.querySelector(href);
      if (section) sections.push({ id: href, el: section });
    }
  });

  function updateNavState() {
    const scrollY = window.scrollY;

    // Add/remove scrolled class for border glow
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Determine which section is currently in view
    let currentSection = '';
    const viewportMiddle = scrollY + window.innerHeight / 3;

    for (const { id, el } of sections) {
      const rect = el.getBoundingClientRect();
      const sectionTop = rect.top + scrollY;
      if (sectionTop <= viewportMiddle) {
        currentSection = id;
      }
    }

    // Update active link
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === currentSection) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateNavState, { passive: true });
  updateNavState(); // Initial state

  /* ==========================================================
     4. SCROLL-TRIGGERED REVEAL ANIMATIONS
     ========================================================== */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: show all immediately
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ==========================================================
     5. STATS COUNTER ANIMATION
     ========================================================== */
  const statValues = document.querySelectorAll('.stat-value[data-count]');
  let statsAnimated = false;

  function animateStats() {
    if (statsAnimated) return;
    statsAnimated = true;

    statValues.forEach(el => {
      const targetStr = el.getAttribute('data-count');
      const isDecimal = targetStr.includes('.');
      const target = parseFloat(targetStr);
      const duration = 1800; // ms
      const startTime = performance.now();

      function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out curve
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = target * eased;

        if (isDecimal) {
          el.textContent = current.toFixed(1) + 'K';
        } else {
          el.textContent = Math.floor(current);
        }

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = isDecimal ? targetStr + 'K' : targetStr;
        }
      }

      requestAnimationFrame(update);
    });
  }

  if ('IntersectionObserver' in window) {
    const statsSection = document.querySelector('.stats-section');
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateStats();
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    statsObserver.observe(statsSection);
  } else {
    // Fallback
    animateStats();
  }

  /* ==========================================================
     6. SMOOTH SCROLLING FOR ALL ANCHOR LINKS
     ========================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const navHeight = navbar.offsetHeight;
      const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: targetPos,
        behavior: 'smooth',
      });
    });
  });

  /* ==========================================================
     7. KEYBOARD SUPPORT — ESC to close mobile menu
     ========================================================== */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMenu();
      hamburger.focus();
    }
  });

});
