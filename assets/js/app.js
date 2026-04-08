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
