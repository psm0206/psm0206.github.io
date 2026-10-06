/**
 * AWESOME TRIP - Anti-Theft Spring Strap Landing Page
 * Interactive Logic: Modal, Navigation, Tabs, Accordion, Color Selector, Fallbacks
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. CTA MODAL LOGIC ("아직 준비 중입니다")
     ========================================================================== */
  const modal = document.getElementById('purchase-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalConfirmBtn = document.getElementById('modal-confirm-btn');
  const ctaTriggers = document.querySelectorAll('.cta-trigger');

  function openModal(triggerElement) {
    if (!modal) return;
    const ctaType = triggerElement ? triggerElement.getAttribute('data-cta-type') : 'unknown';
    // Accessibility & Visibility
    modal.removeAttribute('hidden');
    requestAnimationFrame(() => {
      modal.classList.add('is-open');
    });
    document.body.style.overflow = 'hidden';
    modalCloseBtn?.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    setTimeout(() => {
      modal.setAttribute('hidden', '');
      document.body.style.overflow = '';
    }, 250);
  }

  // Attach event listeners to all CTA buttons
  ctaTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(btn);
    });
  });

  modalCloseBtn?.addEventListener('click', closeModal);
  modalConfirmBtn?.addEventListener('click', closeModal);

  // Close on outside backdrop click
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('is-open')) {
      closeModal();
    }
  });


  /* ==========================================================================
     2. MOBILE NAVIGATION MENU
     ========================================================================== */
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('is-active');
    });

    // Close mobile nav when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('is-active');
      });
    });
  }


  /* ==========================================================================
     3. SMOOTH SCROLL & ACTIVE SECTION NAVIGATION SPY
     ========================================================================== */
  const sectionIds = ['pain', 'solution', 'proof', 'faq'];
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));


  /* ==========================================================================
     4. WEAR MODES TABBED INTERFACE
     ========================================================================== */
  const wearTabs = document.querySelectorAll('.wear-tab');
  const wearPanels = document.querySelectorAll('.wear-panel');

  wearTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const mode = tab.getAttribute('data-mode');

      // Update Tab Buttons
      wearTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Update Panels
      wearPanels.forEach(panel => {
        if (panel.id === `mode-panel-${mode}`) {
          panel.classList.add('active');
          panel.removeAttribute('hidden');
        } else {
          panel.classList.remove('active');
          panel.setAttribute('hidden', '');
        }
      });
    });
  });


  /* ==========================================================================
     5. FAQ ACCORDION (SINGLE OPEN + SMOOTH TRANSITION)
     ========================================================================== */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answerPanel = item.querySelector('.faq-answer');

    questionBtn?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
          otherItem.querySelector('.faq-answer')?.setAttribute('hidden', '');
        }
      });

      // Toggle clicked item
      if (isActive) {
        item.classList.remove('active');
        questionBtn.setAttribute('aria-expanded', 'false');
        answerPanel?.setAttribute('hidden', '');
      } else {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
        answerPanel?.removeAttribute('hidden');
      }
    });
  });


  /* ==========================================================================
     6. FINAL CTA: COLOR OPTION SELECTOR
     ========================================================================== */
  const colorChips = document.querySelectorAll('.color-chip');
  const previewImg = document.getElementById('final-preview-img');

  const colorImages = {
    black: './assets/product1-image9.png',
    clear: './assets/product1-image10.png'
  };

  colorChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const color = chip.getAttribute('data-color');

      colorChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      if (previewImg && colorImages[color]) {
        previewImg.style.opacity = '0';
        setTimeout(() => {
          previewImg.src = colorImages[color];
          previewImg.style.opacity = '1';
        }, 150);
      }
    });
  });

  if (previewImg) {
    previewImg.style.transition = 'opacity 0.2s ease';
  }


  /* ==========================================================================
     7. MOBILE STICKY BAR VISIBILITY (SHOW AFTER HERO, HIDE AT FINAL CTA)
     ========================================================================== */
  const mobileBar = document.getElementById('mobile-sticky-bar');
  const heroSection = document.getElementById('hero');
  const finalCtaBox = document.getElementById('cta-final-box');

  function updateMobileBarVisibility() {
    if (!mobileBar || !heroSection) return;

    const heroBottom = heroSection.getBoundingClientRect().bottom;
    const finalCtaTop = finalCtaBox ? finalCtaBox.getBoundingClientRect().top : Infinity;
    const windowHeight = window.innerHeight;

    // Show after hero is scrolled past
    if (heroBottom < 0 && finalCtaTop > windowHeight - 40) {
      mobileBar.style.display = 'block';
    } else {
      mobileBar.style.display = 'none';
    }
  }

  window.addEventListener('scroll', updateMobileBarVisibility, { passive: true });
  window.addEventListener('resize', updateMobileBarVisibility, { passive: true });


  /* ==========================================================================
     8. IMAGE FALLBACK HANDLING ("이미지 준비 중")
     ========================================================================== */
  const allImages = document.querySelectorAll('img');

  allImages.forEach(img => {
    img.addEventListener('error', () => {
      img.style.display = 'none';
      const frame = img.closest('.crop-frame') || img.parentElement;
      if (frame) {
        frame.classList.add('has-fallback');
        let fallback = frame.querySelector('.image-fallback');
        if (!fallback) {
          fallback = document.createElement('div');
          fallback.className = 'image-fallback';
          fallback.innerHTML = '<span>이미지 준비 중</span>';
          frame.appendChild(fallback);
        }
        fallback.style.display = 'flex';
      }
    });
  });


  /* ========================================================================
     9. GA4 SECTION VIEW & CTA CLICK MEASUREMENT
     ======================================================================== */
  if (!window.__landingPageAnalyticsInitialized) {
    window.__landingPageAnalyticsInitialized = true;

    const trackedSections = new Set();
    const sectionTargets = [
      { element: document.getElementById('hero-title'), sectionName: 'hero' },
      { element: document.getElementById('detail-space-title'), sectionName: 'detail' },
      { element: document.getElementById('purchase-title'), sectionName: 'cta' }
    ].filter(({ element }) => element);

    function sendAnalyticsEvent(eventName, parameters) {
      if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, parameters);
      }
    }

    function getHeaderOffset() {
      const header = document.getElementById('header');
      return header ? Math.ceil(header.getBoundingClientRect().height) : 0;
    }

    function isHalfVisibleBelowHeader(element) {
      const rect = element.getBoundingClientRect();
      if (rect.height <= 0) return false;

      const viewportTop = getHeaderOffset();
      const visibleTop = Math.max(rect.top, viewportTop);
      const visibleBottom = Math.min(rect.bottom, window.innerHeight);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      return visibleHeight / rect.height >= 0.5;
    }

    function trackSectionIfVisible(target) {
      if (
        document.visibilityState !== 'visible' ||
        trackedSections.has(target.sectionName) ||
        !isHalfVisibleBelowHeader(target.element)
      ) {
        return;
      }

      trackedSections.add(target.sectionName);
      sendAnalyticsEvent('section_view', { section_name: target.sectionName });
    }

    const sectionViewObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          const target = sectionTargets.find(({ element }) => element === entry.target);
          if (target) trackSectionIfVisible(target);
        }
      });
    }, {
      root: null,
      rootMargin: `-${getHeaderOffset()}px 0px 0px 0px`,
      threshold: [0.5]
    });

    sectionTargets.forEach(({ element }) => sectionViewObserver.observe(element));

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        sectionTargets.forEach(trackSectionIfVisible);
      }
    });

    window.addEventListener('pageshow', () => {
      sectionTargets.forEach(trackSectionIfVisible);
    });

    const ctaElements = new Set([
      ...document.querySelectorAll('#cta-hero, [data-cta-location="hero"]'),
      ...document.querySelectorAll('#cta-final, [data-cta-location="final"]')
    ]);

    ctaElements.forEach((cta) => {
      const location = cta.matches('#cta-hero, [data-cta-location="hero"]') ? 'hero' : 'final';
      cta.addEventListener('click', () => {
        sendAnalyticsEvent('cta_click', { button_location: location });
      });
    });
  }

});
