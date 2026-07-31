// experiment.js - Click-Only Card Stack Morphing Logic

let currentActiveSection = 'single'; // 'single' or 'unlimited'

function setActiveSection(section) {
  const layout = document.getElementById('expSection');
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

function handleCardClick(event, planName) {
  if (currentActiveSection !== 'single') {
    event.stopPropagation();
    setActiveSection('single');
    return;
  }
  
  event.stopPropagation();
  if (typeof openModal === 'function') {
    openModal(null, planName);
  }
}

function handleUnlimitedClick(event, planName, price) {
  if (currentActiveSection !== 'unlimited') {
    event.stopPropagation();
    setActiveSection('unlimited');
    return;
  }
  
  event.stopPropagation();
  window.location.href = `checkout.html?plan=${encodeURIComponent(planName)}&price=${price}`;
}

function selectExpSlot(el, slots) {
  if (event) event.stopPropagation();
  const parent = el.parentElement;
  if (!parent) return;
  const btns = parent.querySelectorAll('.toggle-btn');
  btns.forEach(b => b.classList.remove('active'));
  el.classList.add('active');
}

// Old User Pricing Toggle sync for experiment page
document.addEventListener('DOMContentLoaded', () => {
  const oldUserToggle = document.getElementById('toggle-old-user');
  const container = document.querySelector('.container');
  
  if (oldUserToggle && container) {
    const oldUserState = localStorage.getItem('isOldUser');
    if (oldUserState !== null) {
      const isOld = oldUserState === 'true';
      oldUserToggle.checked = isOld;
      if (isOld) container.classList.add('old-user-active');
    }
    
    oldUserToggle.addEventListener('change', function() {
      if (this.checked) {
        container.classList.add('old-user-active');
      } else {
        container.classList.remove('old-user-active');
      }
      localStorage.setItem('isOldUser', this.checked);
    });
  }
});
