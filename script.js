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

function openModal(cardElement, planName, basePrice) {
  currentBasePrice = basePrice;
  currentPlanName = planName;
  
  const toggle = document.getElementById('toggle-monthly');
  if (toggle && toggle.checked) {
    // Show old quantity upsell modal
    const nameSpans = document.querySelectorAll('.upsell-plan-name');
    nameSpans.forEach(span => span.textContent = planName);
    
    document.getElementById('upsell-1-price').textContent = `₹${basePrice.toLocaleString('en-IN')}`;
    
    // Reset selection to 1 job
    const cards = document.querySelectorAll('.upsell-card');
    cards.forEach(c => c.classList.remove('active'));
    if(cards.length > 0) cards[0].classList.add('active');
    
    const btn = document.getElementById('upsell-btn');
    if(btn) btn.textContent = 'Proceed to pay';
    
    const price4Old = basePrice * 4;
    const price4New = Math.round(price4Old * 0.9);
    const save4 = price4Old - price4New;
    document.getElementById('upsell-4-old').textContent = `₹${price4Old.toLocaleString('en-IN')}`;
    document.getElementById('upsell-4-price').textContent = `₹${price4New.toLocaleString('en-IN')}`;
    document.getElementById('upsell-4-save').textContent = `Save ₹${save4.toLocaleString('en-IN')}`;
    
    const price8Old = basePrice * 8;
    const price8New = Math.round(price8Old * 0.8);
    const save8 = price8Old - price8New;
    document.getElementById('upsell-8-old').textContent = `₹${price8Old.toLocaleString('en-IN')}`;
    document.getElementById('upsell-8-price').textContent = `₹${price8New.toLocaleString('en-IN')}`;
    document.getElementById('upsell-8-save').textContent = `Save ₹${save8.toLocaleString('en-IN')}`;
    
    document.getElementById('upsellModal').classList.add('show');
  } else {
    // Show new monthly cross-sell modal
    const diff = 2499 - basePrice;
    document.getElementById('monthly-diff-price').textContent = `₹${diff.toLocaleString('en-IN')}`;
    
    document.getElementById('mu-plan-name').textContent = planName + ' job';
    document.getElementById('mu-plan-price').textContent = `₹${basePrice.toLocaleString('en-IN')}`;
    document.getElementById('mu-btn-continue').textContent = `Continue with ${planName.toLowerCase()} job`;
    
    // Copy features from the clicked card
    const featuresList = cardElement.querySelector('.features');
    if (featuresList) {
      document.getElementById('mu-plan-features').innerHTML = featuresList.outerHTML;
    }
    
    document.getElementById('monthlyUpsellModal').classList.add('show');
  }
}

function closeModal() {
  document.getElementById('upsellModal').classList.remove('show');
}

function closeMonthlyModal() {
  document.getElementById('monthlyUpsellModal').classList.remove('show');
}

function continueWithSingleJob() {
  window.location.href = `checkout.html?plan=${encodeURIComponent(currentPlanName)}&count=1&price=${currentBasePrice}`;
}

function switchToMonthly() {
  window.location.href = `checkout.html?plan=${encodeURIComponent('Apna Unlimited Monthly Plan')}&count=1&price=2499`;
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

  const btn = document.getElementById('upsell-btn');
  if(btn) {
    if(count === 1) {
      btn.textContent = 'Proceed to pay';
    } else {
      const oldPrice = currentBasePrice * count;
      let finalPrice = count === 4 ? Math.round(oldPrice * 0.9) : Math.round(oldPrice * 0.8);
      const savings = oldPrice - finalPrice;
      btn.textContent = `Continue with ₹${savings.toLocaleString('en-IN')} saving`;
    }
  }
}
