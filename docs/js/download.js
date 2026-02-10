// Fetch releases from GitHub API and display them
async function loadReleases() {
    const releasesList = document.getElementById('releases-list');

    try {
        const response = await fetch(
            'https://api.github.com/repos/hardikkanajariya-in/kiranamitra/releases',
            {
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch releases');
        }

        const releases = await response.json();

        if (releases.length === 0) {
            releasesList.innerHTML = '<p style="text-align: center; color: #666;">No releases available yet. Check back soon!</p>';
            return;
        }

        releasesList.innerHTML = releases.map(release => createReleaseCard(release)).join('');
    } catch (error) {
        console.error('Error loading releases:', error);
        releasesList.innerHTML = `
            <div style="text-align: center; color: #d32f2f; padding: 2rem;">
                <p>Could not load releases. <a href="https://github.com/hardikkanajariya-in/kiranamitra/releases" target="_blank">View on GitHub</a></p>
            </div>
        `;
    }
}

function createReleaseCard(release) {
    const date = new Date(release.published_at);
    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    const isPrerelease = release.prerelease ? '<span class="release-badge" style="background: #ff6f00;">Pre-release</span>' : '';
    const isDraft = release.draft ? '<span class="release-badge" style="background: #999;">Draft</span>' : '<span class="release-badge">Stable</span>';

    // Find APK assets
    const apkAssets = release.assets.filter(asset => asset.name.endsWith('.apk'));

    const downloadButtons = apkAssets.length > 0
        ? apkAssets.map(asset => `
            <a href="${asset.browser_download_url}" class="download-btn" download>
                📥 ${asset.name}
                <span style="font-size: 0.8rem;">(${formatFileSize(asset.size)})</span>
            </a>
        `).join('')
        : '<p style="color: #666;">No APK assets found</p>';

    const releaseNotes = release.body ?
        `<div class="release-notes">${linkifyReleaseNotes(release.body)}</div>` :
        '';

    return `
        <div class="release-card">
            <div class="release-header">
                <div>
                    <div class="release-title">${release.tag_name}</div>
                    <div class="release-date">${formattedDate}</div>
                </div>
                <div>
                    ${isPrerelease}
                    ${isDraft}
                </div>
            </div>
            ${releaseNotes}
            <div class="download-buttons">
                ${downloadButtons}
            </div>
        </div>
    `;
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 10) / 10 + ' ' + sizes[i];
}

function linkifyReleaseNotes(text) {
    // Convert markdown-style links to HTML
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    // Convert bold text
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // Convert line breaks to <br>
    text = text.replace(/(?:\r\n|\r|\n)/g, '<br>');
    return text;
}

// Load releases when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadReleases);
} else {
    loadReleases();
}

// Smooth scroll for anchor links (fallback if CSS scroll-behavior not supported)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
