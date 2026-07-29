// plans.js - Interactive logic for the Explore Plans page

document.addEventListener('DOMContentLoaded', () => {
  // Job slots pill toggling
  const toggleBtns = document.querySelectorAll('.job-slots-toggle .toggle-btn');
  
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all
      toggleBtns.forEach(b => b.classList.remove('active'));
      // Add to clicked
      btn.classList.add('active');
    });
  });

  // City toggle logic
  const cityBtns = document.querySelectorAll('.city-toggle span');
  cityBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      cityBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // FAQ Accordion logic
  // Handled inline in HTML with onclick="this.classList.toggle('open')"
});
