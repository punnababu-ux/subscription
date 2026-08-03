document.addEventListener("DOMContentLoaded", () => {
  // Parse URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const planName = urlParams.get('plan') || 'Premium';
  const planCount = parseInt(urlParams.get('count') || '1');
  const basePrice = parseInt(urlParams.get('price') || '2499'); // Default based on screenshot

  // DOM Elements
  const sumPlanNameEl = document.getElementById('summary-plan-name');
  const sumPlanPriceEl = document.getElementById('summary-plan-price');
  
  const sumAiAddonEl = document.getElementById('summary-ai-addon');
  const sumSubtotalEl = document.getElementById('summary-subtotal');
  const sumTaxEl = document.getElementById('summary-tax');
  const sumTotalEl = document.getElementById('summary-total');
  
  const aiToggleBtn = document.getElementById('ai-toggle-btn');
  const aiAddonBox = document.getElementById('ai-addon-box');
  const proceedBtn = document.getElementById('proceed-btn');

  const BASE_ADDON_PRICE = 1190;
  const BASE_ADDON_OLD_PRICE = 1700;

  const currentAddonPrice = BASE_ADDON_PRICE * planCount;
  const currentAddonOldPrice = BASE_ADDON_OLD_PRICE * planCount;

  // Monthly / Unlimited Plan Logic (Displays Payment Mode Selection, Bypasses AI Addon)
  const isMonthlyOrUnlimited = planName === 'Monthly' || 
                               planName.toLowerCase().includes('monthly') || 
                               planName.toLowerCase().includes('unlimited') ||
                               planName.toLowerCase().includes('quarterly') ||
                               planName.toLowerCase().includes('yearly');

  if (isMonthlyOrUnlimited) {
    const singleJobCheckout = document.querySelector('.single-job-checkout');
    const monthlyCheckout = document.querySelector('.monthly-checkout');
    if (singleJobCheckout) singleJobCheckout.style.display = 'none';
    if (monthlyCheckout) monthlyCheckout.style.display = '';
    
    // Set auto-renew date (30 days from now)
    const renewDate = new Date();
    renewDate.setDate(renewDate.getDate() + 30);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const renewDateStr = renewDate.toLocaleDateString('en-GB', options);
    const renewDateEl = document.getElementById('renew-date');
    if (renewDateEl) renewDateEl.textContent = renewDateStr;

    window.updateMonthlyTotals = function() {
      const modeInput = document.querySelector('input[name="payment-mode"]:checked');
      if (!modeInput) return;
      const mode = modeInput.value;
      
      const optionAutopay = document.getElementById('option-autopay');
      const optionOnetime = document.getElementById('option-onetime');
      const discountRow = document.getElementById('monthly-discount-row');
      const autorenewBox = document.getElementById('monthly-autorenew-box');
      const subtotalEl = document.getElementById('monthly-subtotal');
      const taxEl = document.getElementById('monthly-tax');
      const totalEl = document.getElementById('monthly-total');
      const proceedBtn = document.getElementById('monthly-proceed-btn');
      const renewAmountEl = document.getElementById('renew-amount');
      
      let discount = 0;
      
      if (mode === 'autopay') {
        if (optionAutopay) {
          optionAutopay.style.border = '1px solid var(--core-green)';
          optionAutopay.style.backgroundColor = '#F8FCFA';
        }
        if (optionOnetime) {
          optionOnetime.style.border = '1px solid var(--neutral-200)';
          optionOnetime.style.backgroundColor = 'transparent';
        }
        
        discount = Math.round(basePrice * 0.05);
        if (document.getElementById('monthly-discount-val')) {
          document.getElementById('monthly-discount-val').textContent = `-₹${discount.toLocaleString('en-IN')}`;
        }
        if (discountRow) discountRow.style.display = 'flex';
        if (autorenewBox) autorenewBox.style.display = 'block';
      } else {
        if (optionOnetime) {
          optionOnetime.style.border = '1px solid var(--core-green)';
          optionOnetime.style.backgroundColor = '#F8FCFA';
        }
        if (optionAutopay) {
          optionAutopay.style.border = '1px solid var(--neutral-200)';
          optionAutopay.style.backgroundColor = 'transparent';
        }
        
        if (discountRow) discountRow.style.display = 'none';
        if (autorenewBox) autorenewBox.style.display = 'none';
      }
      
      const subtotal = basePrice - discount;
      const tax = Math.round(subtotal * 0.18);
      const total = subtotal + tax;
      
      if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
      if (taxEl) taxEl.textContent = `₹${tax.toLocaleString('en-IN')}`;
      if (totalEl) totalEl.textContent = `₹${total.toLocaleString('en-IN')}`;
      
      if (mode === 'autopay') {
        if (proceedBtn) proceedBtn.textContent = `Subscribe ₹${total.toLocaleString('en-IN')} /month`;
        if (renewAmountEl) renewAmountEl.textContent = `₹${total.toLocaleString('en-IN')}`;
      } else {
        if (proceedBtn) proceedBtn.textContent = `Proceed to pay ₹${total.toLocaleString('en-IN')}`;
      }
    };
    
    // Initial calculation
    updateMonthlyTotals();
    
    return; // Exit here, do not run Single Job logic
  }

  // --- Single Job Logic (1, 4, 8 jobs all get AI Calling Agent upsell) ---
  if (sumPlanNameEl) sumPlanNameEl.textContent = `${planName} job x ${planCount}`;
  if (sumPlanPriceEl) sumPlanPriceEl.textContent = `₹${basePrice.toLocaleString('en-IN')}`;

  // Update AI addon card labels & prices for planCount (1, 4, 8 jobs)
  const addonTitleEl = document.querySelector('#ai-addon-box h3');
  const addonPriceEl = document.querySelector('.addon-price');
  const addonOldPriceEl = document.querySelector('.addon-old-price');
  const sumAiAddonNameEl = document.querySelector('#summary-ai-addon .bold-text:first-child');
  const sumAiAddonValEl = document.querySelector('#summary-ai-addon .bold-text:last-child');

  const addonLabelText = planCount > 1 ? `AI Calling Agent x ${planCount}` : `AI Calling Agent`;
  
  if (addonTitleEl) addonTitleEl.textContent = addonLabelText;
  if (sumAiAddonNameEl) sumAiAddonNameEl.textContent = addonLabelText;
  if (addonPriceEl) addonPriceEl.textContent = `₹${currentAddonPrice.toLocaleString('en-IN')}`;
  if (addonOldPriceEl) addonOldPriceEl.textContent = `₹${currentAddonOldPrice.toLocaleString('en-IN')}`;
  if (sumAiAddonValEl) sumAiAddonValEl.textContent = `₹${currentAddonPrice.toLocaleString('en-IN')}`;

  function calculateTotals() {
    let subtotal = basePrice;
    
    // Add AI Addon price if toggled
    if (aiToggleBtn && aiToggleBtn.checked) {
      subtotal += currentAddonPrice;
      if (sumAiAddonEl) sumAiAddonEl.classList.remove('hidden');
      if (aiAddonBox) aiAddonBox.classList.add('active-addon');
    } else {
      if (sumAiAddonEl) sumAiAddonEl.classList.add('hidden');
      if (aiAddonBox) aiAddonBox.classList.remove('active-addon');
    }

    // Calculate tax (18%)
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + tax;

    // Update DOM
    if (sumSubtotalEl) sumSubtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    if (sumTaxEl) sumTaxEl.textContent = `₹${tax.toLocaleString('en-IN')}`;
    if (sumTotalEl) sumTotalEl.textContent = `₹${total.toLocaleString('en-IN')}`;
    
    // Update Checkout Button text
    if (proceedBtn) proceedBtn.textContent = `Proceed to pay ₹${total.toLocaleString('en-IN')}`;
  }

  // Handle Toggle Change
  window.toggleAIAddon = function() {
    calculateTotals();
  };

  // Initial Calculation
  calculateTotals();
});
