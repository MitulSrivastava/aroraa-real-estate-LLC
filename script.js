/**
 * Aroraa Real Estate — Premium JavaScript
 * Handles interactive features with cinematic animations
 */

// Utility functions
const utils = {
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  throttle: (func, limit) => {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },
};

// Subtle scroll animations class
class ScrollAnimations {
  constructor() {
    this.animatedElements = new Set();
    this.init();
  }

  init() {
    this.observeElements();
    this.setupIntersectionObserver();
    
    // Safety fallback: Ensure visibility after load
    setTimeout(() => {
        document.querySelectorAll(".animate-on-scroll, [data-animation]").forEach(el => {
            if (getComputedStyle(el).opacity === "0" || el.style.opacity === "0") {
                el.style.opacity = "1";
                el.style.transform = "translateY(0)";
            }
        });
    }, 1500);
  }

  observeElements() {
    const elements = document.querySelectorAll(
      ".animate-on-scroll, [data-animation]"
    );
    elements.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = "all 0.6s ease-out";
    });
  }

  setupIntersectionObserver() {
    const options = {
      threshold: 0.1,
      rootMargin: "0px 0px -30px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
          this.animateElement(entry.target);
          this.animatedElements.add(entry.target);
        }
      });
    }, options);

    document
      .querySelectorAll(".animate-on-scroll, [data-animation]")
      .forEach((el) => {
        observer.observe(el);
      });
  }

  animateElement(element) {
    const delay = element.dataset.delay || "0s";

    setTimeout(() => {
      element.style.opacity = "1";
      element.style.transform = "translateY(0)";
    }, parseFloat(delay) * 1000);
  }
}

/**
 * Main website initialization function
 */
function initializeWebsite() {
  // Guard against double-initialization: this is called from two separate
  // DOMContentLoaded handlers, which would otherwise attach every click
  // listener twice (e.g. the Save toggle would fire twice and cancel out).
  if (window.__websiteInitialized) return;
  window.__websiteInitialized = true;
  setupNavigation();
  // setupContactForm(); // DISABLED: real submit handled by inline page script (the duplicate caused the stuck 'Sending' button)
  setupNewsletterForm();
  setupPropertyFinderAnimations();
  setupLazyLoading();
  setupInvestmentTracking();
  setupCounters();
  setupScrollProgress();
  setupTypewriter();
  setupTestimonialCarousel();
  setupHeroBackgroundSlider();
  
  // Initialize Save Button functionality — turns the button red when saved.
  // Styles are set inline with !important so they apply reliably regardless of
  // the page's other cascade rules.
  const saveBtns = document.querySelectorAll('#shortlistBtn, .save-btn');
  saveBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const saved = this.classList.toggle('saved');
      const icon = this.querySelector('i.fa-heart');
      if (saved) {
        this.style.setProperty('background', '#dc3545', 'important');
        this.style.setProperty('border-color', '#dc3545', 'important');
        this.style.setProperty('color', '#ffffff', 'important');
        if (icon) icon.style.setProperty('color', '#ffffff', 'important');
      } else {
        this.style.setProperty('background', 'rgba(255,255,255,0.08)', 'important');
        this.style.setProperty('border-color', 'rgba(255,255,255,0.2)', 'important');
        this.style.setProperty('color', '#ffffff', 'important');
        if (icon) icon.style.setProperty('color', '#c9a55f', 'important');
      }
      if (icon) {
        icon.style.transition = 'all 0.3s ease';
        icon.style.transform = 'scale(1.2)';
        setTimeout(() => { icon.style.transform = 'scale(1)'; }, 200);
      }
    });
  });

  // Initialize Share Button functionality
  // Uses the native share sheet where available, otherwise copies the page URL.
  const shareBtns = document.querySelectorAll('#shareBtn, .share-btn');
  shareBtns.forEach(btn => {
    btn.addEventListener('click', async function(e) {
      e.preventDefault();
      const shareData = {
        title: document.title,
        text: document.title,
        url: window.location.href,
      };
      if (navigator.share) {
        try { await navigator.share(shareData); } catch (err) { /* user cancelled */ }
        return;
      }
      // Fallback: copy link to clipboard with brief visual confirmation
      const original = this.innerHTML;
      const showCopied = () => {
        this.innerHTML = '<i class="fas fa-check" style="color:#c9a55f;"></i> Link Copied';
        setTimeout(() => { this.innerHTML = original; }, 2000);
      };
      try {
        await navigator.clipboard.writeText(window.location.href);
        showCopied();
      } catch (err) {
        window.prompt('Copy this link:', window.location.href);
      }
    });
  });
}

/**
 * Scroll progress bar
 */
function setupScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', utils.throttle(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  }, 16));
}

/**
 * Hero Background Slider
 */
function setupHeroBackgroundSlider() {
  const slides = document.querySelectorAll('.hero-bg-slide');
  if (slides.length === 0) return;

  let currentSlide = 0;
  
  // Make sure only the first slide is active initially
  slides.forEach((slide, index) => {
    if (index === 0) {
      slide.classList.add('active');
    } else {
      slide.classList.remove('active');
    }
  });

  setInterval(() => {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }, 5000); // Change image every 5 seconds
}

/**
 * Typewriter effect for hero headline
 */
function setupTypewriter() {
  const el = document.getElementById('hero-typewriter');
  if (!el) return;
  const phrases = [
    "Dubai's Premier Luxury Real Estate Advisors",
    "Exclusive Waterfront Villas & Penthouses",
    "Your Gateway to Ultra-Luxury UAE Properties",
  ];
  let phraseIdx = 0, charIdx = 0, deleting = false;

  function tick() {
    const current = phrases[phraseIdx];
    if (!deleting) {
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(tick, 2200);
        return;
      }
    } else {
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }
    setTimeout(tick, deleting ? 40 : 65);
  }
  tick();
}

/**
 * Testimonial carousel with auto-rotation
 */
/**
 * Testimonial carousel with loop, autoplay, responsive cards and details modal
 */
function setupTestimonialCarousel() {
  const container = document.querySelector('.testimonial-carousel-wrap');
  const track = document.getElementById('testimonialTrack');
  const prevBtn = document.getElementById('testimonialPrev');
  const nextBtn = document.getElementById('testimonialNext');
  
  if (!container || !track || !prevBtn || !nextBtn) return;

  // Real slides only, no clones
  const slides = Array.from(track.querySelectorAll('.testimonial-slide'));
  if (slides.length === 0) return;

  const totalSlides = slides.length;
  const gap = 20;
  let currentIndex = 0;

  function getVisibleCards() {
    if (window.innerWidth >= 1200) return 4;
    if (window.innerWidth >= 768) return 2;
    return 1;
  }

  function getSlideWidthWithGap() {
    const visibleCards = getVisibleCards();
    const containerWidth = container.offsetWidth;
    const slideWidth = (containerWidth - (visibleCards - 1) * gap) / visibleCards;
    return slideWidth + gap;
  }

  function updateLayout() {
    const visibleCards = getVisibleCards();
    const containerWidth = container.offsetWidth;
    const slideWidth = (containerWidth - (visibleCards - 1) * gap) / visibleCards;

    slides.forEach(slide => {
      slide.style.width = `${slideWidth}px`;
      slide.style.marginRight = `${gap}px`;
    });

    const maxIndex = Math.max(0, totalSlides - visibleCards);
    currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));

    const slideWidthWithGap = slideWidth + gap;
    const offset = -currentIndex * slideWidthWithGap;

    track.style.transition = 'none';
    track.style.transform = `translateX(${offset}px)`;

    // Update active/disabled state on buttons
    prevBtn.disabled = (currentIndex === 0);
    nextBtn.disabled = (currentIndex === maxIndex);
  }

  function move(index) {
    const visibleCards = getVisibleCards();
    const maxIndex = Math.max(0, totalSlides - visibleCards);
    currentIndex = Math.max(0, Math.min(index, maxIndex));

    const slideWidthWithGap = getSlideWidthWithGap();
    const offset = -currentIndex * slideWidthWithGap;

    track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    track.style.transform = `translateX(${offset}px)`;

    // Update active/disabled state on buttons
    prevBtn.disabled = (currentIndex === 0);
    nextBtn.disabled = (currentIndex === maxIndex);
  }

  prevBtn.addEventListener('click', () => {
    move(currentIndex - 1);
  });

  nextBtn.addEventListener('click', () => {
    move(currentIndex + 1);
  });

  // Autoplay functionality (goes back to 0 at the end)
  let autoplayInterval;
  function startAutoplay() {
    autoplayInterval = setInterval(() => {
      const visibleCards = getVisibleCards();
      const maxIndex = Math.max(0, totalSlides - visibleCards);
      if (currentIndex >= maxIndex) {
        move(0);
      } else {
        move(currentIndex + 1);
      }
    }, 6000);
  }

  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }

  container.parentElement.addEventListener('mouseenter', stopAutoplay);
  container.parentElement.addEventListener('mouseleave', startAutoplay);

  // Swipe support for mobile/touch screens
  let startX = 0;
  let isDragging = false;

  track.addEventListener('touchstart', (e) => {
    stopAutoplay();
    startX = e.touches[0].clientX;
    isDragging = true;
    track.style.transition = 'none';
  }, { passive: true });

  track.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    const slideWidthWithGap = getSlideWidthWithGap();
    const baseOffset = -currentIndex * slideWidthWithGap;

    const visibleCards = getVisibleCards();
    const maxIndex = Math.max(0, totalSlides - visibleCards);
    let targetOffset = baseOffset + diff;

    // Apply friction past boundaries
    if (targetOffset > 0) {
      targetOffset = diff * 0.3;
    } else {
      const maxOffset = -maxIndex * slideWidthWithGap;
      if (targetOffset < maxOffset) {
        targetOffset = maxOffset + (targetOffset - maxOffset) * 0.3;
      }
    }

    track.style.transform = `translateX(${targetOffset}px)`;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        move(currentIndex + 1);
      } else {
        move(currentIndex - 1);
      }
    } else {
      move(currentIndex);
    }
    startAutoplay();
  });

  window.addEventListener('resize', utils.debounce(updateLayout, 100));

  // Initialize
  updateLayout();
  startAutoplay();

  // Modal review details click listener
  document.addEventListener('click', function(e) {
    const btn = e.target.closest('.read-full-btn');
    if (!btn) return;
    
    e.preventDefault();
    const card = btn.closest('.premium-testimonial-card');
    if (!card) return;
    
    const name = card.querySelector('.reviewer-name').textContent.trim();
    const role = card.querySelector('.reviewer-title').textContent.trim();
    const stars = card.querySelector('.stars-container').innerHTML;
    let text = card.querySelector('.review-text-body').textContent.trim();
    
    // Strip leading/trailing quotes
    text = text.replace(/^"|"$/g, '').trim();

    showTestimonialModal(name, role, stars, text);
  });
}

// Global modal builder/shower function
window.showTestimonialModal = function(name, role, stars, text) {
  let modal = document.getElementById('testimonialDetailModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'testimonialDetailModal';
    modal.className = 'modal fade';
    modal.tabIndex = -1;
    modal.innerHTML = `
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content premium-modal-content" style="background:#ffffff; border:1px solid rgba(201,165,95,0.3); border-radius:24px; color:#19273c; box-shadow: 0 25px 50px rgba(9,28,58,0.15);">
          <div class="modal-header border-0 pb-0" style="border:none;">
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body p-4 pt-0">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <div class="stars-container fs-5" style="display:flex; gap:2px;">${stars}</div>
              <div class="google-brand">
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.62-.62-1.09-1.34-1.39-2.12z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span class="verified-text ms-2" style="color: #627282; font-size:11px; font-weight:500;">Verified Google Review</span>
              </div>
            </div>
            <p class="fs-5 mt-3" style="line-height:1.7; color:#19273c; font-style:italic;">"${text}"</p>
            <div class="card-reviewer-row mt-4 pt-3" style="border-top: 1px solid rgba(9, 28, 58, 0.08); display:flex; align-items:center;">
              <div class="reviewer-avatar-circle me-3" style="width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, #091c3a, #162c5c); border: 1.5px solid #c9a55f; color: #c9a55f; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px; flex-shrink: 0;">${name.charAt(0)}</div>
              <div class="reviewer-info">
                <div class="reviewer-name" style="font-size: 16px; font-weight: 600; color: #091c3a; line-height: 1.2;">${name}</div>
                <div class="reviewer-title" style="font-size: 13px; color: #627282; margin-top: 2px;">${role}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  } else {
    modal.querySelector('.stars-container').innerHTML = stars;
    modal.querySelector('p').innerText = `"${text}"`;
    modal.querySelector('.reviewer-avatar-circle').innerText = name.charAt(0);
    modal.querySelector('.reviewer-name').innerText = name;
    modal.querySelector('.reviewer-title').innerText = role;
  }
  const bsModal = new bootstrap.Modal(modal);
  bsModal.show();
};

/**
 * Setup animated counters
 */
function setupCounters() {
  const counters = document.querySelectorAll('.counter');
  const speed = 200; // The lower the slower

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const updateCount = () => {
          const target = +counter.getAttribute('data-target');
          const count = +counter.innerText;
          const inc = target / speed;

          if (count < target) {
            counter.innerText = Math.ceil(count + inc);
            setTimeout(updateCount, 10);
          } else {
            counter.innerText = target;
          }
        };
        updateCount();
        observer.unobserve(counter);
      }
    });
  }, observerOptions);

  counters.forEach(counter => {
    counterObserver.observe(counter);
  });
}

/* =================================================================== */
/* PROPERTY PAGE SPECIFIC FUNCTIONS */
/* =================================================================== */

/**
 * Initialize property page functionality
 */
function initializePropertyPage() {
  // Only run on property page
  if (!document.querySelector(".property-page")) {
    setupPropertyContactForm();
    setupPropertyScrollEffects();
    setupPropertyCarousel();
    setupPropertyModalForms();
    setupPropertyUnitEnquiry();
  }
}

/**
 * Setup property contact form
 */
function setupPropertyContactForm() {
  const form = document.getElementById("propertyContactForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form data
    const formData = {
      name: form.querySelector('input[type="text"]')?.value,
      phone: form.querySelector('input[type="tel"]')?.value,
      email: form.querySelector('input[type="email"]')?.value,
      interest: form.querySelector("select")?.value,
      project: "Dasnac",
    };

    // Validate form
    if (!validatePropertyForm(formData)) {
      showNotification("Please fill all required fields", "error");
      return;
    }

    // Submit form
    submitPropertyContactForm(formData);
  });
}

/**
 * Setup property scroll effects
 */
function setupPropertyScrollEffects() {
  // Smooth scroll for navigation links
  const navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      if (href.startsWith("#") && href !== "#") {
        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
          const offsetTop = target.offsetTop - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: "smooth",
          });
        }
      }
    });
  });
}

/**
 * Setup property carousel functionality
 */
function setupPropertyCarousel() {
  const carousel = document.getElementById("projectGallery");
  if (!carousel) return;

  // Auto-play carousel
  const carouselInstance = new bootstrap.Carousel(carousel, {
    interval: 5000,
    wrap: true,
  });

  // Pause on hover
  carousel.addEventListener("mouseenter", () => {
    carouselInstance.pause();
  });

  carousel.addEventListener("mouseleave", () => {
    carouselInstance.cycle();
  });
}

/**
 * Setup property modal forms
 */
function setupPropertyModalForms() {
  // Quick enquiry forms
  const enquireModals = document.querySelectorAll('[data-bs-toggle="modal"]');

  enquireModals.forEach((trigger) => {
    trigger.addEventListener("click", function () {
      const modalId = this.getAttribute("data-bs-target");
      const modal = document.querySelector(modalId);

      if (modal) {
        const form = modal.querySelector("form");
        if (form) {
          form.addEventListener("submit", function (e) {
            e.preventDefault();
            // handlePropertyEnquiry(this); - Removed as function doesn't exist
            showNotification(
              "Thank you for your enquiry. Our team will contact you shortly.",
              "success"
            );
          });
        }
      }
    });
  });
}

/**
 * Handle unit-specific enquiries
 */
function setupPropertyUnitEnquiry() {
  window.enquireUnit = function (unitType) {
    showNotification(
      `Thank you for your interest in ${unitType} units. Our team will contact you with detailed information within 24 hours.`,
      "success"
    );
  };
}

// Initialize property page functions when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Check if we're on a property page and initialize accordingly
  if (document.querySelector(".hero-section")) {
    initializePropertyPage();
  }
});

// Export property functions for global access
window.enquireUnit = window.enquireUnit || function () {};

// DOM Content Loaded Event - Single initialization point
document.addEventListener("DOMContentLoaded", function () {
  // Initialize website features
  initializeWebsite();
  initializeServicesPage();
  setupPropertyFiltering();

  // Initialize subtle features - only if classes are defined
  if (typeof ScrollAnimations !== "undefined") {
    new ScrollAnimations();
  }
  if (typeof EnhancedNavbar !== "undefined") {
    new EnhancedNavbar();
  }
  setupPropertyFinderAnimations();
});

/**
 * Enhanced navbar
 */
class EnhancedNavbar {
  constructor() {
    this.navbar = document.querySelector(".navbar-modern");
    this.init();
  }

  init() {
    if (!this.navbar) return;

    const handleScroll = utils.throttle(() => {
      const scrolled = window.scrollY > 50;
      this.navbar.classList.toggle("scrolled", scrolled);

      if (scrolled) {
        this.navbar.style.backgroundColor = "rgba(255, 255, 255, 0.95)";
        this.navbar.style.backdropFilter = "blur(20px)";
        this.navbar.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
      } else {
        this.navbar.style.backgroundColor = "rgba(255, 255, 255, 1)";
        this.navbar.style.backdropFilter = "none";
        this.navbar.style.boxShadow = "none";
      }
    }, 16);

    window.addEventListener("scroll", handleScroll);
  }
}

/**
 * Setup hot selling projects carousel
 */
function setupHotProjectsCarousel() {
  const carousel = document.querySelector(".hot-projects-carousel");
  if (!carousel) return;

  const container = carousel.querySelector(".projects-container");
  const prevBtn = carousel.querySelector(".carousel-prev");
  const nextBtn = carousel.querySelector(".carousel-next");
  const cards = container.querySelectorAll(".project-card");

  if (!container || !prevBtn || !nextBtn || cards.length === 0) return;

  let currentIndex = 0;
  const cardWidth = 320 + 16; // card width + gap

  function getVisibleCards() {
    const containerWidth = container.parentElement.offsetWidth;
    const cardWidthWithGap = 320 + 16;
    const visibleCards = Math.floor(containerWidth / cardWidthWithGap);
    return Math.max(1, Math.min(visibleCards, cards.length));
  }

  function getMaxIndex() {
    const visibleCards = getVisibleCards();
    return Math.max(0, cards.length - visibleCards);
  }

  function updateCarousel() {
    const translateX = -currentIndex * cardWidth;
    container.style.transform = `translateX(${translateX}px)`;

    const maxIndex = getMaxIndex();

    prevBtn.style.opacity = currentIndex === 0 ? "0.5" : "1";
    nextBtn.style.opacity = currentIndex >= maxIndex ? "0.5" : "1";
    prevBtn.style.pointerEvents = currentIndex === 0 ? "none" : "auto";
    nextBtn.style.pointerEvents = currentIndex >= maxIndex ? "none" : "auto";
  }

  prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });

  nextBtn.addEventListener("click", () => {
    const maxIndex = getMaxIndex();
    if (currentIndex < maxIndex) {
      currentIndex++;
      updateCarousel();
    }
  });

  // Touch/swipe support
  let startX = 0;
  let isDragging = false;

  container.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  });

  container.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    e.preventDefault();
  });

  container.addEventListener("touchend", (e) => {
    if (!isDragging) return;

    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    const maxIndex = getMaxIndex();

    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < maxIndex) {
        currentIndex++;
      } else if (diff < 0 && currentIndex > 0) {
        currentIndex--;
      }
      updateCarousel();
    }

    isDragging = false;
  });

  updateCarousel();

  const totalWidth = cards.length * cardWidth;
  container.style.width = `${totalWidth}px`;

  window.addEventListener(
    "resize",
    utils.debounce(() => {
      const newMaxIndex = getMaxIndex();
      if (currentIndex > newMaxIndex) {
        currentIndex = newMaxIndex;
      }
      updateCarousel();
    }, 250)
  );
}

/**
 * Setup property finder animations
 */
function setupPropertyFinderAnimations() {
  const propertyCard = document.querySelector(".property-finder-card");
  if (propertyCard) {
    const formFields = propertyCard.querySelectorAll(".search-field");
    formFields.forEach((field, index) => {
      field.style.opacity = "0";
      field.style.transform = "translateY(15px)";
      field.style.transition = "all 0.5s ease-out";

      setTimeout(() => {
        field.style.opacity = "1";
        field.style.transform = "translateY(0)";
      }, index * 100 + 300);
    });
  }

  setTimeout(() => {
    setupHotProjectsCarousel();
  }, 100);
}

/**
 * Initialize services page functionality
 */
function initializeServicesPage() {
  if (!document.querySelector(".services-hero")) return;

  setupServicesAnimations();
  setupServicesContactForm();
  setupServiceNavigation();
}

/**
 * Setup services page animations
 */
function setupServicesAnimations() {
  const serviceCards = document.querySelectorAll(".service-card");
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -30px 0px",
  };

  const serviceObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }, index * 100); // Faster stagger for hero cards
      }
    });
  }, observerOptions);

  serviceCards.forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    card.style.transition = "all 0.6s ease-out";
    serviceObserver.observe(card);
  });

  // Animate process steps with enhanced timing
  const processSteps = document.querySelectorAll(".process-step");
  processSteps.forEach((step, index) => {
    step.style.opacity = "0";
    step.style.transform = "translateY(30px)";
    step.style.transition = "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)";

    const processObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }, index * 150); // Slightly faster for better flow
        }
      });
    }, observerOptions);

    processObserver.observe(step);
  });
}

/**
 * Setup services contact form functionality
 */
function setupServicesContactForm() {
  const form = document.getElementById("servicesContactForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Validate form
    if (!form.checkValidity()) {
      e.stopPropagation();
      form.classList.add("was-validated");
      return;
    }

    // Get form data
    const formData = {
      firstName: document.getElementById("firstName")?.value,
      lastName: document.getElementById("lastName")?.value,
      email: document.getElementById("email")?.value,
      service: document.getElementById("service")?.value,
      message: document.getElementById("message")?.value,
    };

    // Simulate form submission
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    submitBtn.disabled = true;
    submitBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';

    setTimeout(() => {
      // Reset form
      form.reset();
      form.classList.remove("was-validated");

      // Show success message
      submitBtn.innerHTML = '<i class="fas fa-check me-2"></i>Message Sent!';
      submitBtn.classList.remove("btn-primary");
      submitBtn.classList.add("btn-success");

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        submitBtn.classList.remove("btn-success");
        submitBtn.classList.add("btn-primary");
      }, 3000);

      console.log("Services form submitted:", formData);
    }, 2000);
  });
}

/**
 * Setup service navigation and smooth scrolling
 */
function setupServiceNavigation() {
  // Smooth scroll for service links
  const serviceLinks = document.querySelectorAll('a[href^="#"]');

  serviceLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      if (href.startsWith("#") && href !== "#") {
        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
          const offsetTop = target.offsetTop - 80; // Account for fixed navbar

          window.scrollTo({
            top: offsetTop,
            behavior: "smooth",
          });
        }
      }
    });
  });

  // Highlight active service section
  const sections = document.querySelectorAll("section[id]");

  const handleScroll = utils.throttle(() => {
    const scrollPos = window.scrollY + 150;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        // Remove active class from all service cards
        document.querySelectorAll(".service-card").forEach((card) => {
          card.classList.remove("active");
        });

        // Add active class to corresponding service card
        const serviceCard = document
          .querySelector(`a[href="#${sectionId}"]`)
          ?.closest(".service-card");
        if (serviceCard) {
          serviceCard.classList.add("active");
        }
      }
    });
  }, 100);

  window.addEventListener("scroll", handleScroll);
}

/**
 * Navigation functionality
 */
function setupNavigation() {
  const navbar = document.querySelector(".navbar");
  const navLinks = document.querySelectorAll(".nav-link");
  const hashLinks = document.querySelectorAll('a[href^="#"]');

  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
      navbar.style.backgroundColor = "rgba(255, 255, 255, 0.95)";
      navbar.style.backdropFilter = "blur(10px)";
    } else {
      navbar.classList.remove("scrolled");
      navbar.style.backgroundColor = "";
      navbar.style.backdropFilter = "";
    }
  });

  // Enhanced smooth scrolling for all hash links (including hero button)
  hashLinks.forEach((link) => {
    // Debug: Log all hash links
    console.log("Found hash link:", link.href, link.classList);

    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      // Skip dropdown toggles
      if (this.classList.contains("dropdown-toggle")) {
        console.log("Skipping dropdown toggle:", this.textContent);
        return;
      }

      console.log("Processing hash link:", href);

      if (href.startsWith("#") && href !== "#") {
        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
          const offsetTop = target.offsetTop - 80;

          window.scrollTo({
            top: offsetTop,
            behavior: "smooth",
          });

          const navbarCollapse = document.querySelector(".navbar-collapse");
          if (navbarCollapse && navbarCollapse.classList.contains("show")) {
            bootstrap.Collapse.getInstance(navbarCollapse).hide();
          }
        }
      }
    });
  });

  window.addEventListener("scroll", updateActiveNavLink);
}

/**
 * Update active navigation link
 */
function updateActiveNavLink() {
  // Skip auto-updating nav links on property page
  if (document.querySelector(".property-page")) {
    return;
  }

  const sections = document.querySelectorAll("section[id]");
  const scrollPos = window.scrollY + 100;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute("id");
    const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

    if (navLink) {
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        document.querySelectorAll(".nav-link").forEach((link) => {
          link.classList.remove("active");
        });
        navLink.classList.add("active");
      }
    }
  });
}

/**
 * Setup property scroll effects
 */
function setupPropertyScrollEffects() {
  const cardDiv = document.createElement("div");
  cardDiv.className = "col-lg-4 col-md-6 mb-4";

  cardDiv.innerHTML = `
        <div class="card property-card h-100">
            <div class="property-image">
                <img src="${property.image}" 
                     alt="${property.title}" 
                     class="card-img-top"
                     loading="lazy">
                <div class="property-badge">
                    <span class="badge bg-accent">${property.type}</span>
                </div>
                <div class="property-overlay">
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="badge bg-white text-dark">
                            <i class="fas fa-bed me-1"></i>${
                              property.bedrooms
                            } Beds
                        </span>
                        <span class="badge bg-white text-dark">
                            <i class="fas fa-bath me-1"></i>${
                              property.bathrooms
                            } Baths
                        </span>
                        <span class="badge bg-white text-dark">
                            <i class="fas fa-ruler me-1"></i>${property.area}
                        </span>
                    </div>
                </div>
            </div>
            <div class="card-body p-4">
                <h5 class="card-title fw-bold mb-2">${property.title}</h5>
                <p class="text-muted mb-2">
                    <i class="fas fa-map-marker-alt me-2"></i>${
                      property.location
                    }
                </p>
                <div class="property-price mb-3">${property.price}</div>
                <div class="property-features mb-3">
                    ${property.features
                      .map(
                        (feature) =>
                          `<span class="badge bg-light text-dark me-1 mb-1">
                            <i class="fas fa-check text-accent me-1"></i>${feature}
                        </span>`
                      )
                      .join("")}
                </div>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary flex-fill" onclick="viewProperty(${
                      property.id
                    })">
                        View Details
                    </button>
                    <button class="btn btn-outline-primary" onclick="scheduleViewing(${
                      property.id
                    })" aria-label="Schedule viewing for ${property.title}">
                        <i class="fas fa-calendar-alt"></i>
                    </button>
                </div>
            </div>
        </div>
    `;

  return cardDiv;
}

/**
 * Property card intersection observer
 */
function observePropertyCards() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -30px 0px",
    }
  );

  document.querySelectorAll(".property-card").forEach((card, index) => {
    card.parentElement.style.opacity = "0";
    card.parentElement.style.transform = "translateY(20px)";
    card.parentElement.style.transition = `all 0.5s ease-out ${index * 0.1}s`;
    observer.observe(card.parentElement);
  });
}

/**
 * Simple property interaction functions
 */
function viewProperty(propertyId) {
  // Redirect to dasnac.html for Manhattan Penthouse (ID 1)
  if (propertyId === 1) {
    window.location.href = "dasnac.html";
    return;
  }

  showNotification(
    `Property #${propertyId} details available. Our team will contact you with comprehensive information.`,
    "success"
  );

  console.log(`Viewing property ${propertyId}`);

  setTimeout(() => {
    const contactSection = document.querySelector("#contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  }, 1500);
}

function scheduleViewing(propertyId) {
  showNotification(
    `Viewing request submitted for Property #${propertyId}. Our representative will contact you within 24 hours.`,
    "success"
  );

  console.log(`Viewing scheduled for property ${propertyId}`);

  setTimeout(() => {
    const contactSection = document.querySelector("#contact");
    const message = document.querySelector("#message");

    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }

    if (message) {
      message.value = `I would like to schedule a viewing for Property ID: ${propertyId}. Please contact me with available times.`;
    }
  }, 1500);
}

/**
 * Contact form setup
 */
function setupContactForm() {
  const contactForm = document.getElementById("contactForm");
  if (!contactForm) return;

  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const btnText = submitBtn.querySelector(".btn-text");
  const btnLoading = submitBtn.querySelector(".btn-loading");

  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    this.classList.remove("was-validated");

    if (!this.checkValidity()) {
      this.classList.add("was-validated");
      return;
    }

    submitBtn.disabled = true;
    if (btnText) btnText.classList.add("d-none");
    if (btnLoading) btnLoading.classList.remove("d-none");

    try {
      await simulateFormSubmission();

      showNotification(
        "Thank you! Your message has been sent successfully. We'll contact you within 24 hours.",
        "success"
      );

      this.reset();
      this.classList.remove("was-validated");
    } catch (error) {
      showNotification(
        "Sorry, there was an error sending your message. Please try again.",
        "error"
      );
    } finally {
      submitBtn.disabled = false;
      if (btnText) btnText.classList.remove("d-none");
      if (btnLoading) btnLoading.classList.add("d-none");
    }
  });

  const inputs = contactForm.querySelectorAll("input, select, textarea");
  inputs.forEach((input) => {
    input.addEventListener("blur", function () {
      validateField(this);
    });

    input.addEventListener("input", function () {
      if (this.classList.contains("is-invalid")) {
        validateField(this);
      }
    });
  });
}

/**
 * Validate form field
 */
function validateField(field) {
  const isValid = field.checkValidity();

  if (isValid) {
    field.classList.remove("is-invalid");
    field.classList.add("is-valid");
  } else {
    field.classList.remove("is-valid");
    field.classList.add("is-invalid");
  }

  return isValid;
}

/**
 * Simulate form submission
 */
function simulateFormSubmission() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.05) {
        resolve();
      } else {
        reject(new Error("Submission failed"));
      }
    }, 2000);
  });
}

/**
 * Newsletter form setup
 */
function setupNewsletterForm() {
  const newsletterForm = document.querySelector(".newsletter-form");

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = this.querySelector('input[type="email"]').value;

      if (email && isValidEmail(email)) {
        showNotification(
          "Thank you for subscribing to our newsletter!",
          "success"
        );
        this.reset();
      } else {
        showNotification("Please enter a valid email address.", "error");
      }
    });
  }
}

/**
 * Email validation
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Show notification
 */
function showNotification(message, type = "info") {
  const existingNotifications = document.querySelectorAll(".notification");
  existingNotifications.forEach((notification) => notification.remove());

  const notification = document.createElement("div");
  notification.className = `notification alert alert-${
    type === "error" ? "danger" : type
  } alert-dismissible position-fixed`;
  notification.style.cssText = `
        top: 100px;
        right: 20px;
        z-index: 1050;
        min-width: 300px;
        animation: slideInRight 0.3s ease-out;
    `;

  notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

  document.body.appendChild(notification);

  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.animation = "slideOutRight 0.3s ease-in";
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}

/**
 * Lazy loading for images
 */
function setupLazyLoading() {
  const images = document.querySelectorAll('img[loading="lazy"]');

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.remove("lazy");
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));
  }
}

/**
 * Enhanced UI/UX interactions for elegant experience
 */
class ElegantInteractions {
  constructor() {
    this.init();
  }

  init() {
    this.setupSmoothAnimations();
    this.setupElegantHovers();
    this.setupFormEnhancements();
    this.setupScrollEffects();
    this.setupPageTransitions();
  }

  setupSmoothAnimations() {
    // Add entrance animations to cards
    const cards = document.querySelectorAll(
      ".card, .service-card, .property-card"
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.style.opacity = "1";
              entry.target.style.transform = "translateY(0)";
            }, index * 100);
          }
        });
      },
      { threshold: 0.1 }
    );

    cards.forEach((card) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(20px)";
      card.style.transition = "all 0.6s ease-out";
      observer.observe(card);
    });
  }

  setupElegantHovers() {
    // Enhanced button ripple effects
    const buttons = document.querySelectorAll(".btn");

    buttons.forEach((button) => {
      button.addEventListener("mouseenter", function (e) {
        this.style.transform = "translateY(-2px)";
      });

      button.addEventListener("mouseleave", function (e) {
        this.style.transform = "translateY(0)";
      });
    });

    // Elegant card interactions
    const interactiveCards = document.querySelectorAll(
      ".property-card, .service-card, .testimonial-card"
    );

    interactiveCards.forEach((card) => {
      card.addEventListener("mouseenter", function () {
        this.style.transform = "translateY(-8px) scale(1.02)";
      });

      card.addEventListener("mouseleave", function () {
        this.style.transform = "translateY(0) scale(1)";
      });
    });
  }

  setupFormEnhancements() {
    // Elegant form field animations
    const formFields = document.querySelectorAll(".form-control, .form-select");

    formFields.forEach((field) => {
      field.addEventListener("focus", function () {
        this.parentElement.style.transform = "translateY(-2px)";
        this.style.boxShadow = "0 8px 25px rgba(30, 58, 138, 0.15)";
      });

      field.addEventListener("blur", function () {
        this.parentElement.style.transform = "translateY(0)";
        this.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.05)";
      });
    });

    // Enhanced form validation feedback
    const forms = document.querySelectorAll("form");

    forms.forEach((form) => {
      const inputs = form.querySelectorAll("input, select, textarea");

      inputs.forEach((input) => {
        input.addEventListener("input", function () {
          if (this.checkValidity()) {
            this.classList.remove("is-invalid");
            this.classList.add("is-valid");
          }
        });
      });
    });
  }

  setupScrollEffects() {
    // Elegant scroll-based animations
    let ticking = false;

    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.pageYOffset;

          // Parallax effect for hero images
          const heroImages = document.querySelectorAll(
            ".hero-background, .services-hero"
          );
          heroImages.forEach((img) => {
            img.style.transform = `translateY(${scrolled * 0.3}px)`;
          });

          // Floating effect for certain elements
          const floatingElements =
            document.querySelectorAll(".floating-element");
          floatingElements.forEach((element, index) => {
            const speed = 0.5 + index * 0.1;
            element.style.transform = `translateY(${
              Math.sin(scrolled * 0.01 + index) * 10
            }px)`;
          });

          ticking = false;
        });
        ticking = true;
      }
    });
  }

  setupPageTransitions() {
    // Smooth page transitions
    // document.body.classList.add("page-enter"); - Removed as unused

    // Enhanced link transitions
    const internalLinks = document.querySelectorAll('a[href^="#"]');

    internalLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));

        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
  }

  // Elegant notification system
  static showElegantNotification(message, type = "info", duration = 5000) {
    const notification = document.createElement("div");
    notification.className = `alert alert-${type} position-fixed animate-fade-in-down`;
    notification.style.cssText = `
      top: 20px;
      right: 20px;
      z-index: 1050;
      min-width: 300px;
      max-width: 400px;
      animation: slideInRight 0.5s ease-out;
      backdrop-filter: blur(10px);
    `;

    notification.innerHTML = `
      <div class="d-flex align-items-center">
        <i class="fas fa-${
          type === "success"
            ? "check-circle"
            : type === "error"
            ? "exclamation-triangle"
            : "info-circle"
        } me-2"></i>
        <span>${message}</span>
        <button type="button" class="btn-close ms-auto" onclick="this.parentElement.parentElement.remove()"></button>
      </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      if (notification.parentElement) {
        notification.style.animation = "slideOutRight 0.3s ease-in";
        setTimeout(() => notification.remove(), 300);
      }
    }, duration);
  }
}

/**
 * Investment opportunity tracking
 */
function setupInvestmentTracking() {
  const investmentSection = document.querySelector(".bg-accent");
  const investmentButton = document.querySelector(".bg-accent .btn-primary");

  if (investmentButton) {
    investmentButton.addEventListener("click", function (e) {
      e.preventDefault();

      showNotification(
        "Investment consultation request received. Our team will contact you within 2 hours.",
        "success"
      );

      setTimeout(() => {
        const contactSection = document.querySelector("#contact");
        const investmentRange = document.querySelector("#investmentRange");
        const message = document.querySelector("#message");

        if (contactSection) {
          contactSection.scrollIntoView({ behavior: "smooth" });
        }

        if (investmentRange) {
          investmentRange.value = "10m+";
        }

        if (message) {
          message.value =
            "I am interested in the Assured Exit Option investment opportunity. Please provide more details about the ₹50 Lakhs investment with 1-year exit strategy.";
        }
      }, 1000);
    });
  }
}

/**
 * Property filtering functionality
 */
function setupPropertyFiltering() {
  const searchForm = document.getElementById("propertySearchForm");
  const propertyCards = document.querySelectorAll("#properties-grid .col-lg-6");

  if (!searchForm) return;

  // Add event listener to the form
  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    filterProperties();
  });

  // Also filter when form inputs change
  const formInputs = searchForm.querySelectorAll("input, select");
  formInputs.forEach((input) => {
    input.addEventListener("change", filterProperties);
  });
}

/**
 * Filter properties based on form inputs
 */
function filterProperties() {
  const propertyCategory = document.getElementById("propertyCategory")?.value;
  const propertyType = document.getElementById("propertyType")?.value;
  const budget = document.getElementById("budget")?.value;
  const bhk = document.getElementById("bhk")?.value;
  const location = document.getElementById("location")?.value.toLowerCase();
  const possession = document.getElementById("possession")?.value;
  const amenities = document.getElementById("amenities")?.value;

  const propertyCards = document.querySelectorAll("#properties-grid .col-lg-6");
  let visibleCount = 0;

  propertyCards.forEach((card) => {
    let showProperty = true;

    // Filter by property type
    if (propertyType && showProperty) {
      const cardPropertyType = card.dataset.propertyType;
      if (cardPropertyType && !cardPropertyType.includes(propertyType)) {
        showProperty = false;
      }
    }

    // Filter by category
    if (propertyCategory && showProperty) {
      const cardCategory = card.dataset.propertyCategory;
      if (cardCategory && !cardCategory.includes(propertyCategory)) {
        showProperty = false;
      }
    }

    // Filter by budget
    if (budget && showProperty) {
      const cardPriceRange = card.dataset.priceRange;
      if (cardPriceRange) {
        const budgetMatch = checkBudgetMatch(budget, cardPriceRange);
        if (!budgetMatch) {
          showProperty = false;
        }
      }
    }

    // Filter by BHK
    if (bhk && showProperty) {
      const cardBhk = card.dataset.bhk;
      if (cardBhk) {
        const bhkMatch = checkBhkMatch(bhk, cardBhk);
        if (!bhkMatch) {
          showProperty = false;
        }
      }
    }

    // Filter by location
    if (location && showProperty) {
      const cardLocation = card
        .querySelector(".text-muted")
        ?.textContent.toLowerCase();
      if (cardLocation && !cardLocation.includes(location)) {
        showProperty = false;
      }
    }

    // Filter by possession status
    if (possession && showProperty) {
      const cardStatus = card.dataset.status;
      if (cardStatus && cardStatus !== possession) {
        showProperty = false;
      }
    }

    // Filter by amenities
    if (amenities && showProperty) {
      const cardAmenities = card.dataset.amenities;
      if (cardAmenities) {
        const amenitiesMatch = checkAmenitiesMatch(amenities, cardAmenities);
        if (!amenitiesMatch) {
          showProperty = false;
        }
      }
    }

    // Show or hide the property card
    card.style.display = showProperty ? "block" : "none";
    if (showProperty) visibleCount++;
  });

  // Update filter results info
  updateFilterResultsInfo(visibleCount);
}

/**
 * Update filter results information
 */
function updateFilterResultsInfo(visibleCount) {
  const resultsInfo = document.getElementById("filter-results-info");
  const resultsCount = document.getElementById("results-count");
  const activeFilters = document.getElementById("active-filters");
  const clearFiltersBtn = document.getElementById("clear-filters");

  if (resultsInfo && resultsCount) {
    resultsCount.textContent = visibleCount;
    resultsInfo.classList.remove("d-none");

    // Show/hide clear filters button
    if (clearFiltersBtn) {
      const hasActiveFilters = hasFiltersApplied();
      clearFiltersBtn.classList.toggle("d-none", !hasActiveFilters);
    }

    // Update active filters text
    if (activeFilters) {
      const filters = getActiveFilters();
      if (filters.length > 0) {
        activeFilters.textContent = `(${filters.join(", ")})`;
      } else {
        activeFilters.textContent = "";
      }
    }
  }
}

/**
 * Check if any filters are currently applied
 */
function hasFiltersApplied() {
  const propertyType = document.getElementById("propertyType")?.value;
  const budget = document.getElementById("budget")?.value;
  const bhk = document.getElementById("bhk")?.value;
  const location = document.getElementById("location")?.value;
  const possession = document.getElementById("possession")?.value;
  const amenities = document.getElementById("amenities")?.value;

  return !!(
    propertyType ||
    budget ||
    bhk ||
    location ||
    possession ||
    amenities
  );
}

/**
 * Get list of active filters for display
 */
function getActiveFilters() {
  const filters = [];

  const propertyType = document.getElementById("propertyType")?.value;
  const budget = document.getElementById("budget")?.value;
  const bhk = document.getElementById("bhk")?.value;
  const location = document.getElementById("location")?.value;
  const possession = document.getElementById("possession")?.value;
  const amenities = document.getElementById("amenities")?.value;

  if (propertyType) filters.push(`Type: ${propertyType}`);
  if (budget) filters.push(`Budget: ${getBudgetLabel(budget)}`);
  if (bhk) filters.push(`BHK: ${bhk}`);
  if (location) filters.push(`Location: ${location}`);
  if (possession) filters.push(`Status: ${possession}`);
  if (amenities) filters.push(`Amenities: ${getAmenityLabel(amenities)}`);

  return filters;
}

/**
 * Get budget label for display
 */
function getBudgetLabel(budgetValue) {
  const budgetLabels = {
    "50-100": "₹50L - ₹1Cr",
    "100-250": "₹1Cr - ₹2.5Cr",
    "250-500": "₹2.5Cr - ₹5Cr",
    "500-1000": "₹5Cr - ₹10Cr",
    "1000+": "₹10Cr+",
  };

  return budgetLabels[budgetValue] || budgetValue;
}

/**
 * Get amenity label for display
 */
function getAmenityLabel(amenityValue) {
  const amenityLabels = {
    pool: "Swimming Pool",
    gym: "Gymnasium",
    club: "Clubhouse",
    security: "24/7 Security",
    ev: "EV Charging",
  };

  return amenityLabels[amenityValue] || amenityValue;
}

// Add event listener for clear filters button
document.addEventListener("DOMContentLoaded", function () {
  const clearFiltersBtn = document.getElementById("clear-filters");
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener("click", clearAllFilters);
  }
});

/**
 * Clear all filters
 */
function clearAllFilters() {
  // Reset all form inputs
  const formInputs = document.querySelectorAll(
    "#propertySearchForm input, #propertySearchForm select"
  );
  formInputs.forEach((input) => {
    if (input.type === "select-one") {
      input.selectedIndex = 0;
    } else {
      input.value = "";
    }
  });

  // Trigger filter update
  filterProperties();
}

/**
 * Check if budget matches property price range
 */
function checkBudgetMatch(budget, priceRange) {
  // Convert budget value to price range format for comparison
  switch (budget) {
    case "50-100":
      return priceRange === "50l" || priceRange === "1cr";
    case "100-250":
      return priceRange === "1cr" || priceRange === "2.5cr";
    case "250-500":
      return priceRange === "2.5cr" || priceRange === "5cr";
    case "500-1000":
      return priceRange === "5cr" || priceRange === "10cr";
    case "1000+":
      return priceRange === "10cr" || priceRange === "on-request";
    default:
      return true;
  }
}

/**
 * Check if BHK matches property BHK options
 */
function checkBhkMatch(bhk, cardBhk) {
  if (!cardBhk) return true;

  // Split cardBhk into individual options
  const bhkOptions = cardBhk.split(",");

  // Handle special cases
  if (bhk === "5+") {
    // Check if any BHK option is 5 or higher
    return bhkOptions.some((option) => {
      const num = parseInt(option);
      return !isNaN(num) && num >= 5;
    });
  }

  // Check if the selected BHK is in the options
  return bhkOptions.includes(bhk);
}

/**
 * Check if amenities match property amenities
 */
function checkAmenitiesMatch(amenity, cardAmenities) {
  if (!cardAmenities) return true;

  // Split cardAmenities into individual options
  const amenityOptions = cardAmenities.split(",");

  // Map form values to data attributes
  const amenityMap = {
    pool: "pool",
    gym: "gym",
    club: "club",
    security: "security",
    solar: "solar",
  };

  const mappedAmenity = amenityMap[amenity] || amenity;

  return amenityOptions.includes(mappedAmenity);
}

/**
 * Redirect to properties page with applied filters
 */
function redirectToFilteredProperties() {
  const propertyType = document.getElementById("propertyType")?.value;
  const budget = document.getElementById("budget")?.value;
  const bhk = document.getElementById("bhk")?.value;
  const location = document.getElementById("location")?.value;
  const possession = document.getElementById("possession")?.value;
  const amenities = document.getElementById("amenities")?.value;

  // Build query string
  const params = new URLSearchParams();
  if (propertyType) params.append("type", propertyType);
  if (budget) params.append("budget", budget);
  if (bhk) params.append("bhk", bhk);
  if (location) params.append("location", location);
  if (possession) params.append("status", possession);
  if (amenities) params.append("amenities", amenities);

  // Redirect to properties page with filters
  window.location.href = `properties.html?${params.toString()}`;
}

// Add property filtering to index page
document.addEventListener("DOMContentLoaded", function () {
  // Check if we're on the index page
  if (document.querySelector(".property-finder-section")) {
    const searchForm = document.getElementById("propertySearchForm");

    if (searchForm) {
      // Add event listener to the form
      searchForm.addEventListener("submit", function (e) {
        e.preventDefault();
        // For index page, redirect to properties page with filters
        redirectToFilteredProperties();
      });
    }
  }

  // Check if we're on the properties page and apply any filters from URL
  if (window.location.pathname.includes("properties.html")) {
    applyUrlFilters();
  }
});

/**
 * Apply filters from URL parameters
 */
function applyUrlFilters() {
  const urlParams = new URLSearchParams(window.location.search);

  // Get filter values from URL
  const propertyType = urlParams.get("type");
  const budget = urlParams.get("budget");
  const bhk = urlParams.get("bhk");
  const location = urlParams.get("location");
  const possession = urlParams.get("status");
  const amenities = urlParams.get("amenities");

  // Set form values
  if (propertyType)
    document.getElementById("propertyType").value = propertyType;
  if (budget) document.getElementById("budget").value = budget;
  if (bhk) document.getElementById("bhk").value = bhk;
  if (location) document.getElementById("location").value = location;
  if (possession) document.getElementById("possession").value = possession;
  if (amenities) document.getElementById("amenities").value = amenities;

  // Apply filters
  setTimeout(filterProperties, 100);
}

// Add to the DOMContentLoaded event
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM Loaded - Starting initialization...");

  // Debug: Check if Bootstrap is loaded
  if (typeof bootstrap !== "undefined") {
    console.log("Bootstrap is loaded");
  } else {
    console.error("Bootstrap is NOT loaded!");
  }

  // Initialize website features
  initializeWebsite();
  initializeServicesPage();
  setupPropertyFiltering();

  // Initialize subtle features - only if classes are defined
  if (typeof ScrollAnimations !== "undefined") {
    new ScrollAnimations();
  }
  if (typeof EnhancedNavbar !== "undefined") {
    new EnhancedNavbar();
  }
  setupPropertyFinderAnimations();
});

// Add CSS animations
function addAnimationStyles() {
  const style = document.createElement("style");
  style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
  document.head.appendChild(style);
}

addAnimationStyles();

// Error handling for failed image loads
document.addEventListener(
  "error",
  function (e) {
    if (e.target.tagName === "IMG") {
      e.target.src =
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTVlN2ViIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIE5vdCBBdmFpbGFibGU8L3RleHQ+PC9zdmc+";
      e.target.alt = "Image not available";
    }
  },
  true
);


// --- Auto-generated ROI Compare Modal Logic ---
const aroraaProjects = [
  {
    "id": "palace-residences.html",
    "title": "PALACE RESIDENCES",
    "region": "Dubai",
    "location": "Dubai Creek Harbour, Dubai"
  },
  {
    "id": "do-hotels-residences.html",
    "title": "DO HOTELS & RESIDENCES DUBAI ISLANDS",
    "region": "Dubai",
    "location": "Dubai Islands, Dubai"
  },
  {
    "id": "nuve-zoya.html",
    "title": "NUV\u00c9 by Zoya Luxury Residences in DLRC",
    "region": "Dubai",
    "location": "Dubai Land Residence Complex (DLRC)"
  },
  {
    "id": "monaco-mansions.html",
    "title": "MONACO MANSIONS AT AZIZI VENICE",
    "region": "Dubai",
    "location": "Dubai South, Dubai"
  },
  {
    "id": "one-residence.html",
    "title": "ONE RESIDENCE",
    "region": "Dubai",
    "location": "Al Reem Island, Abu Dhabi"
  },
  {
    "id": "mangrove.html",
    "title": "MANGROVE",
    "region": "Dubai",
    "location": "Creek Beach, Dubai Creek Harbour"
  },
  {
    "id": "samana-business-hub.html",
    "title": "SAMANA BUSINESS HUB",
    "region": "Dubai",
    "location": "Downtown Jebel Ali, Dubai"
  },
  {
    "id": "samana-boulevard-heights.html",
    "title": "SAMANA BOULEVARD HEIGHTS",
    "region": "Dubai",
    "location": "Dubai Residence Complex, Dubailand"
  },
  {
    "id": "taj-wellington-mews.html",
    "title": "TAJ WELLINGTON MEWS",
    "region": "Dubai",
    "location": "Al Marjan Island, Ras Al Khaimah"
  },
  {
    "id": "valia.html",
    "title": "VALIA",
    "region": "Dubai",
    "location": "Dubai Creek Harbour, Dubai"
  },
  {
    "id": "sobha-sanctuary.html",
    "title": "SOBHA SANCTUARY",
    "region": "Dubai",
    "location": "Dubai, UAE"
  },
  {
    "id": "ramada-residences.html",
    "title": "RAMADA RESIDENCES",
    "region": "Dubai",
    "location": "Al Jaddaf, Dubai"
  },
  {
    "id": "cedar.html",
    "title": "CEDAR",
    "region": "Dubai",
    "location": "Creek Beach, Dubai Creek Harbour"
  },
  {
    "id": "sobha-hartland-2.html",
    "title": "SOBHA HARTLAND II",
    "region": "Dubai",
    "location": "Nad Al Sheba, Dubai"
  },
  {
    "id": "parkway.html",
    "title": "PARKWAY",
    "region": "Dubai",
    "location": "MBR City, Dubai"
  },
  {
    "id": "azizi-venice.html",
    "title": "AZIZI VENICE",
    "region": "Dubai",
    "location": "Dubai South, Dubai"
  },
  {
    "id": "creek-waters-2.html",
    "title": "CREEK WATERS 2",
    "region": "Dubai",
    "location": "Creek Island, Dubai Creek Harbour"
  },
  {
    "id": "samana-greenfield.html",
    "title": "SAMANA GREENFIELD",
    "region": "Dubai",
    "location": "Al Warsan, Dubai"
  },
  {
    "id": "montiva-by-vida.html",
    "title": "MONTIVA BY VIDA",
    "region": "Dubai",
    "location": "Green Gate District, Dubai Creek Harbour"
  },
  {
    "id": "hilton-residences.html",
    "title": "HILTON RESIDENCES DUBAI MARITIME CITY",
    "region": "Dubai",
    "location": "Dubai Maritime City, Dubai"
  },
  {
    "id": "dubai-hills-vista.html",
    "title": "DUBAI HILLS VISTA",
    "region": "Dubai",
    "location": "Dubai Hills Estate, Dubai"
  },
  {
    "id": "laguna-residence.html",
    "title": "LAGUNA RESIDENCE",
    "region": "Dubai",
    "location": "Dubai Land, Dubai"
  },
  {
    "id": "fauchon-residences.html",
    "title": "FAUCHON R\u00c9SIDENCES",
    "region": "Dubai",
    "location": "Jumeirah Garden City, Dubai"
  },
  {
    "id": "the-archive-by-imtiaz.html",
    "title": "THE ARCHIVE",
    "region": "Dubai",
    "location": "DLRC, Dubai Residence Complex, Dubai"
  },
  {
    "id": "calisi-zoya.html",
    "title": "Calisi by Zoya Fully Furnished Residences",
    "region": "Dubai",
    "location": "Dubai South"
  },
  {
    "id": "mercedes-benz-places.html",
    "title": "MERCEDES-BENZ PLACES BINGHATTI CITY",
    "region": "Dubai",
    "location": "Nad Al Sheba, Dubai"
  },
  {
    "id": "aspirz-danube.html",
    "title": "Aspirz by Danube Fully Furnished Residences",
    "region": "Dubai",
    "location": "Dubai Sports City"
  },
  {
    "id": "serenz-danube.html",
    "title": "Serenz by Danube A World of Amenities in JVC",
    "region": "Dubai",
    "location": "Jumeirah Village Circle (JVC), Dubai"
  },
  {
    "id": "sobha-city-abu-dhabi.html",
    "title": "SOBHA CITY ABU DHABI",
    "region": "Dubai",
    "location": "Abu Dhabi"
  },
  {
    "id": "sobha-aquacrest.html",
    "title": "SOBHA AQUACREST",
    "region": "Dubai",
    "location": "Downtown Umm Al Quwain"
  },
  {
    "id": "orla-infinity.html",
    "title": "ORLA INFINITY",
    "region": "Dubai",
    "location": "Crescent of Palm Jumeirah, Dubai"
  },
  {
    "id": "palm-jebel-ali.html",
    "title": "Palm Jebel Ali Ultra Luxury Waterfront Villas",
    "region": "Dubai",
    "location": "Dubai, UAE"
  },
  {
    "id": "burj-azizi.html",
    "title": "BURJ AZIZI",
    "region": "Dubai",
    "location": "Sheikh Zayed Road, Dubai"
  },
  {
    "id": "miorah-zoya.html",
    "title": "Miorah by Zoya Luxury Living in Dubai South",
    "region": "Dubai",
    "location": "Dubai South"
  },
  {
    "id": "tonino-lamborghini-residences.html",
    "title": "TONINO LAMBORGHINI RESIDENCES",
    "region": "Dubai",
    "location": "Al Marjan Island, Ras Al Khaimah"
  },
  {
    "id": "mira-villas.html",
    "title": "MIRA VILLAS DESIGNED BY BENTLEY HOME",
    "region": "Dubai",
    "location": "District 11, Mohammed Bin Rashid City (MBR City), Dubai"
  },
  {
    "id": "cybele.html",
    "title": "CYB\u00c8LE",
    "region": "Dubai",
    "location": "Dubai Land Residence Complex, Dubai"
  },
  {
    "id": "river-cove-sobha.html",
    "title": "River Cove Residences Ultra-Premium Waterfront Living",
    "region": "Dubai",
    "location": "Sobha City, Abu Dhabi"
  },
  {
    "id": "damac-islands.html",
    "title": "DAMAC Islands Ultra-Luxury Waterfront Villa Community",
    "region": "Dubai",
    "location": "Dubai, UAE"
  },
  {
    "id": "greenz-danube.html",
    "title": "Greenz by Danube Nature-Inspired Luxury Townhouses & Villas",
    "region": "Dubai",
    "location": "Dubai (Near Silicon Oasis)"
  },
  {
    "id": "raw-district-imtiaz.html",
    "title": "Raw District Imtiaz Dubai\u2019s Next-Generation Urban Lifestyle Destination",
    "region": "Dubai",
    "location": "Sheikh Zayed Road, Downtown Jebel Ali, Dubai, UAE"
  },
  {
    "id": "breez-danube.html",
    "title": "Breez by Danube Premium Waterfront Living",
    "region": "Dubai",
    "location": "Dubai Maritime City"
  },
  {
    "id": "lumena-alta.html",
    "title": "LUMENA ALTA",
    "region": "Dubai",
    "location": "Gateway of Business Bay, Dubai"
  },
  {
    "id": "pristine-zoya.html",
    "title": "PRISTINE by Zoya Luxury Residences in Al Furjan",
    "region": "Dubai",
    "location": "Al Furjan, Dubai"
  },
  {
    "id": "vida-residences-creek-beach.html",
    "title": "VIDA RESIDENCES CREEK BEACH",
    "region": "Dubai",
    "location": "Creek Beach, Dubai Creek Harbour"
  },
  {
    "id": "izel-zoya.html",
    "title": "IZEL by Zoya Designed for Life",
    "region": "Dubai",
    "location": "DubaiLand Residence Complex (DLRC)"
  },
  {
    "id": "kyomi-residences.html",
    "title": "KYOMI RESIDENCES",
    "region": "Dubai",
    "location": "Warsan Fourth, Dubai"
  },
  {
    "id": "radisson-blu-residences.html",
    "title": "RADISSON BLU RESIDENCES",
    "region": "Dubai",
    "location": "RAK Central, Ras Al Khaimah"
  },
  {
    "id": "elanora-zoya.html",
    "title": "\u00c9lanora by Zoya Fully Furnished Residences",
    "region": "Dubai",
    "location": "Dubai Industrial City"
  }
];

document.addEventListener("DOMContentLoaded", function() {
  const roiModal = document.getElementById('compareRoiModal');
  if (!roiModal) return;

  const modalBody = roiModal.querySelector('.modal-body');
  if (modalBody && !document.getElementById('roiCompareSelect')) {
    const modalDialog = roiModal.querySelector('.modal-dialog');
    if (modalDialog) modalDialog.classList.add('modal-lg');
    
    const projectName = document.title.split('|')[0].trim();
    
    let location = "";
    const locIcon = document.querySelector('.fa-map-marker-alt');
    if (locIcon && locIcon.parentElement && locIcon.parentElement.tagName === 'SPAN') {
        location = locIcon.parentElement.textContent.trim();
    }
    
    const currentProj = aroraaProjects.find(p => p.title === projectName) || { region: 'Dubai' };
    const region = currentProj.region;
    
    const regionalProjects = aroraaProjects.filter(p => p.region === region && p.title !== projectName);
    let optionsHtml = '<option value="">✓ Choose a project...</option>';
    regionalProjects.forEach(p => {
        optionsHtml += `<option value="${p.title}">${p.title}</option>`;
    });

    const newHtml = `
<button aria-label="Close" class="btn-close position-absolute top-0 end-0 m-3" data-bs-dismiss="modal" type="button"></button>
<div class="mb-3 d-inline-flex align-items-center justify-content-center rounded-circle" style="width:60px; height:60px; font-size:24px; color:#c9a55f; background: rgba(201,165,95,0.1);">
  <i class="fas fa-balance-scale"></i>
</div>
<h3 class="fw-bold mb-2" style="color: #333;">Compare Investment ROI</h3>
<p class="text-muted mb-4 px-2" style="font-size:0.95rem;">Select a property to compare with ${projectName} to find your perfect investment.</p>
<form class="text-start" id="compareRoiForm">
  <div class="row mb-4 gx-3">
    <div class="col-md-6 mb-3 mb-md-0">
       <div class="p-3 border rounded text-center h-100 d-flex flex-column justify-content-center" style="background: #fff; border-color: rgba(0,0,0,0.08) !important; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
         <div><span class="badge mb-2 px-3 py-1" style="background:#0b1c3c; color:#fff; font-size:0.75rem; font-weight:600; border-radius:12px;">Selected Property</span></div>
         <h5 class="fw-bold mb-1" style="color:#0b1c3c; font-size:1.1rem;">${projectName}</h5>
         <div class="text-muted small" style="font-size:0.8rem;">${location}</div>
       </div>
    </div>
    <div class="col-md-6">
       <div class="p-3 border rounded text-center h-100 d-flex flex-column justify-content-center" style="background: #fff; border: 2px dashed rgba(201,165,95,0.4) !important; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
         <label class="form-label fw-bold mb-2" style="font-size:0.85rem; color:#0b1c3c;">Compare With:</label>
         <select class="form-select form-select-sm shadow-none" name="compare_with" id="roiCompareSelect" required style="border-radius:8px; border:1px solid #c9a55f; font-size:0.9rem; padding:8px 12px; font-weight:500;">
           ${optionsHtml}
         </select>
       </div>
    </div>
  </div>
  <div class="row mb-4 gx-3">
    <div class="col-md-6 mb-3 mb-md-0">
      <label class="form-label fw-semibold" style="font-size:0.85rem; color:#333;">Full Name <span class="text-danger">*</span></label>
      <input class="form-control py-2 shadow-none" name="full_name" placeholder="John Doe" required="" type="text" style="border-radius:8px; border-color:#dee2e6;"/>
    </div>
    <div class="col-md-6">
      <label class="form-label fw-semibold" style="font-size:0.85rem; color:#333;">Contact Number <span class="text-danger">*</span></label>
      <input class="form-control py-2 shadow-none" name="phone"  required="" type="tel" style="border-radius:8px; border-color:#dee2e6;"/>
    </div>
  </div>
  <input name="interested_in" type="hidden" value="Compare ROI"/>
  <input class="roi-source-project" name="source" type="hidden" value="${projectName}"/>
  <button class="btn w-100 fw-bold py-2 shadow-sm d-flex align-items-center justify-content-center gap-2" style="background: #198754; color: #fff; border-radius:8px; border:none; transition: all 0.3s;" type="submit">
    <i class="fas fa-file-pdf"></i> Generate Comparison Report
  </button>
</form>
    `;
    modalBody.innerHTML = newHtml;
    
    // Initialize phone inputs for the newly injected modal
    if (typeof window.initPhoneInputs === 'function') {
        window.initPhoneInputs();
    }

    const roiForm = document.getElementById("compareRoiForm");
    if (roiForm) {
      roiForm.addEventListener("submit", function(e) {
        e.preventDefault();
        if (!roiForm.checkValidity()) {
          roiForm.classList.add('was-validated');
          return;
        }
        if (typeof submitViaIframe === 'function') {
          submitViaIframe(roiForm, "Thank you! Your ROI Comparison Report is being generated.");
        }
      });
    }
  }
});

// --- intl-tel-input integration ---
window.initPhoneInputs = function() {
    if (typeof window.intlTelInput !== 'function') return;
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        if (!input.iti) {
            input.iti = window.intlTelInput(input, {
                initialCountry: "ae",
                preferredCountries: ["ae", "in", "sa", "gb", "us", "pk", "kw", "qa"],
                utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
                separateDialCode: true,
                autoPlaceholder: "polite",
                dropdownContainer: document.body,
            });
            
            // Check if the input is meant for a dark background (white text)
            const inlineStyle = input.getAttribute('style') || '';
            const computedColor = window.getComputedStyle(input).color;
            if (inlineStyle.includes('color:#fff') || inlineStyle.includes('color: #fff') || computedColor === 'rgb(255, 255, 255)') {
                input.parentNode.classList.add('iti-dark');
            }
        }
    });
};

document.addEventListener("DOMContentLoaded", function() {
    window.initPhoneInputs();
    
    // Monkey-patch submitViaIframe globally to inject full phone number before submitting
    if (typeof window.submitViaIframe === 'function' && !window._submitViaIframePatched) {
        const originalSubmit = window.submitViaIframe;
        window.submitViaIframe = function(formElement, successMsg) {
            const phoneInputs = formElement.querySelectorAll('input[type="tel"]');
            phoneInputs.forEach(input => {
                if (input.iti && typeof input.iti.getNumber === 'function') {
                    // Always try to use the full E164 number if possible
                    try {
                        const num = input.iti.getNumber();
                        if (num) {
                            input.value = num;
                        }
                    } catch(e) {}
                }
            });
            return originalSubmit.call(window, formElement, successMsg);
        };
        window._submitViaIframePatched = true;
    }
});


// ==========================================
// UTM and Ad Tracking Logic
// ==========================================
(function() {
    function getQueryParam(param) {
        var urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param) || '';
    }

    function generateSessionId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    document.addEventListener("DOMContentLoaded", function() {
        var firstSource = localStorage.getItem('first_source');
        var currentSource = getQueryParam('utm_source');
        var currentMedium = getQueryParam('utm_medium');
        var currentCampaign = getQueryParam('utm_campaign');
        var currentGclid = getQueryParam('gclid');
        var now = new Date().toISOString();

        // If this is the user's first time, store 'First' parameters
        if (!firstSource && (currentSource || currentGclid || document.referrer)) {
            localStorage.setItem('first_source', currentSource || (document.referrer ? 'referral' : 'direct'));
            localStorage.setItem('first_medium', currentMedium || '');
            localStorage.setItem('first_campaign', currentCampaign || '');
            localStorage.setItem('first_gclid', currentGclid || '');
            localStorage.setItem('entry_time', now);
        }

        // Always update 'Latest' parameters if they exist in the URL
        if (currentSource || currentGclid) {
            sessionStorage.setItem('latest_source', currentSource || '');
            sessionStorage.setItem('latest_medium', currentMedium || '');
            sessionStorage.setItem('latest_campaign', currentCampaign || '');
            sessionStorage.setItem('latest_gclid', currentGclid || '');
            sessionStorage.setItem('latest_keyword', getQueryParam('utm_term') || '');
            sessionStorage.setItem('latest_content', getQueryParam('utm_content') || '');
            sessionStorage.setItem('latest_timestamp', now);
        }

        if (!sessionStorage.getItem('session_id')) {
            sessionStorage.setItem('session_id', generateSessionId());
        }
        
        sessionStorage.setItem('latest_referrer', document.referrer || '');
        sessionStorage.setItem('landing_page', window.location.href);

        // Patch submitViaIframe to inject tracking data before creating FormData
        if (typeof window.submitViaIframe === 'function') {
            var originalSubmitIframe = window.submitViaIframe;
            window.submitViaIframe = function(formElement, successMsg) {
                // Enforce global form validation
                if (!formElement.checkValidity()) {
                    formElement.classList.add('was-validated');
                    if (typeof formElement.reportValidity === 'function') {
                        formElement.reportValidity();
                    }
                    return false; // Stop submission
                }
                var trackingData = {
                    'session_id': sessionStorage.getItem('session_id') || '',
                    'event_id': generateSessionId(), // unique event id per submission
                    'first_source': localStorage.getItem('first_source') || 'direct',
                    'first_medium': localStorage.getItem('first_medium') || '',
                    'first_campaign': localStorage.getItem('first_campaign') || '',
                    'first_gclid': localStorage.getItem('first_gclid') || '',
                    'entry_time': localStorage.getItem('entry_time') || '',
                    'latest_source': sessionStorage.getItem('latest_source') || '',
                    'latest_medium': sessionStorage.getItem('latest_medium') || '',
                    'latest_campaign': sessionStorage.getItem('latest_campaign') || '',
                    'latest_gclid': sessionStorage.getItem('latest_gclid') || '',
                    'latest_keyword': sessionStorage.getItem('latest_keyword') || '',
                    'latest_content': sessionStorage.getItem('latest_content') || '',
                    'latest_referrer': sessionStorage.getItem('latest_referrer') || '',
                    'landing_page': sessionStorage.getItem('landing_page') || '',
                    'page_title': document.title,
                    'latest_timestamp': sessionStorage.getItem('latest_timestamp') || now
                };

                for (var key in trackingData) {
                    var input = formElement.querySelector("input[name='" + key + "']");
                    if (!input) {
                        input = document.createElement("input");
                        input.type = "hidden";
                        input.name = key;
                        formElement.appendChild(input);
                    }
                    input.value = trackingData[key];
                }
                
                // Call the original submit function
                return originalSubmitIframe.call(window, formElement, successMsg);
            };
        }
    });
})();
