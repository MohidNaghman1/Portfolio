// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializePortfolio();
});

// Initialize all portfolio functionality
function initializePortfolio() {
    setupMobileNavigation();
    setupSmoothScrolling();
    setupScrollEffects();
    setupAnimations();
    setupContactForm();
    createDynamicParticles();
    initializeTypewriter();
    initializeSkillIcons();
}

// Mobile Navigation Toggle
function setupMobileNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
            
            // Animate hamburger lines
            const lines = hamburger.querySelectorAll('div');
            if (navLinks.classList.contains('active')) {
                lines[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                lines[1].style.opacity = '0';
                lines[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                lines[0].style.transform = 'none';
                lines[1].style.opacity = '1';
                lines[2].style.transform = 'none';
            }
        });

        // Close mobile menu when clicking on links
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const lines = hamburger.querySelectorAll('div');
                lines[0].style.transform = 'none';
                lines[1].style.opacity = '1';
                lines[2].style.transform = 'none';
            });
        });
    }

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', 
            menuToggle.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
        );
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

// Smooth Scrolling for navigation links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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
}

// Header background and scroll effects
function setupScrollEffects() {
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        // Header background change
        if (scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }

        // Parallax effect for hero section
        const hero = document.querySelector('.hero');
        if (hero && scrollY < window.innerHeight) {
            hero.style.transform = `translateY(${scrollY * 0.5}px)`;
        }
    });
}

// Intersection Observer for animations
function setupAnimations() {
    // Fade in animation observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Add staggered animation for grid items
                if (entry.target.classList.contains('skills-grid') || 
                    entry.target.classList.contains('projects-grid')) {
                    animateGridItems(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe all fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => {
        fadeObserver.observe(el);
    });

    // Skills section specific animations
    const skillsSection = document.querySelector('.skills');
    if (skillsSection) {
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkillBars();
                }
            });
        }, { threshold: 0.5 });

        skillObserver.observe(skillsSection);
    }
}

// Animate grid items with stagger effect
function animateGridItems(container) {
    const items = container.children;
    Array.from(items).forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Animate skill progress bars
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach((bar, index) => {
        setTimeout(() => {
            const width = bar.getAttribute('data-width') || bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width;
                bar.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
            }, 100);
        }, index * 200);
    });
}

// Contact form functionality
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };

        try {
            formStatus.textContent = 'Sending message...';
            formStatus.style.color = '#666';

            // Check if server is running
            try {
                const response = await fetch('http://localhost:3000/send-message', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (response.ok) {
                    formStatus.textContent = 'Message sent successfully!';
                    formStatus.style.color = '#4CAF50';
                    contactForm.reset();
                } else {
                    throw new Error(data.error || 'Failed to send message');
                }
            } catch (fetchError) {
                console.error('Server connection error:', fetchError);
                if (fetchError.message === 'Failed to fetch') {
                    throw new Error('Cannot connect to server. Please make sure the server is running on port 3000.');
                }
                throw fetchError;
            }
        } catch (error) {
            console.error('Form submission error:', error);
            formStatus.textContent = 'Error: ' + error.message;
            formStatus.style.color = '#f44336';
        }
    });
}

// Dynamic particle background
function createDynamicParticles() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const hero = document.querySelector('.hero');
    
    if (!hero) return;
    
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1';
    
    hero.appendChild(canvas);
    
    let particles = [];
    let animationId;
    
    function resizeCanvas() {
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
    }
    
    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            dx: (Math.random() - 0.5) * 0.5,
            dy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.2
        };
    }
    
    function initParticles() {
        particles = [];
        for (let i = 0; i < 50; i++) {
            particles.push(createParticle());
        }
    }
    
    function updateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach((particle, index) => {
            particle.x += particle.dx;
            particle.y += particle.dy;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = canvas.height;
            if (particle.y > canvas.height) particle.y = 0;
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(74, 144, 226, ${particle.opacity})`;
            ctx.fill();
        });
        
        animationId = requestAnimationFrame(updateParticles);
    }
    
    resizeCanvas();
    initParticles();
    updateParticles();
    
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });
}

// Typewriter effect
function initializeTypewriter() {
    const typewriterElement = document.querySelector('.typewriter-text');
    if (!typewriterElement) return;
    
    const texts = [
        'Full Stack Developer',
        'UI/UX Designer',
        'Problem Solver',
        'Creative Thinker'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isWaiting = false;
    
    function typeWriter() {
        const currentText = texts[textIndex];
        
        if (isWaiting) {
            setTimeout(typeWriter, 2000);
            isWaiting = false;
            return;
        }
        
        if (isDeleting) {
            typewriterElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            
            if (charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
            }
        } else {
            typewriterElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            
            if (charIndex === currentText.length) {
                isDeleting = true;
                isWaiting = true;
            }
        }
        
        const speed = isDeleting ? 100 : 150;
        setTimeout(typeWriter, speed);
    }
    
    typeWriter();
}

// Project filter functionality
function initializeProjectFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    
    if (!filterButtons.length || !projectItems.length) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter projects
            projectItems.forEach(item => {
                const categories = item.getAttribute('data-category').split(' ');
                
                if (filter === 'all' || categories.includes(filter)) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Scroll to top functionality
function initializeScrollToTop() {
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '↑';
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #4a90e2;
        color: white;
        border: none;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
    `;
    
    document.body.appendChild(scrollTopBtn);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTopBtn.style.opacity = '1';
            scrollTopBtn.style.visibility = 'visible';
        } else {
            scrollTopBtn.style.opacity = '0';
            scrollTopBtn.style.visibility = 'hidden';
        }
    });
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize additional features when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeProjectFilter();
    initializeScrollToTop();
});

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll-heavy functions
window.addEventListener('scroll', throttle(() => {
    // Additional scroll-based functionality can be added here
}, 16)); // ~60fps

// Initialize skill icons
function initializeSkillIcons() {
    const skillIcons = document.querySelectorAll('.skill-icon');
    
    skillIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            // Remove active class from all icons
            skillIcons.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked icon
            icon.classList.add('active');
            
            // Show tooltip for a longer duration on click
            const tooltip = icon.getAttribute('data-tooltip');
            const tooltipElement = document.createElement('div');
            tooltipElement.className = 'click-tooltip';
            tooltipElement.textContent = tooltip;
            
            // Remove any existing click tooltips
            document.querySelectorAll('.click-tooltip').forEach(t => t.remove());
            
            // Add new tooltip
            document.body.appendChild(tooltipElement);
            
            // Position tooltip
            const rect = icon.getBoundingClientRect();
            tooltipElement.style.top = `${rect.top - tooltipElement.offsetHeight - 10}px`;
            tooltipElement.style.left = `${rect.left + (rect.width / 2) - (tooltipElement.offsetWidth / 2)}px`;
            
            // Remove tooltip after 2 seconds
            setTimeout(() => {
                tooltipElement.remove();
                icon.classList.remove('active');
            }, 2000);
        });
    });
}

// Typing Effect
const typingText = document.getElementById('typing-text');
const phrases = [
    'Machine Learning Engineer',
    'Data Scientist',
    'NLP Specialist',
    'AI Enthusiast'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingDelay = 100;

function typeEffect() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        typingText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingDelay = 50;
    } else {
        typingText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingDelay = 100;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typingDelay = 2000; // Pause at end of phrase
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingDelay = 500; // Pause before starting new phrase
    }

    setTimeout(typeEffect, typingDelay);
}

// Start typing effect when page loads
window.addEventListener('load', typeEffect);

// Fade In Animation
function handleFadeIn() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    fadeElements.forEach(element => {
        observer.observe(element);
    });
}

// Initialize fade-in animation when page loads
window.addEventListener('load', handleFadeIn);
