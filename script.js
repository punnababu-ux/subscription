// Handle plan selection in the Single Job section
function selectPlan(selectedCard) {
  // Reset all cards in the single job section
  const cards = document.querySelectorAll('.single-jobs-cards .card');
  cards.forEach(card => {
    card.classList.remove('premium');
    card.classList.add('bordered');
  });

  // Highlight the hovered card
  selectedCard.classList.remove('bordered');
  selectedCard.classList.add('premium');
}

// Reset focus back to the default Premium card when mouse leaves the cards area
function resetToDefault() {
  const cards = document.querySelectorAll('.single-jobs-cards .card');
  
  // Reset all to bordered
  cards.forEach(card => {
    card.classList.remove('premium');
    card.classList.add('bordered');
  });

  // Highlight the middle (Premium job) card which is the 2nd card (index 1)
  if (cards.length > 1) {
    const premiumCard = cards[1];
    premiumCard.classList.remove('bordered');
    premiumCard.classList.add('premium');
  }
}

// --- Upsell Modal Logic ---
let currentBasePrice = 0;
let currentPlanName = "";

function openModal(planName, basePrice) {
  currentBasePrice = basePrice;
  currentPlanName = planName;
  
  // Update Plan Names inside the cards
  const nameSpans = document.querySelectorAll('.upsell-plan-name');
  nameSpans.forEach(span => span.textContent = planName);
  
  // Update Prices
  // 1 Job
  document.getElementById('upsell-1-price').textContent = `₹${basePrice.toLocaleString('en-IN')}`;
  
  // 4 Jobs (10% off)
  const price4Old = basePrice * 4;
  const price4New = Math.round(price4Old * 0.9);
  const save4 = price4Old - price4New;
  document.getElementById('upsell-4-old').textContent = `₹${price4Old.toLocaleString('en-IN')}`;
  document.getElementById('upsell-4-price').textContent = `₹${price4New.toLocaleString('en-IN')}`;
  document.getElementById('upsell-4-save').textContent = `Save ₹${save4.toLocaleString('en-IN')}`;
  
  // 8 Jobs (20% off)
  const price8Old = basePrice * 8;
  const price8New = Math.round(price8Old * 0.8);
  const save8 = price8Old - price8New;
  document.getElementById('upsell-8-old').textContent = `₹${price8Old.toLocaleString('en-IN')}`;
  document.getElementById('upsell-8-price').textContent = `₹${price8New.toLocaleString('en-IN')}`;
  document.getElementById('upsell-8-save').textContent = `Save ₹${save8.toLocaleString('en-IN')}`;
  
  // Show Modal
  document.getElementById('upsellModal').classList.add('show');
  
  // Reset selection to 1 Job card by default
  const cards = document.querySelectorAll('.upsell-card');
  cards.forEach(c => c.classList.remove('active'));
  cards[0].classList.add('active');
}

function closeModal() {
  document.getElementById('upsellModal').classList.remove('show');
}

function goToCheckout() {
  const activeCard = document.querySelector('.upsell-card.active');
  let count = 1;
  let finalPrice = currentBasePrice;

  if (activeCard) {
    if (activeCard.innerText.includes('4 Premium') || activeCard.innerText.includes('4 Classic') || activeCard.innerText.includes('4 Super')) {
      count = 4;
      finalPrice = Math.round(currentBasePrice * 4 * 0.9);
    } else if (activeCard.innerText.includes('8 Premium') || activeCard.innerText.includes('8 Classic') || activeCard.innerText.includes('8 Super')) {
      count = 8;
      finalPrice = Math.round(currentBasePrice * 8 * 0.8);
    } else {
      count = 1;
      finalPrice = currentBasePrice;
    }
  }

  window.location.href = `checkout.html?plan=${encodeURIComponent(currentPlanName)}&count=${count}&price=${finalPrice}`;
}

function selectUpsell(card, count) {
  // Update active state on the cards
  const cards = document.querySelectorAll('.upsell-card');
  cards.forEach(c => c.classList.remove('active'));
  card.classList.add('active');
}
