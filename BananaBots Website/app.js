// Initialize Lucide Icons
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initCounters();
    initTabs();
    initMobileNav();
    initContactForm();
    initScrollSpy();
});

// Animated Counter Effect
function initCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    let animated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'));
                    const duration = 1800; // ms
                    const step = Math.max(1, Math.floor(target / (duration / 16)));
                    let current = 0;

                    const timer = setInterval(() => {
                        current += step;
                        if (current >= target) {
                            stat.textContent = target;
                            clearInterval(timer);
                        } else {
                            stat.textContent = current;
                        }
                    }, 16);
                });
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
}

// Interactive Tabs Switcher for Robot Specs
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            // Toggle button state
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Toggle tab contents
            tabContents.forEach(content => {
                if (content.id === `tab-${targetTab}`) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
        });
    });
}

// Mobile Menu Toggle
function initMobileNav() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
        });

        // Close menu when clicking links (excluding dropdown toggle button)
        document.querySelectorAll('.nav-link:not(.dropdown-toggle)').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
            });
        });

        // Dropdown toggle click handling for touch & mobile
        document.querySelectorAll('.dropdown-toggle').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const dropdown = btn.closest('.nav-dropdown');
                if (dropdown) {
                    dropdown.classList.toggle('open');
                }
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            document.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));
        });
    }
}

// Contact Form Handler with FormSubmit Email Integration
function initContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const interest = document.getElementById('interest').value;
            const message = document.getElementById('message').value;

            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i data-lucide="loader-2" class="spin"></i> Sending...`;
            if (window.lucide) lucide.createIcons();

            try {
                const response = await fetch('https://formsubmit.co/ajax/thebananabotsatx@gmail.com', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        Name: name,
                        Email: email,
                        InquiryType: interest,
                        Message: message,
                        _subject: `🤖 New ${interest} Inquiry from ${name} (BananaBots Website)`
                    })
                });

                if (response.ok) {
                    contactForm.reset();
                    showToast(`🚀 Thank you ${name}! Your message has been sent directly to thebananabotsatx@gmail.com.`);
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (err) {
                // Fallback to mailto link if network is blocked/offline
                const mailtoUrl = `mailto:thebananabotsatx@gmail.com?subject=${encodeURIComponent('Inquiry: ' + interest)}&body=${encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + message)}`;
                window.location.href = mailtoUrl;
                showToast(`📧 Opening mail app to send email to thebananabotsatx@gmail.com...`);
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                if (window.lucide) lucide.createIcons();
            }
        });
    }
}

function showToast(message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i data-lucide="check-circle" class="icon-yellow"></i> <span>${message}</span>`;

    container.appendChild(toast);
    lucide.createIcons();

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Scroll Spy for Nav links
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}
