// global-buttons.js
// Safely wire common button behaviors across all pages and add gentle fallbacks
(function () {
  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function safeNotify(msg) {
    if (typeof window.showNotification === 'function') {
      try { window.showNotification(msg, 'info'); return; } catch (e) {}
    }
    if (typeof window.showPopup === 'function') {
      try { window.showPopup(msg); return; } catch (e) {}
    }
    try { alert(msg); } catch (e) {}
  }

  onReady(function () {
    // Generic navigation for any element with data-url (cards, buttons, etc.)
    document.querySelectorAll('[data-url]').forEach(function (el) {
      if (el.getAttribute('data-url-bound')) return;
      var navigate = function () {
        var url = el.getAttribute('data-url');
        if (url) window.location.href = url;
      };
      el.addEventListener('click', navigate);
      // Basic keyboard accessibility
      if (typeof el.getAttribute('tabindex') === 'string') {
        // leave as-is if author already set
      } else {
        el.setAttribute('tabindex', '0');
      }
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate();
        }
      });
      el.setAttribute('data-url-bound', '1');
    });

    // Back to Home fallback
    var backBtn = document.getElementById('backToHomeBtn');
    if (backBtn && !backBtn.getAttribute('data-bound')) {
      backBtn.addEventListener('click', function () {
        window.location.href = './index.html';
      });
      backBtn.setAttribute('data-bound', '1');
    }

    // Admin/Faculty logout fallback
    var logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn && !logoutBtn.getAttribute('data-bound')) {
      logoutBtn.addEventListener('click', function () {
        try { localStorage.removeItem('lms_current_user'); } catch (e) {}
        window.location.href = './index.html';
      });
      logoutBtn.setAttribute('data-bound', '1');
    }

    // Student logout fallback
    var studentLogoutBtn = document.getElementById('studentLogoutBtn');
    if (studentLogoutBtn && !studentLogoutBtn.getAttribute('data-bound')) {
      studentLogoutBtn.addEventListener('click', function () {
        try { localStorage.removeItem('lms_current_student'); } catch (e) {}
        window.location.href = './student-login.html';
      });
      studentLogoutBtn.setAttribute('data-bound', '1');
    }

    // Buttons with data-url attribute
    document.querySelectorAll('button[data-url]').forEach(function (btn) {
      if (btn.getAttribute('data-bound')) return;
      btn.addEventListener('click', function () {
        var url = btn.getAttribute('data-url');
        if (url) window.location.href = url;
      });
      btn.setAttribute('data-bound', '1');
    });

    // Gentle fallback for any remaining plain buttons without explicit handlers
    document.querySelectorAll('button').forEach(function (btn) {
      if (btn.disabled) return;
      if (btn.getAttribute('onclick')) return; // respect inline handlers
      if (btn.getAttribute('data-bound')) return; // already wired by this script
      // If inside a form and type is submit/reset, let browser handle it
      var type = (btn.getAttribute('type') || 'submit').toLowerCase();
      if (type !== 'button') return;
      btn.addEventListener('click', function () {
        safeNotify('This action is not implemented yet.');
      });
      btn.setAttribute('data-bound', '1');
    });
  });
})();
