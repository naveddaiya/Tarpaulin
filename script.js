// ==================== UTILITY FUNCTIONS ====================
// Debounce function for performance optimization
function debounce(func, wait = 10) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit = 16) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ==================== MOBILE MENU TOGGLE ====================
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        navMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// ==================== ACTIVE NAV LINK ON SCROLL ====================
const sections = document.querySelectorAll('section[id]');

function activateNavLink() {
    const scrollY = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Check if we're at the bottom of the page
    const isAtBottom = (scrollY + windowHeight) >= documentHeight - 10;

    sections.forEach((section, index) => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 150;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (navLink) {
            // If at bottom, activate the last section's link
            if (isAtBottom && index === sections.length - 1) {
                navLinks.forEach(link => link.classList.remove('active'));
                navLink.classList.add('active');
            } else if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                navLink.classList.add('active');
            }
        }
    });
}

// ==================== STICKY NAVBAR ====================
const navbar = document.getElementById('navbar');

function handleNavbarScroll() {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// ==================== SCROLL TO TOP BUTTON ====================
const scrollTopBtn = document.getElementById('scrollTop');

function handleScrollTopButton() {
    if (!scrollTopBtn) return;

    if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
}

if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        isScrollingProgrammatically = true;

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        setTimeout(() => {
            isScrollingProgrammatically = false;
        }, 1000);
    });
}

// ==================== COMBINED SCROLL HANDLER ====================
const handleScroll = throttle(() => {
    // Don't process if scrolling programmatically
    if (isScrollingProgrammatically) return;

    activateNavLink();
    handleNavbarScroll();
    handleScrollTopButton();
}, 16);

window.addEventListener('scroll', handleScroll, { passive: true });

// ==================== TESTIMONIAL SLIDER ====================
const testimonialCards = document.querySelectorAll('.testimonial-card');
const prevBtn = document.getElementById('prevTestimonial');
const nextBtn = document.getElementById('nextTestimonial');
let currentTestimonial = 0;

function showTestimonial(index) {
    testimonialCards.forEach((card, i) => {
        card.classList.remove('active');
        if (i === index) {
            setTimeout(() => card.classList.add('active'), 50);
        }
    });
}

function nextTestimonial() {
    currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
    showTestimonial(currentTestimonial);
}

function prevTestimonial() {
    currentTestimonial = (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
    showTestimonial(currentTestimonial);
}

// Manual controls only - no auto-slide to prevent scroll conflicts
if (nextBtn && prevBtn && testimonialCards.length > 0) {
    nextBtn.addEventListener('click', () => {
        nextTestimonial();
    });

    prevBtn.addEventListener('click', () => {
        prevTestimonial();
    });

    // Show first testimonial on load
    showTestimonial(0);
}

// ==================== CONTACT FORM SUBMISSION ====================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name') || contactForm.querySelector('input[type="text"]')?.value;

        // Show success message
        showNotification(
            `Thank you${name ? ' ' + name : ''}! Your message has been sent successfully. We will get back to you soon.`,
            'success'
        );

        // Reset form
        contactForm.reset();
    });
}

// ==================== NOTIFICATION SYSTEM ====================
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #2c9c93, #1a6760)' : 'linear-gradient(135deg, #ff4757, #c23616)'};
        color: white;
        padding: 20px 30px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        gap: 15px;
        font-size: 1rem;
        z-index: 10000;
        animation: slideInRight 0.4s ease;
        max-width: 400px;
    `;

    // Add animation keyframes if not exists
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.innerHTML = `
            @keyframes slideInRight {
                from {
                    transform: translateX(500px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(500px);
                    opacity: 0;
                }
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                margin-left: auto;
                opacity: 0.8;
                transition: opacity 0.2s;
            }
            .notification-close:hover {
                opacity: 1;
            }
            @media (max-width: 768px) {
                .notification {
                    right: 15px !important;
                    left: 15px !important;
                    max-width: calc(100% - 30px) !important;
                    top: 80px !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.4s ease';
        setTimeout(() => notification.remove(), 400);
    });

    // Append to body
    document.body.appendChild(notification);

    // Remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.4s ease';
            setTimeout(() => notification.remove(), 400);
        }
    }, 5000);
}

// ==================== SMOOTH SCROLL FOR ALL ANCHOR LINKS ====================
let isScrollingProgrammatically = false;

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '#!') return;

        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            isScrollingProgrammatically = true;
            const offsetTop = target.offsetTop - 80;

            // Use smooth scroll for navigation clicks
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });

            // Reset flag after scroll completes
            setTimeout(() => {
                isScrollingProgrammatically = false;
            }, 1000);
        }
    });
});

// ==================== SCROLL ANIMATIONS (Intersection Observer) ====================
const observerOptions = {
    threshold: 0.05,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
            // Unobserve after animation for better performance
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all elements with data-aos attribute
document.querySelectorAll('[data-aos]').forEach(element => {
    observer.observe(element);
});

// ==================== COUNTER ANIMATION FOR STATS ====================
function animateCounter(element, target, duration = 2000) {
    const suffix = element.dataset.suffix || '';
    let current = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, 16);
}

// Observe experience badge for counter animation
const experienceBadge = document.querySelector('.experience-number');
if (experienceBadge) {
    const badgeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const text = experienceBadge.textContent;
                const target = parseInt(text);
                if (!isNaN(target)) {
                    experienceBadge.dataset.suffix = text.replace(target, '');
                    animateCounter(experienceBadge, target);
                }
                badgeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    badgeObserver.observe(experienceBadge);
}

// ==================== PRODUCT QUICK VIEW ====================
const quickViewBtns = document.querySelectorAll('.quick-view-btn');

quickViewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const productCard = btn.closest('.product-card');
        const productName = productCard.querySelector('.product-info h3')?.textContent;
        showNotification(`Viewing: ${productName || 'Product'} - Contact us for more details!`, 'success');
    });
});

// ==================== PRODUCT CARD 3D TILT EFFECT ====================
// Disabled for better scroll performance
/*
const productCards = document.querySelectorAll('.product-card');

// Only enable tilt on larger screens
if (window.innerWidth > 768) {
    productCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * 5;
            const rotateY = ((centerX - x) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}
*/

// ==================== FORM INPUT ANIMATION ====================
const formInputs = document.querySelectorAll('.form-group input, .form-group textarea, .form-group select');

formInputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.style.transform = 'scale(1.02)';
        input.parentElement.style.transition = 'transform 0.2s ease';
    });

    input.addEventListener('blur', () => {
        input.parentElement.style.transform = 'scale(1)';
    });
});

// ==================== TYPEWRITER EFFECT FOR HERO SUBTITLE ====================
function typeWriter(element, text, speed = 50) {
    let charIndex = 0;
    element.textContent = '';
    element.style.opacity = '1';

    function type() {
        if (charIndex < text.length) {
            element.textContent += text.charAt(charIndex);
            charIndex++;
            setTimeout(type, speed);
        }
    }

    type();
}

// ==================== KEYBOARD NAVIGATION ====================
document.addEventListener('keydown', (e) => {
    // Prevent any automatic scrolling from keyboard
    if (['Home', 'End', 'PageUp', 'PageDown'].includes(e.key)) {
        isScrollingProgrammatically = true;
        setTimeout(() => {
            isScrollingProgrammatically = false;
        }, 500);
    }

    // Testimonials navigation with arrow keys
    if (e.key === 'ArrowLeft' && prevBtn) {
        prevTestimonial();
    } else if (e.key === 'ArrowRight' && nextBtn) {
        nextTestimonial();
    }

    // Escape key to close mobile menu
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ==================== LAZY LOADING FOR IMAGES ====================
const lazyImages = document.querySelectorAll('img[data-src]');

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
} else {
    // Fallback for browsers that don't support IntersectionObserver
    lazyImages.forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
    });
}

// ==================== PERFORMANCE MONITORING ====================
window.addEventListener('load', () => {
    // Prevent scroll restoration
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    // Fade in body
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);

    // Log performance metrics
    if ('performance' in window) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`%c⚡ Page loaded in ${pageLoadTime}ms`, 'color: #2c9c93; font-weight: bold;');
    }

    // Remove hash from URL without scrolling
    if (window.location.hash) {
        history.replaceState(null, null, ' ');
    }
});

// ==================== DYNAMIC YEAR IN FOOTER ====================
const currentYear = new Date().getFullYear();
const footerText = document.querySelector('.footer-bottom p');
if (footerText) {
    footerText.innerHTML = footerText.innerHTML.replace(/\d{4}/, currentYear);
}

// ==================== PARALLAX EFFECT FOR HERO ====================
// Disabled to prevent scroll conflicts
/*
let ticking = false;

function updateParallax() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-content');
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
    ticking = false;
}

function requestParallaxUpdate() {
    if (!ticking && window.innerWidth > 768) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
    }
}

window.addEventListener('scroll', requestParallaxUpdate);
*/

// ==================== DETECT TOUCH DEVICE ====================
const isTouchDevice = () => {
    return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0));
};

if (isTouchDevice()) {
    document.body.classList.add('touch-device');
}

// ==================== CONSOLE MESSAGE ====================
console.log('%c🎨 HB Traders Website', 'color: #2c9c93; font-size: 24px; font-weight: bold; padding: 10px;');
console.log('%c✨ Premium Tarpaulin Solutions', 'color: #f5a623; font-size: 16px; padding: 5px;');
console.log('%c💼 Developed with precision and care', 'color: #b0b0b0; font-size: 12px; padding: 5px;');
console.log('%c📱 Fully responsive across all devices', 'color: #2c9c93; font-size: 12px; padding: 5px;');

// ==================== ERROR HANDLING ====================
window.addEventListener('error', (e) => {
    console.error('An error occurred:', e.message);
});

// ==================== CREATE FLOATING PARTICLES ====================
// Disabled for better scroll performance
function createParticles() {
    // Particles disabled to improve scrolling performance
    return;

    /*
    const particleCount = window.innerWidth > 768 ? 30 : 15;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';

        // Random colors
        const colors = [
            'rgba(44, 156, 147, 0.5)',
            'rgba(245, 166, 35, 0.4)',
            'rgba(26, 103, 96, 0.3)'
        ];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];

        // Random sizes
        const size = 2 + Math.random() * 4;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';

        document.body.appendChild(particle);
    }
    */
}

// ==================== POPUP FORM FUNCTIONALITY ====================
const popupOverlay = document.getElementById('popupOverlay');
const popupClose = document.getElementById('popupClose');
const popupForm = document.getElementById('popupForm');

// Show popup after 3 seconds
function showPopup() {
    setTimeout(() => {
        if (!sessionStorage.getItem('popupShown')) {
            popupOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }, 3000);
}

// Close popup
function closePopup() {
    popupOverlay.classList.remove('active');
    document.body.style.overflow = '';
    sessionStorage.setItem('popupShown', 'true');
}

// Close popup on close button click
if (popupClose) {
    popupClose.addEventListener('click', closePopup);
}

// Close popup on overlay click
if (popupOverlay) {
    popupOverlay.addEventListener('click', (e) => {
        if (e.target === popupOverlay) {
            closePopup();
        }
    });
}

// Close popup on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popupOverlay.classList.contains('active')) {
        closePopup();
    }
});

// Handle popup form submission
if (popupForm) {
    popupForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(popupForm);
        const name = formData.get('name');
        const phone = formData.get('phone');
        const product = formData.get('product');

        // Show success notification
        showNotification(
            `Thank you ${name}! We'll contact you soon about ${popupForm.querySelector(`option[value="${product}"]`)?.textContent || 'your interest'}.`,
            'success'
        );

        // Close popup and reset form
        closePopup();
        popupForm.reset();

        // You can add your API call here to save the data
        console.log('Form submitted:', { name, phone, product });
    });
}

// ==================== INITIALIZE ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('%c✅ Website initialized successfully!', 'color: #2c9c93; font-weight: bold;');

    // Prevent scroll restoration on page load
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    // Set initial state
    activateNavLink();
    handleNavbarScroll();
    handleScrollTopButton();

    // Create floating particles
    createParticles();

    // Trigger AOS animations for elements in viewport
    document.querySelectorAll('[data-aos]').forEach(element => {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
            element.classList.add('aos-animate');
        }
    });

    // Show popup form after delay
    showPopup();
});

// ==================== VISIBILITY CHANGE ====================
// Auto-slider disabled - no need for visibility handling
/*
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopTestimonialSlider();
    } else {
        if (testimonialCards.length > 0) {
            startTestimonialSlider();
        }
    }
});
*/

// ==================== RESIZE HANDLER ====================
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Recalculate on resize
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    }, 250);
});
