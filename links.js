// Helpful Links & Resource Hub Script
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (window.lucide) {
        try {
            lucide.createIcons();
        } catch (e) {
            console.error('Lucide init error:', e);
        }
    }

    initMobileNav();
    initResourceDirectory();
    initCopyButtons();
});

// Mobile Navbar Toggle
function initMobileNav() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
            });
        });
    }
}

// Resource Directory Filtering & Live Search
function initResourceDirectory() {
    const searchInput = document.getElementById('linkSearchInput');
    const searchClearBtn = document.getElementById('searchClearBtn');
    const categoryPills = document.querySelectorAll('.pill-btn');
    const resourceRows = document.querySelectorAll('.resource-item-row');
    const categoryGroups = document.querySelectorAll('.category-group');
    const noResults = document.getElementById('noResults');
    const resetSearchBtn = document.getElementById('resetSearchBtn');

    let currentCategory = 'all';
    let searchQuery = '';

    // Calculate category counts
    function updateCategoryCounts() {
        const counts = {
            'all': resourceRows.length,
            'cad': 0,
            'coding': 0
        };

        resourceRows.forEach(row => {
            const cat = row.getAttribute('data-category');
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

    // Filter rows & category groups
    function filterCards() {
        let visibleCount = 0;
        const query = searchQuery.trim().toLowerCase();

        categoryGroups.forEach(group => {
            const groupRows = group.querySelectorAll('.resource-item-row');
            let visibleInGroup = 0;

            groupRows.forEach(row => {
                const rowCategory = row.getAttribute('data-category');
                const tags = (row.getAttribute('data-tags') || '').toLowerCase();
                const title = (row.querySelector('.item-title')?.textContent || '').toLowerCase();
                const desc = (row.querySelector('.item-desc')?.textContent || '').toLowerCase();

                const matchesCategory = currentCategory === 'all' || rowCategory === currentCategory;
                const matchesSearch = !query ||
                    title.includes(query) ||
                    desc.includes(query) ||
                    tags.includes(query) ||
                    rowCategory.includes(query);

                if (matchesCategory && matchesSearch) {
                    row.style.display = 'flex';
                    visibleInGroup++;
                    visibleCount++;
                } else {
                    row.style.display = 'none';
                }
            });

            if (visibleInGroup > 0) {
                group.style.display = 'block';
            } else {
                group.style.display = 'none';
            }
        });

        // Toggle clear search button visibility
        if (query) {
            searchClearBtn?.classList.add('visible');
        } else {
            searchClearBtn?.classList.remove('visible');
        }

        // Toggle No Results display
        if (visibleCount === 0) {
            noResults?.classList.remove('hidden');
        } else {
            noResults?.classList.add('hidden');
        }
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
            categoryPills[0]?.classList.add('active');
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
                // Fallback for older browsers
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

// Toast notification display
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
