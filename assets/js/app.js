/* ════════════════════════════════
   Screen routing
════════════════════════════════ */
function show(id) {
  ['screen-login', 'screen-signup', 'screen-dashboard'].forEach(function (s) {
    document.getElementById(s).classList.toggle('hidden', s !== id);
  });
}

/* ════════════════════════════════
   Auth — Login
════════════════════════════════ */
function doLogin() {
  var email = document.getElementById('login-email').value.trim();
  var pass  = document.getElementById('login-pass').value.trim();
  var err   = document.getElementById('login-error');

  if (!email || !pass) {
    err.style.display = 'block';
    return;
  }

  err.style.display = 'none';

  var name = email
    .split('@')[0]
    .replace(/[._]/g, ' ')
    .replace(/\b\w/g, function (c) { return c.toUpperCase(); });

  setUser(name);
  show('screen-dashboard');
}

/* ════════════════════════════════
   Auth — Sign Up
════════════════════════════════ */
function doSignup() {
  var name  = document.getElementById('signup-name').value.trim();
  var email = document.getElementById('signup-email').value.trim();
  var pass  = document.getElementById('signup-pass').value.trim();
  var err   = document.getElementById('signup-error');

  if (!name || !email || !pass) {
    err.style.display = 'block';
    return;
  }

  err.style.display = 'none';
  setUser(name);
  show('screen-dashboard');
}

/* ════════════════════════════════
   Auth — Logout
════════════════════════════════ */
function doLogout() {
  document.getElementById('login-email').value = '';
  document.getElementById('login-pass').value  = '';
  show('screen-login');
}

/* ════════════════════════════════
   Set user name & initials
════════════════════════════════ */
function setUser(name) {
  var parts    = name.trim().split(' ');
  var initials = (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();

  document.getElementById('sb-name').textContent      = name;
  document.getElementById('sb-initials').textContent  = initials;
  document.getElementById('top-initials').textContent = initials;
}

/* ════════════════════════════════
   Sidebar navigation
════════════════════════════════ */
function setNav(el) {
  document.querySelectorAll('.nav-item').forEach(function (n) {
    n.classList.remove('active');
  });
  el.classList.add('active');
}

/* ════════════════════════════════
   Display today's date
════════════════════════════════ */
(function () {
  var d = new Date();
  document.getElementById('page-date').textContent = d.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
})();

/* ════════════════════════════════
   Enter key support for auth forms
════════════════════════════════ */
document.addEventListener('keydown', function (e) {
  if (e.key !== 'Enter') return;
  if (!document.getElementById('screen-login').classList.contains('hidden'))   doLogin();
  if (!document.getElementById('screen-signup').classList.contains('hidden'))  doSignup();
});

/* ════════════════════════════════════════════════════════
   DARK MODE
   Priority: localStorage override > daylight auto-detection
   Auto: dark from 19:00–07:00 (7 pm – 7 am)
   Manual toggle cycles: auto → dark → light → auto
════════════════════════════════════════════════════════ */
var themeAutoTimer = null;

/**
 * Returns true if the current local time is considered "night"
 * (between 19:00 and 07:00).
 */
function isDaytimeNow() {
  var h = new Date().getHours();
  return h >= 7 && h < 19;
}

/**
 * Apply a theme ('light' | 'dark') to the document,
 * without triggering the transition animation.
 */
function applyTheme(dark, skipTransition) {
  if (skipTransition) {
    document.body.classList.add('no-transition');
  }

  if (dark) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }

  if (skipTransition) {
    // Force reflow then re-enable transitions
    void document.body.offsetHeight;
    document.body.classList.remove('no-transition');
  }
}

/**
 * Update the toggle label to reflect current mode.
 * mode: 'auto' | 'dark' | 'light'
 */
function updateToggleLabel(mode) {
  var label = document.getElementById('theme-label');
  var badge = document.getElementById('auto-badge');
  if (!label) return;

  if (mode === 'auto') {
    label.childNodes[0].textContent = 'Auto';
    if (badge) badge.style.display = 'inline-block';
  } else if (mode === 'dark') {
    label.childNodes[0].textContent = 'Dark';
    if (badge) badge.style.display = 'none';
  } else {
    label.childNodes[0].textContent = 'Light';
    if (badge) badge.style.display = 'none';
  }
}

/**
 * Schedule the next auto theme flip at the exact minute
 * the threshold (07:00 or 19:00) is crossed.
 */
function scheduleNextAutoFlip() {
  if (themeAutoTimer) clearTimeout(themeAutoTimer);

  var now   = new Date();
  var h     = now.getHours();
  var m     = now.getMinutes();
  var s     = now.getSeconds();

  // Minutes until next threshold
  var msUntilNext;
  if (h >= 7 && h < 19) {
    // It's day — next flip is 19:00
    msUntilNext = ((19 - h - 1) * 60 + (60 - m - 1)) * 60000 + (60 - s) * 1000;
  } else {
    // It's night — next flip is 07:00 next occurrence
    var toMidnight = ((24 - h - 1) * 60 + (60 - m - 1)) * 60000 + (60 - s) * 1000;
    var fromMidnightTo7 = 7 * 3600000;
    msUntilNext = toMidnight + fromMidnightTo7;
  }

  themeAutoTimer = setTimeout(function () {
    // Only apply auto-flip if still in auto mode
    if (!localStorage.getItem('forexback-theme')) {
      applyTheme(!isDaytimeNow(), false);
    }
    scheduleNextAutoFlip();
  }, msUntilNext);
}

/**
 * Initialise theme on page load — no flash.
 * Called immediately (before paint) via inline script in <head>.
 */
function initTheme() {
  var saved = localStorage.getItem('forexback-theme'); // 'dark' | 'light' | null (auto)

  if (saved === 'dark') {
    applyTheme(true, true);
    updateToggleLabel('dark');
  } else if (saved === 'light') {
    applyTheme(false, true);
    updateToggleLabel('light');
  } else {
    // Auto mode — use daylight
    applyTheme(!isDaytimeNow(), true);
    updateToggleLabel('auto');
    scheduleNextAutoFlip();
  }
}

/**
 * Manual toggle handler.
 * Cycles: auto → dark → light → auto
 */
function toggleTheme() {
  var saved = localStorage.getItem('forexback-theme');
  var isDark = document.documentElement.getAttribute('data-theme') === 'dark';

  if (!saved) {
    // Was auto → force dark
    localStorage.setItem('forexback-theme', 'dark');
    applyTheme(true, false);
    updateToggleLabel('dark');
    if (themeAutoTimer) { clearTimeout(themeAutoTimer); themeAutoTimer = null; }
  } else if (saved === 'dark') {
    // Was forced dark → force light
    localStorage.setItem('forexback-theme', 'light');
    applyTheme(false, false);
    updateToggleLabel('light');
  } else {
    // Was forced light → back to auto
    localStorage.removeItem('forexback-theme');
    applyTheme(!isDaytimeNow(), false);
    updateToggleLabel('auto');
    scheduleNextAutoFlip();
  }
}

// Run immediately so there's no flash on load
initTheme();
