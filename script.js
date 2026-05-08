// =============================================
// NAVBAR: Change background color on scroll
// =============================================
window.addEventListener('scroll', function () {
    const navbar = document.getElementById('navbar');

    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// =============================================
// MOBILE MENU: Open and Close
// =============================================
function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    const burger = document.getElementById('hamburger');

    menu.classList.toggle('open');
    burger.classList.toggle('active');

    // Prevent background scrolling when menu is open
    document.body.style.overflow =
        menu.classList.contains('open') ? 'hidden' : 'auto';
}

function closeMenu() {
    const menu = document.getElementById('mobileMenu');
    const burger = document.getElementById('hamburger');

    menu.classList.remove('open');
    burger.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// =============================================
// HERO CAROUSEL: Auto + Manual navigation
// =============================================
const carouselImages = document.querySelectorAll('.carousel-img');
let currentHeroIndex = 0;
let heroInterval;

function ensureHeroImageLoaded(index) {
    const img = carouselImages[index];
    if (!img) return;

    const dataSrc = img.getAttribute('data-src');
    if (dataSrc && img.getAttribute('src') !== dataSrc) {
        img.setAttribute('src', dataSrc);
        img.removeAttribute('data-src');
    }
}

function showHeroImage(index) {
    ensureHeroImageLoaded(index);
    carouselImages.forEach((img, i) => {
        img.classList.toggle('active', i === index);
    });
}

function nextHeroImage() {
    currentHeroIndex = (currentHeroIndex + 1) % carouselImages.length;
    showHeroImage(currentHeroIndex);
}

function prevHeroImage() {
    currentHeroIndex = (currentHeroIndex - 1 + carouselImages.length) % carouselImages.length;
    showHeroImage(currentHeroIndex);
}

// Auto-advance every 6 seconds
function startHeroCarousel() {
    heroInterval = setInterval(nextHeroImage, 6000);
}

function resetHeroTimer() {
    clearInterval(heroInterval);
    startHeroCarousel();
}

// Start auto carousel when page loads
document.addEventListener('DOMContentLoaded', function () {
    ensureHeroImageLoaded(0);
    ensureHeroImageLoaded(1);
    startHeroCarousel();
});

// =============================================
// SCROLL REVEAL ANIMATIONS
// =============================================
document.addEventListener('DOMContentLoaded', function () {
    const revealEls = document.querySelectorAll(
        '.section-header, .dest-card, .gallery-item, .testimonial-card, .contact-wrapper, .footer-grid'
    );

    revealEls.forEach((el) => {
        el.classList.add('reveal');
        if (el.classList.contains('dest-card') || el.classList.contains('testimonial-card')) {
            el.classList.add('reveal-scale');
        }
    });

    if (!('IntersectionObserver' in window)) {
        revealEls.forEach((el) => el.classList.add('is-visible'));
        return;
    }

    const io = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -10% 0px' }
    );

    revealEls.forEach((el) => io.observe(el));
});

// =============================================
// CONTACT FORM: Simple validation
// =============================================
function validateForm(event) {
    event.preventDefault();

    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    const success = document.getElementById('formSuccess');

    let isValid = true;

    // Reset errors
    document.getElementById('nameError').textContent = '';
    document.getElementById('emailError').textContent = '';
    document.getElementById('messageError').textContent = '';
    success.textContent = '';

    // Validate name
    if (name.value.trim().length < 2) {
        document.getElementById('nameError').textContent = 'Please enter your full name.';
        isValid = false;
    }

    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value.trim())) {
        document.getElementById('emailError').textContent = 'Please enter a valid email address.';
        isValid = false;
    }

    // Validate message
    if (message.value.trim().length < 10) {
        document.getElementById('messageError').textContent = 'Message must be at least 10 characters.';
        isValid = false;
    }

    if (isValid) {
        success.textContent = 'Thank you! We will reply within 24 hours.';
        document.getElementById('bookingForm').reset();
    }

    return false;
}

// =============================================
// TESTIMONIALS CAROUSEL
// =============================================
document.addEventListener('DOMContentLoaded', function () {
    const track = document.getElementById('testimonialsTrack');
    const prevBtn = document.getElementById('tPrev');
    const nextBtn = document.getElementById('tNext');
    const dotsContainer = document.getElementById('tDots');

    if (!track) return;

    const cards = track.querySelectorAll('.testimonial-card');
    const cardWidth = cards[0] ? cards[0].offsetWidth + 24 : 404; // width + gap
    let tAutoInterval;

    // Build dots
    cards.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 't-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
        dot.addEventListener('click', () => {
            track.scrollTo({ left: i * cardWidth, behavior: 'smooth' });
            resetTAuto();
        });
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.t-dot');

    function updateDots() {
        const scrollLeft = track.scrollLeft;
        const index = Math.round(scrollLeft / cardWidth);
        dots.forEach((d, i) => d.classList.toggle('active', i === index));
    }

    // Scroll sync dots
    track.addEventListener('scroll', () => {
        window.requestAnimationFrame(updateDots);
    });

    // Arrows
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            track.scrollBy({ left: -cardWidth, behavior: 'smooth' });
            resetTAuto();
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            track.scrollBy({ left: cardWidth, behavior: 'smooth' });
            resetTAuto();
        });
    }

    // Auto-play
    function startTAuto() {
        tAutoInterval = setInterval(() => {
            const maxScroll = track.scrollWidth - track.clientWidth;
            if (track.scrollLeft >= maxScroll - 10) {
                track.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                track.scrollBy({ left: cardWidth, behavior: 'smooth' });
            }
        }, 5000);
    }

    function resetTAuto() {
        clearInterval(tAutoInterval);
        startTAuto();
    }

    startTAuto();
});