const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const themeLabel = themeToggle?.querySelector('.theme-label');
const themeMeta = document.querySelector('meta[name="theme-color"]');
function applyTheme(theme, persist = false) {
  const dark = theme === 'dark';
  root.dataset.theme = dark ? 'dark' : 'light';
  if (themeIcon) themeIcon.textContent = dark ? '☀' : '☾';
  if (themeLabel) themeLabel.textContent = dark ? 'Light mode' : 'Dark mode';
  if (themeToggle) {
    themeToggle.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    themeToggle.setAttribute('aria-pressed', String(dark));
    themeToggle.title = dark ? 'Switch to light theme' : 'Switch to dark theme';
  }
  if (themeMeta) themeMeta.content = dark ? '#101113' : '#f4f5f7';
  if (persist) {
    try { localStorage.setItem('samuel-portfolio-theme', dark ? 'dark' : 'light'); } catch (_) { /* Storage can be unavailable in private contexts. */ }
  }
}
let initialTheme = 'light';
try {
  const savedTheme = localStorage.getItem('samuel-portfolio-theme');
  initialTheme = savedTheme || (window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
} catch (_) { initialTheme = window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; }
applyTheme(initialTheme);
themeToggle?.addEventListener('click', () => applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true));

const scrollProgress = document.getElementById('scrollProgress');
function updateScrollProgress() {
  if (!scrollProgress) return;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  scrollProgress.style.width = `${Math.min(100, Math.max(0, progress))}%`;
}
window.addEventListener('scroll', updateScrollProgress, {passive:true});
window.addEventListener('resize', updateScrollProgress);
updateScrollProgress();

const GITHUB_USERNAME = 'samuelGebremedhn';
const menu = document.getElementById('menu');
const links = document.getElementById('links');
menu?.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  menu.textContent = open ? '×' : '☰';
});
links?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  links.classList.remove('open'); menu?.setAttribute('aria-expanded', 'false');
  if (menu) { menu.textContent = '☰'; menu.setAttribute('aria-label', 'Open menu'); }
}));

document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(b => b.classList.toggle('active', b === button));
  document.querySelectorAll('#projectGrid .project').forEach(card => card.hidden = filter !== 'all' && card.dataset.category !== filter);
}));
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const repoGrid = document.getElementById('repoGrid');
const repoStatus = document.getElementById('repoStatus');
const featuredNames = new Set(['dronesimlite','modelpilot','studyforge','anomalylens','gesturearena','parkinsontremorseverity','eegemotionneurodata']);
const normalizeRepoName = value => String(value ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');
const safeText = value => String(value ?? '');
const escapeHtml = value => safeText(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
function repoCard(repo) {
  const description = repo.description || 'Public repository by Samuel Gebremedhn.';
  const language = repo.language || 'Project';
  const updated = repo.updated_at ? new Date(repo.updated_at).toLocaleDateString(undefined, {year:'numeric', month:'short'}) : '';
  return `<article class="repo-card"><div class="repo-card-top"><span class="repo-mark">⌘</span><span class="repo-visibility">${repo.fork ? 'FORK' : 'PUBLIC'}</span></div><h3><a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${escapeHtml(repo.name)} ↗</a></h3><p>${escapeHtml(description)}</p><div class="repo-meta"><span>${escapeHtml(language)}</span><span>★ ${Number(repo.stargazers_count) || 0}</span>${updated ? `<span>Updated ${escapeHtml(updated)}</span>` : ''}</div></article>`;
}
async function loadRepositories() {
  if (!repoGrid || !repoStatus) return;
  try {
    const response = await fetch(`https://api.github.com/users/${encodeURIComponent(GITHUB_USERNAME)}/repos?per_page=100&sort=updated&type=owner`, {headers:{'Accept':'application/vnd.github+json'}});
    if (!response.ok) throw new Error(response.status === 403 ? 'GitHub API rate limit reached. Please try again later.' : `GitHub returned ${response.status}.`);
    const repos = await response.json();
    const owned = repos.filter(repo => !repo.archived && !repo.disabled && !featuredNames.has(normalizeRepoName(repo.name))).slice(0, 12);
    // Point featured cards to matching repositories when those repositories exist.
    for (const link of document.querySelectorAll('[data-repo-match]')) {
      const match = repos.find(repo => normalizeRepoName(repo.name) === normalizeRepoName(link.dataset.repoMatch));
      if (match) { link.href = match.html_url; link.target = '_blank'; link.rel = 'noopener noreferrer'; }
    }
    if (!owned.length) {
      repoStatus.textContent = 'Your selected projects are highlighted above. Browse GitHub for the full repository list.';
      return;
    }
    repoGrid.innerHTML = owned.map(repoCard).join('');
    repoStatus.textContent = `Showing ${owned.length} recent public ${owned.length === 1 ? 'repository' : 'repositories'} · synced from GitHub when this page loads.`;
  } catch (error) {
    repoStatus.textContent = `Could not load repositories automatically. ${error.message} You can still view all projects on GitHub.`;
  }
}
loadRepositories();

const sectionLinks = [...document.querySelectorAll('#links a[href^="#"]')];
if ('IntersectionObserver' in window && sectionLinks.length) {
  const sections = sectionLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  const sectionObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      sectionLinks.forEach(link => {
        const active = link.getAttribute('href') === `#${entry.target.id}`;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }
  }, {rootMargin:'-25% 0px -65% 0px', threshold:0});
  sections.forEach(section => sectionObserver.observe(section));
}
