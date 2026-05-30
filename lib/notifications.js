/* ==========================================================================
   SCODETTO ACADEMY - NOTIFICATIONS MODULE (Toast system)
   ========================================================================== */

// Global Toast Dispatcher (Bilingual alerts helper)
export function showToast(message, isError = false) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `system-toast ${isError ? 'toast-error' : ''}`;
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      ${isError ? '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>' : '<polyline points="20 6 9 17 4 12"/>'}
    </svg>
    <span style="font-family:'Cairo', sans-serif;">${message}</span>
  `;

  container.appendChild(toast);

  // Auto remove toast
  setTimeout(() => {
    toast.classList.add('toast-close-anim');
    toast.addEventListener('animationend', () => {
      toast.remove();
    });
  }, 4000);
}
