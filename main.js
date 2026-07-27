'use strict';
const GEMINI_KEY = 'AQ.Ab8RN6JNCNAUCQc3QYy4hD7SI8V6goEEslqNDAr2wdNlL8UmSQ';
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';
const SYSTEM_PROMPT = `You are VAFB Assistant, the official AI assistant of VAFB — Vietnam Association of Fashion & Beauty.
CORE ASSETS: (1) VAFB Accord — governance code; (2) Live Pre-Vetted B2B Directory — enterprise connection network; (3) Volume 0 Market Intelligence Report — independent research; (4) Strategic Advisory Services — firewalled and separate from research; (5) Annual Ecosystem Showcase platform.
KEY INFO: VAFB bridges fashion brands, cosmetic companies, designers, manufacturers, media, and KOLs/KOCs.
TONE: Professional, institutional, warm, concise — maximum 3 sentences per response. Direct inquiries to Contact page.`;

function imgFallback(el, label) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='480' height='480'>
    <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0%' stop-color='%234e2272'/><stop offset='100%' stop-color='%233d1a5e'/>
    </linearGradient></defs>
    <rect width='100%' height='100%' fill='url(%23g)'/>
    <text x='50%' y='50%' font-family='Montserrat, sans-serif' font-size='26' font-weight='700' fill='%23f5edd6' text-anchor='middle' dominant-baseline='middle'>${label}</text>
  </svg>`;
  el.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  el.onerror = null;
}

function initNavbar() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  window.addEventListener('scroll', () =>
    nav.classList.toggle('scrolled', window.scrollY > 40)
  , { passive: true });
}

let _mobOpen = false;
function toggleMenu() {
  _mobOpen = !_mobOpen;
  const menu = document.getElementById('mobMenu');
  const btn  = document.getElementById('burgerBtn');
  if (!menu || !btn) return;
  btn.classList.toggle('open', _mobOpen);
  if (_mobOpen) {
    menu.classList.add('show');
    requestAnimationFrame(() => requestAnimationFrame(() => menu.classList.add('open')));
    document.body.style.overflow = 'hidden';
  } else {
    _menuClose();
  }
}

function _menuClose() {
  if (!_mobOpen) return;
  _mobOpen = false;
  const menu = document.getElementById('mobMenu');
  const btn  = document.getElementById('burgerBtn');
  if (menu) { menu.classList.remove('open'); setTimeout(() => menu.classList.remove('show'), 260); }
  if (btn)  btn.classList.remove('open');
  document.body.style.overflow = '';
}

function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.rv').forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight * .96)
      el.classList.add('in');
    else
      obs.observe(el);
  });
}

function initRipple() {
  document.querySelectorAll('.pcard:not([data-rip])').forEach(card => {
    card.dataset.rip = '1';
    card.addEventListener('click', e => {
      const rect = card.getBoundingClientRect();
      const sz   = Math.max(rect.width, rect.height);
      const r    = document.createElement('span');
      r.className = 'ripple';
      r.style.cssText = `width:${sz}px;height:${sz}px;
        left:${e.clientX - rect.left - sz / 2}px;
        top:${e.clientY  - rect.top  - sz / 2}px;`;
      card.appendChild(r);
      setTimeout(() => r.remove(), 600);
    });
  });
}

function initTransition() {
  document.body.style.opacity    = '0';
  document.body.style.transition = 'opacity .28s ease';
  requestAnimationFrame(() =>
    requestAnimationFrame(() => { document.body.style.opacity = '1'; })
  );
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a) return;
    const h = a.getAttribute('href');
    if (!h || h.startsWith('#') || h.startsWith('http') || a.target === '_blank') return;
    e.preventDefault();
    document.body.style.opacity = '0';
    setTimeout(() => { window.location.href = h; }, 250);
  });
}

function toggleFaq(btn) {
  const ans = btn.nextElementSibling;
  const ico = btn.querySelector('.fq-ico');
  const was = ans.classList.contains('open');
  document.querySelectorAll('.faq-ans').forEach(a => a.classList.remove('open'));
  document.querySelectorAll('.faq-btn').forEach(b => {
    b.classList.remove('open');
    const i = b.querySelector('.fq-ico'); if (i) i.textContent = '+';
  });
  if (!was) { ans.classList.add('open'); btn.classList.add('open'); if (ico) ico.textContent = '−'; }
}

function filterProd(cat, btn) {
  document.querySelectorAll('.fbtn').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  document.querySelectorAll('.filterable').forEach(c => {
    c.classList.toggle('hidden', cat !== 'all' && c.dataset.cat !== cat);
  });
}

function submitForm() {
  const vals = ['fname','fphone','femail','fmsg'].map(id => {
    const el = document.getElementById(id); return el ? el.value.trim() : '';
  });
  if (vals.some(v => !v)) { alert('Please fill in all required fields.'); return; }
  const ok = document.getElementById('formOk');
  if (ok) { ok.style.display = 'block'; setTimeout(() => ok.style.display = 'none', 5000); }
}

/* ═══════════════════════════════
   AUTH MODAL & USER AVATAR BADGE CONTROL
═══════════════════════════════ */
function initAuthModal() {
  const modal = document.getElementById('authModal');
  const userRole = localStorage.getItem('vafb_user_role');
  
  if (userRole) {
    _showUserAvatar(userRole);
  } else if (modal && !sessionStorage.getItem('vafb_visited')) {
    setTimeout(() => {
      modal.classList.add('show');
    }, 600);
  }
}

function closeAuthModal() {
  const modal = document.getElementById('authModal');
  if (modal) {
    modal.classList.remove('show');
    sessionStorage.setItem('vafb_visited', 'true');
  }
}

function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  if (tab === 'login') {
    document.getElementById('tabLoginBtn').classList.add('active');
  } else {
    document.getElementById('tabRegisterBtn').classList.add('active');
  }
}

function handleAuthSubmit(e) {
  e.preventDefault();
  const typeSelect = document.getElementById('authType');
  const userType = typeSelect ? typeSelect.value : 'Enterprise User';
  
  localStorage.setItem('vafb_user_role', userType);
  _showUserAvatar(userType);
  closeAuthModal();
  alert(`Welcome! Account successfully authenticated as: ${userType}`);
}

function _showUserAvatar(roleName) {
  const badges = document.querySelectorAll('.nav-user-badge');
  const nameEls = document.querySelectorAll('.nav-user-name');
  badges.forEach(b => b.style.display = 'flex');
  nameEls.forEach(el => el.textContent = roleName);
}

/* ═══════════════════════════════
   HERO VIDEO CONTROL & AUTO-PLAY ENFORCEMENT
═══════════════════════════════ */
function toggleHeroVideo() {
  const video = document.getElementById('heroVideo');
  const btn = document.getElementById('videoToggleBtn');
  if (!video || !btn) return;
  
  if (video.paused) {
    video.play();
    btn.textContent = '⏸';
  } else {
    video.pause();
    btn.textContent = '▶';
  }
}

function initAutoPlayVideo() {
  const video = document.getElementById('heroVideo');
  if (video) {
    video.muted = true; // Bắt buộc muted mới Autoplay được trên mọi trình duyệt
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.log("Autoplay bị trình duyệt tạm chặn, kích hoạt lại khi có tương tác đầu tiên:", error);
        document.addEventListener('click', () => { 
          video.play(); 
        }, { once: true });
      });
    }
  }
}

/* ═══════════════════════════════
   CHATBOT ENGINE
═══════════════════════════════ */
let _chatHistory = [];
let _chatOpen    = false;

function initChat() {
  const fab   = document.getElementById('chatFab');
  const panel = document.getElementById('chatPanel');
  const xBtn  = document.getElementById('chatClose');
  const send  = document.getElementById('chatSend');
  const input = document.getElementById('chatInput');
  const badge = document.getElementById('chatBadge');
  if (!fab || !panel) return;
  setTimeout(() => { if (!_chatOpen && badge) badge.classList.remove('hide'); }, 3000);
  fab.addEventListener('click', () => {
    _chatOpen = !_chatOpen;
    panel.classList.toggle('open', _chatOpen);
    fab.classList.toggle('open', _chatOpen);
    if (badge) badge.classList.add('hide');
    if (_chatOpen) {
      setTimeout(() => input && input.focus(), 350);
      if (_chatHistory.length === 0) {
        _botMsg('Welcome to VAFB Executive Office! 👋 How can I assist you with our institutional services, VAFB Accord, or Market Intelligence Reports? ⚜️');
        setTimeout(_showSugs, 700);
      }
    }
  });
  if (xBtn) xBtn.addEventListener('click', () => {
    _chatOpen = false;
    panel.classList.remove('open');
    fab.classList.remove('open');
  });
  if (send)  send.addEventListener('click', _sendChat);
  if (input) {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); _sendChat(); }
    });
    input.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = Math.min(this.scrollHeight, 100) + 'px';
    });
  }
}

function _botMsg(text) {
  const msgs = document.getElementById('chatMsgs');
  if (!msgs) return;
  const now = new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' });
  const d = document.createElement('div');
  d.className = 'msg bot';
  d.innerHTML = `<div class="msg-bub">${text}</div><div class="msg-t">${now}</div>`;
  msgs.insertBefore(d, document.getElementById('typingInd'));
  msgs.scrollTop = msgs.scrollHeight;
}

function _userMsg(text) {
  const msgs = document.getElementById('chatMsgs');
  if (!msgs) return;
  const now = new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' });
  const d = document.createElement('div');
  d.className = 'msg user';
  d.innerHTML = `<div class="msg-bub">${text}</div><div class="msg-t">${now}</div>`;
  msgs.insertBefore(d, document.getElementById('typingInd'));
  msgs.scrollTop = msgs.scrollHeight;
}

function _showTyping() { const t = document.getElementById('typingInd'); if (t) { t.classList.add('show'); document.getElementById('chatMsgs').scrollTop = 999999; } }
function _hideTyping() { const t = document.getElementById('typingInd'); if (t) t.classList.remove('show'); }
function _showSugs()   { const s = document.getElementById('chatSugs'); if (s) s.style.display = 'flex'; }
function _hideSugs()   { const s = document.getElementById('chatSugs'); if (s) s.style.display = 'none'; }
function sendSuggestion(text) { _hideSugs(); _doSend(text); }

function _sendChat() {
  const inp = document.getElementById('chatInput');
  if (!inp) return;
  const text = inp.value.trim();
  if (!text) return;
  inp.value = ''; inp.style.height = 'auto';
  _doSend(text);
}

async function _doSend(text) {
  _hideSugs();
  _userMsg(text);
  _chatHistory.push({ role: 'user', parts: [{ text }] });
  const sendBtn = document.getElementById('chatSend');
  if (sendBtn) sendBtn.disabled = true;
  _showTyping();
  try {
    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-goog-api-key': GEMINI_KEY
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: _chatHistory,
        generationConfig: { maxOutputTokens: 300, temperature: 0.7 }
      })
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data  = await res.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Thank you for contacting VAFB. Please leave your details via our Contact page.';
    _hideTyping();
    _chatHistory.push({ role: 'model', parts: [{ text: reply }] });
    _botMsg(reply);
    if (_chatHistory.length <= 4) _showSugs();
  } catch (err) {
    _hideTyping();
    let reply = "Welcome to VAFB! How may I assist your enterprise regarding our institutional services or market intelligence? 👋";
    _chatHistory.push({ role: 'model', parts: [{ text: reply }] });
    setTimeout(() => {
        _botMsg(reply);
        if (_chatHistory.length <= 4) _showSugs();
    }, 400);
  } finally {
    if (sendBtn) sendBtn.disabled = false;
  }
}

function buildChatWidget() {
  if (document.getElementById('chatFab')) return;
  const tpl = `
  <button class="chat-fab" id="chatFab" aria-label="Chat with VAFB Assistant">
    <span class="chat-badge hide" id="chatBadge">1</span>
    <svg class="ico-chat" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    <svg class="ico-x" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  </button>
  <div class="chat-panel" id="chatPanel">
    <div class="chat-head">
      <div class="chat-ava"><img src="images/logo.png" alt="" onerror="this.parentElement.innerHTML='<span style=font-size:16px;color:%23fff;font-weight:800>VF</span>'"></div>
      <div>
        <div class="chat-hname">VAFB Smart Assistant ⚜️</div>
        <div class="chat-hsub"><span class="status-dot"></span> Executive Office Online</div>
      </div>
      <button class="chat-xbtn" id="chatClose">✕</button>
    </div>
    <div class="chat-msgs" id="chatMsgs">
      <div class="typing" id="typingInd"><div class="tdot"></div><div class="tdot"></div><div class="tdot"></div></div>
    </div>
    <div class="chat-sugs" id="chatSugs" style="display:none">
      <button class="sug" onclick="sendSuggestion('What is VAFB Accord?')">📋 Accord?</button>
      <button class="sug" onclick="sendSuggestion('What is Live B2B Directory?')">🤝 Directory?</button>
      <button class="sug" onclick="sendSuggestion('What is Volume 0 Report?')">📊 Volume 0?</button>
      <button class="sug" onclick="sendSuggestion('How to apply for Membership?')">✨ Membership?</button>
    </div>
    <div class="chat-in-row">
      <textarea class="chat-input" id="chatInput" placeholder="Ask about VAFB services..." rows="1"></textarea>
      <button class="chat-send" id="chatSend">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
      </button>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', tpl);
}

document.addEventListener('DOMContentLoaded', () => {
  initTransition();
  initNavbar();
  initReveal();
  initRipple();
  buildChatWidget();
  initChat();
  initAuthModal();
  initAutoPlayVideo();
  document.addEventListener('click', e => {
    if (!_mobOpen) return;
    const menu = document.getElementById('mobMenu');
    const btn  = document.getElementById('burgerBtn');
    if (menu && btn && !menu.contains(e.target) && !btn.contains(e.target)) _menuClose();
  });
  document.querySelectorAll('#mobMenu a').forEach(a => a.addEventListener('click', _menuClose));
});