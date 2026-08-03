// Handle plan selection in the Single Job section
function selectPlan(selectedCard) {
  const cards = document.querySelectorAll('.single-jobs-cards .card');
  cards.forEach(card => {
    card.classList.remove('premium');
    card.classList.add('bordered');
  });

  selectedCard.classList.remove('bordered');
  selectedCard.classList.add('premium');
}

function resetToDefault() {
  const cards = document.querySelectorAll('.single-jobs-cards .card');
  cards.forEach(card => {
    card.classList.remove('bordered');
    card.classList.add('premium');
  });

  if (cards.length > 1) {
    const premiumCard = cards[1];
    premiumCard.classList.remove('bordered');
    premiumCard.classList.add('premium');
  }
}

// --- Upsell Modal Logic ---
let currentBasePrice = 0;
let currentPlanName = "";

function openModal(cardElement, planName) {
  const isOldUser = document.getElementById('toggle-old-user') && document.getElementById('toggle-old-user').checked;
  let basePrice = 0;
  if (planName.toLowerCase() === 'classic') {
    basePrice = isOldUser ? 699 : 999;
  } else if (planName.toLowerCase() === 'premium') {
    basePrice = isOldUser ? 1399 : 1999;
  } else if (planName.toLowerCase().includes('super')) {
    basePrice = isOldUser ? 2799 : 2999;
  }
  
  currentBasePrice = basePrice;
  currentPlanName = planName;
  
  const toggle = document.getElementById('toggle-monthly');
  const hasMonthlyUpsellModal = !!document.getElementById('monthlyUpsellModal');
  const isExperimentPage = !!document.getElementById('expSection') || window.location.pathname.includes('experiment.html');
  const showQuantityUpsell = isExperimentPage || !hasMonthlyUpsellModal || (toggle && toggle.checked) || planName.toLowerCase().includes('super');

  if (showQuantityUpsell) {
    // Show quantity upsell modal
    const nameSpans = document.querySelectorAll('.upsell-plan-name');
    nameSpans.forEach(span => span.textContent = planName);
    
    const u1price = document.getElementById('upsell-1-price');
    if (u1price) u1price.textContent = `₹${basePrice.toLocaleString('en-IN')}`;
    
    const cards = document.querySelectorAll('.upsell-card');
    cards.forEach(c => c.classList.remove('active'));
    if(cards.length > 0) cards[0].classList.add('active');
    
    const btn = document.getElementById('upsell-btn');
    if(btn) btn.textContent = 'Proceed to pay';
    
    const price4Old = basePrice * 4;
    const price4New = Math.round(price4Old * 0.9);
    const save4 = price4Old - price4New;
    
    const u4old = document.getElementById('upsell-4-old');
    if (u4old) u4old.textContent = `₹${price4Old.toLocaleString('en-IN')}`;
    
    const u4new = document.getElementById('upsell-4-price') || document.getElementById('upsell-4-new');
    if (u4new) u4new.textContent = `₹${price4New.toLocaleString('en-IN')}`;
    
    const u4save = document.getElementById('upsell-4-save');
    if (u4save) u4save.textContent = `Save ₹${save4.toLocaleString('en-IN')}`;
    
    const price8Old = basePrice * 8;
    const price8New = Math.round(price8Old * 0.8);
    const save8 = price8Old - price8New;
    
    const u8old = document.getElementById('upsell-8-old');
    if (u8old) u8old.textContent = `₹${price8Old.toLocaleString('en-IN')}`;
    
    const u8new = document.getElementById('upsell-8-price') || document.getElementById('upsell-8-new');
    if (u8new) u8new.textContent = `₹${price8New.toLocaleString('en-IN')}`;
    
    const u8save = document.getElementById('upsell-8-save');
    if (u8save) u8save.textContent = `Save ₹${save8.toLocaleString('en-IN')}`;
    
    const modal1 = document.getElementById('upsellModal');
    const modal2 = document.getElementById('upsell-modal');
    if (modal1) modal1.classList.add('show');
    if (modal2) modal2.classList.add('show');
  } else {
    // Show new monthly cross-sell modal
    const diff = 2499 - basePrice;
    const diffEl = document.getElementById('monthly-diff-price');
    if (diffEl) diffEl.textContent = `₹${diff.toLocaleString('en-IN')}`;
    
    const muName = document.getElementById('mu-plan-name');
    if (muName) muName.textContent = planName + ' job';
    
    const muPrice = document.getElementById('mu-plan-price');
    if (muPrice) muPrice.textContent = `₹${basePrice.toLocaleString('en-IN')}`;
    
    const muBtn = document.getElementById('mu-btn-continue');
    if (muBtn) muBtn.textContent = `Continue with ${planName.toLowerCase()} job`;
    
    if (cardElement) {
      const featuresList = cardElement.querySelector('.features');
      const muFeatures = document.getElementById('mu-plan-features');
      if (featuresList && muFeatures) {
        muFeatures.innerHTML = featuresList.outerHTML;
      }
    }
    
    const mModal = document.getElementById('monthlyUpsellModal');
    if (mModal) mModal.classList.add('show');
  }
}

function closeModal() {
  const modal1 = document.getElementById('upsellModal');
  const modal2 = document.getElementById('upsell-modal');
  const modal3 = document.getElementById('monthlyUpsellModal');
  if (modal1) modal1.classList.remove('show');
  if (modal2) modal2.classList.remove('show');
  if (modal3) modal3.classList.remove('show');
}

function closeModalOnOverlay(event) {
  if (event.target === event.currentTarget) {
    closeModal();
  }
}

function closeMonthlyModal() {
  const modal3 = document.getElementById('monthlyUpsellModal');
  if (modal3) modal3.classList.remove('show');
}

function continueWithSingleJob() {
  window.location.href = `checkout.html?plan=${encodeURIComponent(currentPlanName)}&count=1&unitPrice=${currentBasePrice}`;
}

function switchToMonthly() {
  window.location.href = `checkout.html?plan=Monthly&count=1&price=2499`;
}

function goToCheckout() {
  const activeCard = document.querySelector('.upsell-card.active');
  let count = 1;

  if (activeCard) {
    if (activeCard.innerText.includes('4 Premium') || activeCard.innerText.includes('4 Classic') || activeCard.innerText.includes('4 Super') || activeCard.innerText.includes('4 Jobs')) {
      count = 4;
    } else if (activeCard.innerText.includes('8 Premium') || activeCard.innerText.includes('8 Classic') || activeCard.innerText.includes('8 Super') || activeCard.innerText.includes('8 Jobs')) {
      count = 8;
    } else {
      count = 1;
    }
  }

  window.location.href = `checkout.html?plan=${encodeURIComponent(currentPlanName)}&count=${count}&unitPrice=${currentBasePrice}`;
}

function confirmUpsell() {
  goToCheckout();
}

function selectUpsell(card, count) {
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
