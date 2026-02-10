// ============================================
// KiranaMitra — Interactive Landing Page JS
// ============================================

// ── Configuration ──
const GITHUB_RELEASES_URL = 'https://api.github.com/repos/hardikkanajariya-in/kiranamitra/releases';

// ── Fetch GitHub Releases ──
async function loadReleases() {
    const releasesList = document.getElementById('releases-list');

    try {
        const response = await fetch(GITHUB_RELEASES_URL, {
            headers: { 'Accept': 'application/vnd.github.v3+json' }
        });

        if (!response.ok) throw new Error('Failed to fetch releases');

        const releases = await response.json();

        if (releases.length === 0) {
            releasesList.innerHTML = '<p style="text-align:center;color:#64748B;">No releases available yet. Check back soon!</p>';
            return;
        }

        releasesList.innerHTML = releases.map(release => createReleaseCard(release)).join('');
    } catch (error) {
        console.error('Error loading releases:', error);
        releasesList.innerHTML = `
            <div style="text-align:center;color:#EF4444;padding:2rem;">
                <p>Could not load releases. <a href="https://github.com/hardikkanajariya-in/kiranamitra/releases" target="_blank" style="color:#6C3CE1;">View on GitHub</a></p>
            </div>
        `;
    }
}

function createReleaseCard(release) {
    const date = new Date(release.published_at);
    const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const badgeStyle = release.prerelease ? 'background:#F59E0B' : 'background:#10B981';
    const badgeText = release.prerelease ? 'Pre-release' : 'Stable';
    const apkAssets = release.assets.filter(asset => asset.name.endsWith('.apk'));

    const downloadButtons = apkAssets.length > 0
        ? apkAssets.map(asset => `
            <a href="${asset.browser_download_url}" class="download-btn" download>
                <i data-lucide="download" style="width:18px;height:18px;stroke:currentColor;"></i> ${asset.name}
                <span style="font-size:0.8rem;opacity:0.8">(${formatFileSize(asset.size)})</span>
            </a>
        `).join('')
        : '<p style="color:#64748B;">No APK files in this release</p>';

    const releaseNotes = release.body ? `<div class="release-notes">${linkifyReleaseNotes(release.body)}</div>` : '';

    return `
        <div class="release-card">
            <div class="release-header">
                <div>
                    <div class="release-title">${release.tag_name}</div>
                    <div class="release-date">${formattedDate}</div>
                </div>
                <span class="release-badge" style="${badgeStyle}">${badgeText}</span>
            </div>
            ${releaseNotes}
            <div class="download-buttons">${downloadButtons}</div>
        </div>
    `;
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(1) + ' ' + sizes[i];
}

function linkifyReleaseNotes(text) {
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/(?:\r\n|\r|\n)/g, '<br>');
    return text;
}

// ── FAQ Toggle ──
function toggleFaq(button) {
    const item = button.closest('.faq-item');
    const isActive = item.classList.contains('active');

    // Close all others
    document.querySelectorAll('.faq-item.active').forEach(el => el.classList.remove('active'));

    // Toggle current
    if (!isActive) item.classList.add('active');
}

// ── Scroll Animations ──
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay || '0');
                setTimeout(() => entry.target.classList.add('animate-in'), delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
}

// ── Counter Animation ──
function animateCounters() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count);
                const duration = 1500;
                const start = performance.now();

                function update(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
                    el.textContent = Math.round(target * eased);
                    if (progress < 1) requestAnimationFrame(update);
                }

                requestAnimationFrame(update);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-count]').forEach(el => observer.observe(el));
}

// ── Hero Particles ──
function createParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;

    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'hero-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.setProperty('--tx', (Math.random() - 0.5) * 200 + 'px');
        particle.style.setProperty('--ty', (Math.random() - 0.5) * 200 + 'px');
        particle.style.setProperty('--duration', (4 + Math.random() * 6) + 's');
        particle.style.animationDelay = Math.random() * 4 + 's';
        particle.style.width = (3 + Math.random() * 5) + 'px';
        particle.style.height = particle.style.width;
        container.appendChild(particle);
    }
}

// ── Navbar Scroll Effect ──
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
}

// ── Mobile Menu ──
function initMobileMenu() {
    const toggle = document.getElementById('mobileToggle');
    const links = document.getElementById('navLinks');

    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
        links.classList.toggle('active');
        toggle.classList.toggle('active');
    });

    // Close on link click
    links.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            links.classList.remove('active');
            toggle.classList.remove('active');
        });
    });
}

// ── Smooth Scroll ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// ── Initialize Everything ──
function init() {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    createParticles();
    initScrollAnimations();
    animateCounters();
    initNavbarScroll();
    initMobileMenu();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
