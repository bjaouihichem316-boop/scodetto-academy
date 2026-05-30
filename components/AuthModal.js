/* ==========================================================================
   AUTHENTICATION MODAL — 4-DIGIT PIN FLOW
   Step 1 : Choose portal type (Parent | Coach)
   Step 2A: Parent → select child name from roster
   Step 2B: Coach  → select identity (Mohamed | Monta)
   Step 3 : Shared 4-digit PIN pad (validates against state.validatePin)
   ========================================================================== */

import { state } from '../state.js';
import { showToast } from '../lib/notifications.js';
import { loginUser, validatePin } from '../lib/auth.js';

export function initAuthModal() {
  const modal = document.getElementById('auth-modal');
  const btnOpen = document.getElementById('btn-open-login');
  const btnClose = document.getElementById('btn-close-login');
  if (!modal) return;

  // ── Internal flow state ────────────────────────────────────────────────────
  let pendingRole = null;        // 'parent' | 'admin'
  let pendingIdentifier = null;  // parentName or coachId ('mohamed'|'monta')
  let pendingDisplayName = null; // human-friendly name for toast
  let pinBuffer = '';            // accumulates 4 digits

  // ── Step visibility helpers ────────────────────────────────────────────────
  const STEPS = ['auth-step-portal', 'auth-step-parent', 'auth-step-coach', 'auth-step-pin'];
  const showStep = (id) => {
    STEPS.forEach(s => {
      const el = modal.querySelector(`#${s}`);
      if (el) el.style.display = s === id ? '' : 'none';
    });
  };

  const resetModal = () => {
    pendingRole = pendingIdentifier = pendingDisplayName = null;
    pinBuffer = '';
    renderPinDots();
    showStep('auth-step-portal');
    const errEl = modal.querySelector('#pin-error-msg');
    if (errEl) errEl.textContent = '';
  };

  // ── Open / Close ───────────────────────────────────────────────────────────
  const closeModal = () => {
    modal.classList.add('dialog-close-anim');
    setTimeout(() => {
      modal.close();
      modal.classList.remove('dialog-close-anim');
      resetModal();
    }, 220);
  };

  btnOpen?.addEventListener('click', () => { resetModal(); modal.showModal(); });
  btnClose?.addEventListener('click', closeModal);

  // Light-dismiss backdrop
  modal.addEventListener('click', (e) => {
    const rect = modal.getBoundingClientRect();
    if (e.clientX < rect.left || e.clientX > rect.right ||
        e.clientY < rect.top  || e.clientY > rect.bottom) {
      closeModal();
    }
  });

  // ── STEP 1: Portal selection ───────────────────────────────────────────────
  modal.querySelector('#btn-login-parent')?.addEventListener('click', () => {
    pendingRole = 'parent';
    buildParentStep();
    showStep('auth-step-parent');
  });

  modal.querySelector('#btn-login-admin')?.addEventListener('click', () => {
    pendingRole = 'admin';
    showStep('auth-step-coach');
  });

  // ── STEP 2A: Build parent child-selector dynamically from roster ───────────
  const buildParentStep = () => {
    const listEl = modal.querySelector('#parent-child-list');
    if (!listEl) return;

    // Collect all parents from the full private roster (coach state)
    // We only expose the name list — no profile data leaks here
    const rosterParents = state.roster.map(p => ({ parentName: p.parent, childName: p.name, group: p.group }));
    // De-duplicate (a parent might have multiple kids)
    const seen = new Set();
    const unique = rosterParents.filter(p => {
      if (seen.has(p.parentName)) return false;
      seen.add(p.parentName);
      return true;
    });

    listEl.innerHTML = unique.map(p => `
      <button class="child-selector-btn" data-parent="${p.parentName}" data-child="${p.childName}">
        <span class="child-selector-avatar">${p.childName.split(' ').map(n => n[0]).join('').slice(0,2)}</span>
        <span class="child-selector-info">
          <strong>${p.childName}</strong>
          <small>${p.group} &bull; Parent: ${p.parentName}</small>
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
      </button>
    `).join('');

    listEl.querySelectorAll('.child-selector-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        pendingIdentifier  = btn.dataset.parent;
        pendingDisplayName = btn.dataset.parent;
        buildPinStep(`Code PIN de ${btn.dataset.parent} / رمز PIN لـ ${btn.dataset.parent}`);
        showStep('auth-step-pin');
      });
    });
  };

  // Back button from parent step
  modal.querySelector('#btn-parent-back')?.addEventListener('click', () => showStep('auth-step-portal'));

  // ── STEP 2B: Coach identity selection ─────────────────────────────────────
  modal.querySelector('#btn-login-coach-mohamed')?.addEventListener('click', () => {
    pendingIdentifier  = 'mohamed';
    pendingDisplayName = 'Coach Mohamed';
    buildPinStep('Code PIN Coach Mohamed / رمز PIN المدرب محمد');
    showStep('auth-step-pin');
  });

  modal.querySelector('#btn-login-coach-monta')?.addEventListener('click', () => {
    pendingIdentifier  = 'monta';
    pendingDisplayName = 'Coach Monta';
    buildPinStep('Code PIN Coach Monta / رمز PIN المدرب مونتة');
    showStep('auth-step-pin');
  });

  // Back button from coach step
  modal.querySelector('#btn-coach-back')?.addEventListener('click', () => showStep('auth-step-portal'));

  // ── STEP 3: PIN Pad ────────────────────────────────────────────────────────
  const buildPinStep = (label) => {
    const labelEl = modal.querySelector('#pin-step-label');
    if (labelEl) labelEl.textContent = label;
    pinBuffer = '';
    renderPinDots();
    const errEl = modal.querySelector('#pin-error-msg');
    if (errEl) errEl.textContent = '';
  };

  const renderPinDots = () => {
    const dots = modal.querySelectorAll('.pin-dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('filled', i < pinBuffer.length);
    });
    // Show submit button only when 4 digits entered
    const submitBtn = modal.querySelector('#btn-pin-submit');
    if (submitBtn) submitBtn.disabled = pinBuffer.length < 4;
  };

  const appendPinDigit = (digit) => {
    if (pinBuffer.length >= 4) return;
    pinBuffer += digit;
    renderPinDots();
    // Auto-submit when 4 digits reached
    if (pinBuffer.length === 4) {
      setTimeout(() => submitPin(), 180);
    }
  };

  const deletePinDigit = () => {
    pinBuffer = pinBuffer.slice(0, -1);
    renderPinDots();
  };

  const submitPin = () => {
    const valid = validatePin(pendingIdentifier, pinBuffer);
    if (!valid) {
      // Wrong PIN — shake + error
      const pinDotsRow = modal.querySelector('.pin-dots-row');
      if (pinDotsRow) {
        pinDotsRow.classList.add('pin-shake');
        setTimeout(() => pinDotsRow.classList.remove('pin-shake'), 500);
      }
      const errEl = modal.querySelector('#pin-error-msg');
      if (errEl) errEl.textContent = 'Code PIN incorrect. / رمز PIN خاطئ.';
      pinBuffer = '';
      renderPinDots();
      return;
    }

    // Valid — log in and close
    closeModal();
    loginUser(pendingRole, pendingDisplayName);
  };

  // Bind PIN pad digit buttons
  modal.querySelectorAll('.pin-key[data-digit]').forEach(btn => {
    btn.addEventListener('click', () => appendPinDigit(btn.dataset.digit));
  });

  // Delete key
  modal.querySelector('.pin-key-del')?.addEventListener('click', deletePinDigit);

  // Submit button (backup for manual confirm)
  modal.querySelector('#btn-pin-submit')?.addEventListener('click', submitPin);

  // Back from PIN step
  modal.querySelector('#btn-pin-back')?.addEventListener('click', () => {
    pinBuffer = '';
    renderPinDots();
    if (pendingRole === 'parent') {
      showStep('auth-step-parent');
    } else {
      showStep('auth-step-coach');
    }
  });

  // Physical keyboard support
  modal.addEventListener('keydown', (e) => {
    if (!modal.open) return;
    const step = STEPS.find(s => {
      const el = modal.querySelector(`#${s}`);
      return el && el.style.display !== 'none';
    });
    if (step !== 'auth-step-pin') return;
    if (e.key >= '0' && e.key <= '9') appendPinDigit(e.key);
    if (e.key === 'Backspace') deletePinDigit();
    if (e.key === 'Enter' && pinBuffer.length === 4) submitPin();
  });
}
