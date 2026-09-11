// Initialize Lucide Icons
document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) {
        try {
            lucide.createIcons();
        } catch (e) {
            console.error('Lucide error:', e);
        }
    }
    initCounters();
    initTabs();
    initMobileNav();
    initContactForm();
    initScrollSpy();
    initScrollAnimations();
    initResourceDirectory();
    initCopyButtons();
    initViewSwitcher();
});

// Animated Counter Effect
function initCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (!statNumbers.length) return;

    let animated = false;

    const startAnimation = () => {
        if (animated) return;
        animated = true;

        const duration = 1800; // ms
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Smooth ease-out cubic curve
            const easeProgress = 1 - Math.pow(1 - progress, 3);

            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'), 10) || 0;
                const current = Math.floor(easeProgress * target);
                stat.textContent = current;
            });

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'), 10) || 0;
                    stat.textContent = target;
                });
            }
        }

        requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startAnimation();
                observer.disconnect();
            }
        });
    }, { threshold: 0.1 });

    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        observer.observe(statsSection);
    } else {
        startAnimation();
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
    if (window.lucide) {
        try {
            lucide.createIcons();
        } catch (e) {
            console.error('Lucide error in toast:', e);
        }
    }

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Scroll Spy for Nav links
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]:not(#links)');
    const navLinks = document.querySelectorAll('.nav-link');
    const linksSection = document.getElementById('links');

    window.addEventListener('scroll', () => {
        if (linksSection && linksSection.style.display === 'block') {
            return;
        }

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

// Scroll Entrance Animations (Scroll Reveal)
function initScrollAnimations() {
    const autoRevealTargets = [
        { selector: '.hero-tag', anim: 'reveal-fade-up', delay: 0 },
        { selector: '.hero-title', anim: 'reveal-fade-up', delay: 1 },
        { selector: '.hero-description', anim: 'reveal-fade-up', delay: 2 },
        { selector: '.hero-actions', anim: 'reveal-fade-up', delay: 3 },
        { selector: '.hero-img-wrapper', anim: 'reveal-scale-up', delay: 2 },
        { selector: '.section-header', anim: 'reveal-fade-up', delay: 0 },
        { selector: '.about-card', anim: 'reveal-fade-up', stagger: true },
        { selector: '.stat-card', anim: 'reveal-scale-up', stagger: true },
        { selector: '.subteam-card', anim: 'reveal-fade-up', stagger: true },
        { selector: '.tier-card', anim: 'reveal-fade-up', stagger: true },
        { selector: '.timeline-item', anim: 'reveal-slide-right', stagger: true },
        { selector: '.contact-card', anim: 'reveal-slide-right', delay: 0 },
        { selector: '.contact-form', anim: 'reveal-slide-left', delay: 1 },
        { selector: '.github-card', anim: 'reveal-scale-up', delay: 0 }
    ];

    autoRevealTargets.forEach(target => {
        const elements = document.querySelectorAll(target.selector);
        elements.forEach((el, index) => {
            if (!el.classList.contains('reveal-visible')) {
                el.classList.add(target.anim);
                const delayIndex = target.stagger ? (index % 5) + 1 : (target.delay || 0);
                if (delayIndex > 0) {
                    el.classList.add(`delay-${delayIndex}`);
                }
            }
        });
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealables = document.querySelectorAll(
        '.reveal-fade-up, .reveal-fade-in, .reveal-scale-up, .reveal-slide-right, .reveal-slide-left'
    );
    revealables.forEach(el => observer.observe(el));
}

// Resource Directory Filtering & Live Search
function initResourceDirectory() {
    const searchInput = document.getElementById('linkSearchInput');
    const searchClearBtn = document.getElementById('searchClearBtn');
    const categoryPills = document.querySelectorAll('.pill-btn');
    const resourceItems = document.querySelectorAll('.resource-item-row, .resource-card');
    const categoryGroups = document.querySelectorAll('.category-group');
    const noResults = document.getElementById('noResults');
    const resetSearchBtn = document.getElementById('resetSearchBtn');

    if (!resourceItems.length) return;

    let currentCategory = 'all';
    let searchQuery = '';

    // Calculate category counts
    function updateCategoryCounts() {
        const counts = {
            'all': resourceItems.length,
            'team-repos': 0,
            'ftc-official': 0,
            'software': 0,
            'hardware': 0,
            'learning': 0
        };

        resourceItems.forEach(item => {
            const cat = item.getAttribute('data-category');
            if (counts.hasOwnProperty(cat)) {
                counts[cat]++;
            }
        });

        Object.keys(counts).forEach(cat => {
            const countEl = document.getElementById(`count-${cat}`);
            if (countEl) {
                countEl.textContent = counts[cat];
            }
        });
    }

    // Filter cards and category groups
    function filterCards() {
        let totalVisible = 0;
        const query = searchQuery.trim().toLowerCase();

        // 1. Filter Category Groups & Row Items
        categoryGroups.forEach(group => {
            const groupCategory = group.getAttribute('data-category-group');
            const matchesCategory = currentCategory === 'all' || groupCategory === currentCategory;

            const itemRows = group.querySelectorAll('.resource-item-row');
            let groupVisibleCount = 0;

            itemRows.forEach(row => {
                const tags = (row.getAttribute('data-tags') || '').toLowerCase();
                const title = (row.querySelector('.item-title, h3, h4')?.textContent || '').toLowerCase();
                const desc = (row.querySelector('.item-desc, p')?.textContent || '').toLowerCase();

                const matchesSearch = !query ||
                    title.includes(query) ||
                    desc.includes(query) ||
                    tags.includes(query) ||
                    groupCategory.includes(query);

                if (matchesCategory && matchesSearch) {
                    row.style.display = 'flex';
                    groupVisibleCount++;
                    totalVisible++;
                } else {
                    row.style.display = 'none';
                }
            });

            if (groupVisibleCount > 0) {
                group.style.display = 'block';
            } else {
                group.style.display = 'none';
            }
        });

        // 2. Filter Standalone Cards (if present)
        const standaloneCards = document.querySelectorAll('.resource-card');
        standaloneCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const tags = (card.getAttribute('data-tags') || '').toLowerCase();
            const title = (card.querySelector('h3, h4')?.textContent || '').toLowerCase();
            const desc = (card.querySelector('p')?.textContent || '').toLowerCase();

            const matchesCategory = currentCategory === 'all' || cardCategory === currentCategory;
            const matchesSearch = !query ||
                title.includes(query) ||
                desc.includes(query) ||
                tags.includes(query) ||
                cardCategory.includes(query);

            if (matchesCategory && matchesSearch) {
                card.style.display = 'flex';
                totalVisible++;
            } else {
                card.style.display = 'none';
            }
        });

        // Toggle clear search button visibility
        if (searchClearBtn) {
            if (query) {
                searchClearBtn.classList.add('visible');
            } else {
                searchClearBtn.classList.remove('visible');
            }
        }

        // Toggle No Results display
        if (noResults) {
            if (totalVisible === 0) {
                noResults.classList.remove('hidden');
            } else {
                noResults.classList.add('hidden');
            }
        }

        triggerLinksAnimation();
    }

    // Event Listeners for Category Pills
    categoryPills.forEach(pill => {
        pill.addEventListener('click', () => {
            categoryPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            currentCategory = pill.getAttribute('data-category');
            filterCards();
        });
    });

    // Event Listener for Live Search Input
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            filterCards();
        });
    }

    // Clear Search Input
    if (searchClearBtn) {
        searchClearBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            searchQuery = '';
            filterCards();
            searchInput?.focus();
        });
    }

    // Reset All Filters Button
    if (resetSearchBtn) {
        resetSearchBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            searchQuery = '';
            currentCategory = 'all';
            categoryPills.forEach(p => p.classList.remove('active'));
            if (categoryPills[0]) categoryPills[0].classList.add('active');
            filterCards();
        });
    }

    updateCategoryCounts();
    filterCards();
}

// Copy to Clipboard buttons for resource cards
function initCopyButtons() {
    const copyBtns = document.querySelectorAll('.copy-btn');

    copyBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const url = btn.getAttribute('data-url');
            if (!url) return;

            const fullUrl = url.startsWith('http') ? url : window.location.origin + '/' + url;

            try {
                await navigator.clipboard.writeText(fullUrl);
                showToast(`📋 Link copied to clipboard!`);
            } catch (err) {
                const tempInput = document.createElement('input');
                tempInput.value = fullUrl;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
                showToast(`📋 Link copied to clipboard!`);
            }
        });
    });
}

// SPA View Switcher: Toggle between Home View and Links View
function initViewSwitcher() {
    const mainSections = document.querySelectorAll('section:not(#links)');
    const linksSection = document.getElementById('links');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!linksSection || !mainSections.length) return;

    function updateViewMode() {
        const hash = window.location.hash;

        if (hash === '#links') {
            // Hide main home sections, show only links section
            mainSections.forEach(s => s.style.display = 'none');
            linksSection.style.display = 'block';

            // Mark nav link as active
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#links') {
                    link.classList.add('active');
                }
            });

            // Trigger entrance animations for link rows
            triggerLinksAnimation();

            window.scrollTo({ top: 0, behavior: 'instant' });
        } else {
            // Show main home sections, hide links section
            mainSections.forEach(s => s.style.display = '');
            linksSection.style.display = 'none';

            // Scroll to specific section if requested
            if (hash && hash !== '#' && hash !== '') {
                const target = document.querySelector(hash);
                if (target) {
                    setTimeout(() => {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }, 50);
                }
            }
        }
    }

    // Listen to hash changes (e.g. back/forward buttons or anchor clicks)
    window.addEventListener('hashchange', updateViewMode);

    // Handle clicks on links with hash targets or brand logo
    document.querySelectorAll('a[href^="#"], .brand-logo').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            if (href === '#links') {
                e.preventDefault();
                window.location.hash = '#links';
                updateViewMode();
            } else if (href === '#' || href === '' || !href) {
                e.preventDefault();
                window.location.hash = '';
                updateViewMode();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (href.startsWith('#')) {
                if (window.location.hash === '#links') {
                    e.preventDefault();
                    window.location.hash = href;
                    updateViewMode();
                }
            }
        });
    });

    // Initial check on load
    updateViewMode();
}

// Trigger smooth entrance animation for links and category groups
function triggerLinksAnimation() {
    const visibleGroups = document.querySelectorAll('.category-group');
    let delayCounter = 0;

    visibleGroups.forEach(group => {
        if (group.style.display !== 'none') {
            group.classList.remove('animate-in');
            void group.offsetWidth; // force reflow
            group.style.animationDelay = `${delayCounter * 0.08}s`;
            group.classList.add('animate-in');
            delayCounter++;

            const rows = group.querySelectorAll('.resource-item-row');
            rows.forEach((row, rowIdx) => {
                if (row.style.display !== 'none') {
                    row.classList.remove('animate-in');
                    void row.offsetWidth; // force reflow
                    row.style.animationDelay = `${(delayCounter * 0.08) + (rowIdx * 0.04)}s`;
                    row.classList.add('animate-in');
                }
            });
        }
    });
}



