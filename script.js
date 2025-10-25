/* Basic UI logic: toggle forms, theme panel, theme customization, simple validation.
   This script does not connect to a server; replace with real auth calls as needed.
*/

(() => {
  // Elements
  const switchLogin = document.getElementById('switchLogin');
  const switchSignup = document.getElementById('switchSignup');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const themePanel = document.getElementById('themePanel');
  const openTheme = document.getElementById('openTheme');
  const closeTheme = document.getElementById('closeTheme');
  const saveTheme = document.getElementById('saveTheme');
  const resetTheme = document.getElementById('resetTheme');

  // Switch forms
  function showLogin() {
    switchLogin.classList.add('active');
    switchSignup.classList.remove('active');
    loginForm.classList.add('active');
    signupForm.classList.remove('active');
    loginForm.querySelector('input')?.focus();
  }
  function showSignup() {
    switchSignup.classList.add('active');
    switchLogin.classList.remove('active');
    signupForm.classList.add('active');
    loginForm.classList.remove('active');
    signupForm.querySelector('input')?.focus();
  }

  switchLogin.addEventListener('click', (e) => { e.preventDefault(); showLogin(); });
  switchSignup.addEventListener('click', (e) => { e.preventDefault(); showSignup(); });

  // Theme panel toggle
  openTheme.addEventListener('click', () => {
    themePanel.setAttribute('aria-hidden','false');
  });
  closeTheme.addEventListener('click', () => {
    themePanel.setAttribute('aria-hidden','true');
  });

  // Theme controls
  const modeButtons = Array.from(document.querySelectorAll('.mode'));
  const accentButtons = Array.from(document.querySelectorAll('.accent'));
  const motionButtons = Array.from(document.querySelectorAll('.motion'));

  // Load saved theme from localStorage
  const saved = JSON.parse(localStorage.getItem('ui_theme') || '{}');

  function applySavedTheme() {
    const mode = saved.mode || 'dark';
    const accent = saved.accent || 'blue';
    const motion = saved.motion || 'full';

    setMode(mode);
    setAccent(accent);
    setMotion(motion);
  }

  // Mode set / active UI
  function setMode(m) {
    if (m === 'light') document.documentElement.classList.add('light');
    else document.documentElement.classList.remove('light');

    modeButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.mode === m));
  }

  // Accent set
  function setAccent(a) {
    // set data attribute on :root (documentElement) so CSS variable rule picks it up
    document.documentElement.setAttribute('data-accent', a);
    accentButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.accent === a));
  }

  // Motion set
  function setMotion(m) {
    if (m === 'reduced') {
      document.documentElement.style.setProperty('--duration', '0ms');
    } else {
      document.documentElement.style.removeProperty('--duration');
    }
    motionButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.motion === m));
  }

  // Attach UI click handlers
  modeButtons.forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));
  accentButtons.forEach(b => b.addEventListener('click', () => setAccent(b.dataset.accent)));
  motionButtons.forEach(b => b.addEventListener('click', () => setMotion(b.dataset.motion)));

  // Save / reset theme
  saveTheme.addEventListener('click', () => {
    const mode = modeButtons.find(b => b.classList.contains('active'))?.dataset.mode || 'dark';
    const accent = accentButtons.find(b => b.classList.contains('active'))?.dataset.accent || 'blue';
    const motion = motionButtons.find(b => b.classList.contains('active'))?.dataset.motion || 'full';
    const toSave = { mode, accent, motion };
    localStorage.setItem('ui_theme', JSON.stringify(toSave));
    // persist to variables too
    setMode(mode); setAccent(accent); setMotion(motion);
    themePanel.setAttribute('aria-hidden','true');
  });

  resetTheme.addEventListener('click', () => {
    localStorage.removeItem('ui_theme');
    // fallback to defaults
    setMode('dark');
    setAccent('blue');
    setMotion('full');
  });

  // initialize visible active states based on saved or defaults
  applySavedTheme();

  // Form submission (fake) + front-end validation
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = loginForm.email.value.trim();
    const password = loginForm.password.value;
    if (!validateEmail(email)) {
      alert('Please enter a valid email.');
      return;
    }
    if (password.length < 6) {
      alert('Password must be at least 6 characters.');
      return;
    }
    // Simulate success animation
    successFeedback(loginForm, 'Signed in successfully — redirecting...');
  });

  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = signupForm.name.value.trim();
    const email = signupForm.email.value.trim();
    const pw = signupForm.password.value;
    const cpw = signupForm.confirmPassword.value;
    if (name.length < 2) { alert('Please enter your name.'); return; }
    if (!validateEmail(email)) { alert('Please enter a valid email.'); return; }
    if (pw.length < 6) { alert('Password must be at least 6 characters.'); return; }
    if (pw !== cpw) { alert('Passwords do not match.'); return; }

    successFeedback(signupForm, 'Account created — welcome 🎉');
  });

  function validateEmail(email){
    return /\S+@\S+\.\S+/.test(email);
  }

  function successFeedback(form, msg){
    const btn = form.querySelector('.btn.primary');
    const orig = btn.innerHTML;
    btn.innerHTML = '✓ ' + msg;
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.disabled = false;
      // tiny success effect
      form.animate([{opacity:1, transform:'translateY(0)'}, {opacity:0.98, transform:'translateY(-6px)'}, {opacity:1, transform:'translateY(0)'}], { duration: 450, easing:'ease-out' });
    }, 1100);
  }

  // Start with login visible
  showLogin();

  // Accessibility: close theme panel with ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') themePanel.setAttribute('aria-hidden','true');
  });

})();
