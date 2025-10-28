/* 
========================================
PATHFINDERS CLUB JAVASCRIPT
========================================
Author: Front-End Developer
Description: Vanilla JavaScript for interactive features
Features: Mobile menu, form validation, gallery lightbox, calendar downloads
*/

// ========== MOBILE NAVIGATION ========== 
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
    const isExpanded = navLinks.classList.contains('active');
    hamburger.setAttribute('aria-expanded', isExpanded);
});

// Close mobile menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    }
});

// ========== PROGRAM CARDS - LEARN MORE TOGGLE ========== 
const learnMoreButtons = document.querySelectorAll('.learn-more-btn');

learnMoreButtons.forEach(button => {
    button.addEventListener('click', function() {
        const card = this.closest('.program-card');
        const shortDesc = card.querySelector('.program-description.short');
        const fullDesc = card.querySelector('.program-description.full');
        
        if (fullDesc.classList.contains('active')) {
            fullDesc.classList.remove('active');
            shortDesc.classList.remove('hidden');
            this.textContent = 'Learn more';
            this.setAttribute('aria-expanded', 'false');
        } else {
            fullDesc.classList.add('active');
            shortDesc.classList.add('hidden');
            this.textContent = 'Show less';
            this.setAttribute('aria-expanded', 'true');
        }
    });
});

// ========== EVENTS - CALENDAR DOWNLOAD ========== 
const eventsData = [
    {
        title: 'Monthly Campout',
        date: '2025-11-15',
        time: '18:00',
        endTime: '14:00',
        endDate: '2025-11-17',
        description: 'Join us for a weekend of outdoor adventure, worship, and fellowship. Bring your tent, sleeping bag, and sense of adventure!',
        location: 'Pine Ridge Campground'
    },
    {
        title: 'Community Service Day',
        date: '2025-11-22',
        time: '09:00',
        endTime: '14:00',
        endDate: '2025-11-22',
        description: 'Help us serve our community by volunteering at the food bank. We will sort donations, pack boxes, and make a real difference.',
        location: 'Local Food Bank'
    },
    {
        title: 'Investiture Ceremony',
        date: '2025-12-06',
        time: '10:00',
        endTime: '12:00',
        endDate: '2025-12-06',
        description: 'Celebrate achievements as Pathfinders receive their honors and badges. Families and friends welcome!',
        location: 'Church Auditorium'
    }
];

// Generate ICS file for calendar
function generateICS(event) {
    const formatDate = (dateStr, timeStr) => {
        const date = new Date(`${dateStr}T${timeStr}:00`);
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Pathfinders Club//Event//EN
CALSCALE:GREGORIAN
BEGIN:VEVENT
DTSTART:${formatDate(event.date, event.time)}
DTEND:${formatDate(event.endDate, event.endTime)}
SUMMARY:${event.title}
DESCRIPTION:${event.description.replace(/\n/g, '\\n')}
LOCATION:${event.location}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.title.replace(/\s+/g, '_')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Add to calendar button event listeners
document.querySelectorAll('.add-calendar-btn').forEach(button => {
    button.addEventListener('click', function() {
        const eventIndex = parseInt(this.getAttribute('data-event'));
        generateICS(eventsData[eventIndex]);
    });
});

// ========== EVENTS - FILTER (UPCOMING/PAST) ========== 
const filterButtons = document.querySelectorAll('.filter-btn');
const eventCards = document.querySelectorAll('.event-card');

filterButtons.forEach(button => {
    button.addEventListener('click', function() {
        const filter = this.getAttribute('data-filter');
        
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        // Filter events
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        eventCards.forEach(card => {
            const eventDate = new Date(card.getAttribute('data-date'));
            eventDate.setHours(0, 0, 0, 0);
            
            if (filter === 'upcoming') {
                if (eventDate >= today) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            } else if (filter === 'past') {
                if (eventDate < today) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            }
        });
        
        // Show message if no events
        const visibleEvents = Array.from(eventCards).filter(card => !card.classList.contains('hidden'));
        if (visibleEvents.length === 0) {
            // You could add a "No events" message here if desired
            console.log(`No ${filter} events found`);
        }
    });
});

// ========== GALLERY LIGHTBOX ========== 
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');

let currentImageIndex = 0;
const galleryImages = Array.from(galleryItems).map(item => {
    const img = item.querySelector('img');
    return {
        src: img.src,
        alt: img.alt
    };
});

function openLightbox(index) {
    currentImageIndex = index;
    lightboxImg.src = galleryImages[index].src;
    lightboxImg.alt = galleryImages[index].alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
}

function showPrevImage() {
    currentImageIndex = currentImageIndex > 0 ? currentImageIndex - 1 : galleryImages.length - 1;
    lightboxImg.src = galleryImages[currentImageIndex].src;
    lightboxImg.alt = galleryImages[currentImageIndex].alt;
}

function showNextImage() {
    currentImageIndex = currentImageIndex < galleryImages.length - 1 ? currentImageIndex + 1 : 0;
    lightboxImg.src = galleryImages[currentImageIndex].src;
    lightboxImg.alt = galleryImages[currentImageIndex].alt;
}

// Gallery item click handlers
galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        openLightbox(index);
    });
});

// Lightbox navigation
lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    showPrevImage();
});
lightboxNext.addEventListener('click', (e) => {
    e.stopPropagation();
    showNextImage();
});

// Close lightbox when clicking on background
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') {
        closeLightbox();
    } else if (e.key === 'ArrowLeft') {
        showPrevImage();
    } else if (e.key === 'ArrowRight') {
        showNextImage();
    }
});

// ========== FORM VALIDATION ========== 
const form = document.getElementById('contact-form');
const successModal = document.getElementById('success-modal');

// Validation functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    // Allow various phone formats
    const re = /^[\d\s\-\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}-error`);
    field.classList.add('error');
    errorElement.textContent = message;
    errorElement.classList.add('active');
    field.setAttribute('aria-invalid', 'true');
}

function hideError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}-error`);
    field.classList.remove('error');
    errorElement.classList.remove('active');
    field.setAttribute('aria-invalid', 'false');
}

function validateForm() {
    let isValid = true;

    // Clear all errors first
    ['name', 'email', 'phone', 'age', 'consent'].forEach(hideError);

    // Validate name
    const name = form.name.value.trim();
    if (!name) {
        showError('name', 'Name is required');
        isValid = false;
    }

    // Validate email
    const email = form.email.value.trim();
    if (!email) {
        showError('email', 'Email is required');
        isValid = false;
    } else if (!validateEmail(email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }

    // Validate phone
    const phone = form.phone.value.trim();
    if (!phone) {
        showError('phone', 'Phone number is required');
        isValid = false;
    } else if (!validatePhone(phone)) {
        showError('phone', 'Please enter a valid phone number');
        isValid = false;
    }

    // Validate age
    const age = form.age.value.trim();
    if (!age) {
        showError('age', 'Age is required');
        isValid = false;
    } else if (age < 10 || age > 15) {
        showError('age', 'Age must be between 10 and 15');
        isValid = false;
    }

    // Validate consent checkbox
    if (!form.consent.checked) {
        showError('consent', 'You must agree to the terms');
        isValid = false;
    }

    return isValid;
}

// Form submission
form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (validateForm()) {
        // Show success modal
        successModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Reset form and hide modal after 3 seconds
        setTimeout(() => {
            successModal.classList.remove('active');
            document.body.style.overflow = '';
            form.reset();
        }, 3000);
    } else {
        // Focus on first error field
        const firstError = form.querySelector('.error');
        if (firstError) {
            firstError.focus();
        }
    }
});

// Real-time validation on blur
form.name.addEventListener('blur', function() {
    if (this.value.trim()) {
        hideError('name');
    }
});

form.email.addEventListener('blur', function() {
    const email = this.value.trim();
    if (email && validateEmail(email)) {
        hideError('email');
    }
});

form.phone.addEventListener('blur', function() {
    const phone = this.value.trim();
    if (phone && validatePhone(phone)) {
        hideError('phone');
    }
});

form.age.addEventListener('blur', function() {
    const age = this.value.trim();
    if (age && age >= 10 && age <= 15) {
        hideError('age');
    }
});

form.consent.addEventListener('change', function() {
    if (this.checked) {
        hideError('consent');
    }
});

// Close modal when clicking outside
successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
        successModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ========== SMOOTH SCROLL FOR ANCHOR LINKS ========== 
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========== SCROLL HEADER SHADOW ========== 
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 10) {
        header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// ========== INITIALIZE ========== 
console.log('Pathfinders Club Website Initialized');
console.log('All interactive features loaded successfully');