// experiment.js - Morphing & Stacked Cards Logic

let hoverTimer = null;
let currentActiveSection = 'single'; // 'single' or 'unlimited'

function setActiveSection(section) {
  const layout = document.getElementById('expLayout');
  if (!layout) return;
  
  if (section === 'single') {
    layout.classList.remove('active-unlimited');
    layout.classList.add('active-single');
    currentActiveSection = 'single';
  } else if (section === 'unlimited') {
    layout.classList.remove('active-single');
    layout.classList.add('active-unlimited');
    currentActiveSection = 'unlimited';
  }
}

function handleHoverSection(section) {
  if (section === currentActiveSection) return;
  
  // Debounce hover activation by 150ms to prevent jittery activation
  clearTimeout(hoverTimer);
  hoverTimer = setTimeout(() => {
    setActiveSection(section);
  }, 150);
}

function handleCardClick(event, planName) {
  // If section is not active yet, active it first
  if (currentActiveSection !== 'single') {
    event.stopPropagation();
    setActiveSection('single');
    return;
  }
  
  // Call script.js openModal logic if single section is already active
  event.stopPropagation();
  if (typeof openModal === 'function') {
    openModal(null, planName);
  }
}

function handleUnlimitedClick(event, planName, price) {
  // If section is not active yet, active it first
  if (currentActiveSection !== 'unlimited') {
    event.stopPropagation();
    setActiveSection('unlimited');
    return;
  }
  
  event.stopPropagation();
  window.location.href = `checkout.html?plan=${encodeURIComponent(planName)}&price=${price}`;
}

// Old User Pricing Toggle sync for experiment page
document.addEventListener('DOMContentLoaded', () => {
  const oldUserToggle = document.getElementById('toggle-old-user');
  const expContainer = document.querySelector('.exp-container');
  
  if (oldUserToggle && expContainer) {
    const oldUserState = localStorage.getItem('isOldUser');
    if (oldUserState !== null) {
      const isOld = oldUserState === 'true';
      oldUserToggle.checked = isOld;
      if (isOld) expContainer.classList.add('old-user-active');
    }
    
    oldUserToggle.addEventListener('change', function() {
      if (this.checked) {
        expContainer.classList.add('old-user-active');
      } else {
        expContainer.classList.remove('old-user-active');
      }
      localStorage.setItem('isOldUser', this.checked);
    });
  }
});
