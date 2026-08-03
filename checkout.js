document.addEventListener("DOMContentLoaded", () => {
  // Parse URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const planName = urlParams.get('plan') || 'Premium';
  const planCount = parseInt(urlParams.get('count') || '1');
  
  // Resolve Unit Price cleanly without guesswork
  let unitPrice = parseInt(urlParams.get('unitPrice') || '0');
  
  if (!unitPrice || isNaN(unitPrice)) {
    const rawPriceParam = parseInt(urlParams.get('price') || '1999');
    const lowerName = planName.toLowerCase();
    
    if (lowerName.includes('classic')) {
      unitPrice = (rawPriceParam === 699 || rawPriceParam === 2796 || rawPriceParam === 2516 || rawPriceParam === 5592 || rawPriceParam === 4474) ? 699 : 999;
    } else if (lowerName.includes('super')) {
      unitPrice = (rawPriceParam === 2799 || rawPriceParam === 11196 || rawPriceParam === 10076 || rawPriceParam === 22392 || rawPriceParam === 17914) ? 2799 : 2999;
    } else { // Premium
      unitPrice = (rawPriceParam === 1399 || rawPriceParam === 5596 || rawPriceParam === 5036 || rawPriceParam === 11192 || rawPriceParam === 8954) ? 1399 : 1999;
    }
  }

  // DOM Elements
  const sumPlanNameEl = document.getElementById('summary-plan-name');
  const sumPlanPriceEl = document.getElementById('summary-plan-price');
  const sumBulkDiscountEl = document.getElementById('summary-bulk-discount');
  const sumDiscountValEl = document.getElementById('summary-discount-val');
  
  const sumAiAddonEl = document.getElementById('summary-ai-addon');
  const sumSubtotalEl = document.getElementById('summary-subtotal');
  const sumTaxEl = document.getElementById('summary-tax');
  const sumTotalEl = document.getElementById('summary-total');
  
  const aiToggleBtn = document.getElementById('ai-toggle-btn');
  const aiAddonBox = document.getElementById('ai-addon-box');
  const proceedBtn = document.getElementById('proceed-btn');

  // Fixed single AI Calling Agent price (₹1,190) for 1, 4, and 8 jobs
  const ADDON_PRICE = 1190;
  const ADDON_OLD_PRICE = 1700;

  // Monthly / Unlimited Plan Logic (Displays Payment Mode Selection, Bypasses AI Addon)
  const isMonthlyOrUnlimited = planName === 'Monthly' || 
                               planName.toLowerCase().includes('monthly') || 
                               planName.toLowerCase().includes('unlimited') ||
                               planName.toLowerCase().includes('quarterly') ||
                               planName.toLowerCase().includes('yearly') ||
                               planName.toLowerCase().includes('annual');

  if (isMonthlyOrUnlimited) {
    const singleJobCheckout = document.querySelector('.single-job-checkout');
    const monthlyCheckout = document.querySelector('.monthly-checkout');
    if (singleJobCheckout) singleJobCheckout.style.display = 'none';
    if (monthlyCheckout) monthlyCheckout.style.display = '';
    
    const lowerPlanName = planName.toLowerCase();
    const isMonthlyPlan = lowerPlanName.includes('monthly') || planName === 'Monthly';
    const isQuarterlyPlan = lowerPlanName.includes('quarterly');
    const isYearlyPlan = lowerPlanName.includes('yearly') || lowerPlanName.includes('annual');

    const optionOnetime = document.getElementById('option-onetime');
    const optionAutopay = document.getElementById('option-autopay');
    const autopayRadio = document.querySelector('input[name="payment-mode"][value="autopay"]');
    const onetimeSubtextEl = document.querySelector('#option-onetime .option-subtext');

    if (isMonthlyPlan) {
      // Monthly plan: Remove One-time option; Auto pay is auto-selected by default
      if (optionOnetime) optionOnetime.style.display = 'none';
      if (autopayRadio) autopayRadio.checked = true;
    } else {
      // Quarterly and Yearly/Annual plans: Keep One-time option available
      if (optionOnetime) optionOnetime.style.display = 'flex';
      if (onetimeSubtextEl) {
        if (isQuarterlyPlan) onetimeSubtextEl.textContent = 'Expires after 90 days';
        else if (isYearlyPlan) onetimeSubtextEl.textContent = 'Expires after 365 days';
        else onetimeSubtextEl.textContent = 'Expires after 30 days';
      }
    }

    // Dynamic title, subtext & base price updates for Monthly/Quarterly/Yearly
    const planTitleEl = document.querySelector('.monthly-plan-name .plan-title');
    const planSubtextEl = document.querySelector('.monthly-plan-name .plan-subtext');
    const monthlyBasePriceEl = document.getElementById('monthly-base-price');
    const monthlyBasePrice = parseInt(urlParams.get('price') || (isQuarterlyPlan ? '6499' : isYearlyPlan ? '19999' : '2499'));

    if (planTitleEl) {
      if (isQuarterlyPlan) {
        planTitleEl.textContent = 'Quarterly plan';
      } else if (isYearlyPlan) {
        planTitleEl.textContent = 'Yearly plan';
      } else {
        planTitleEl.textContent = 'Monthly plan';
      }
    }

    if (planSubtextEl) {
      if (isQuarterlyPlan) {
        planSubtextEl.innerHTML = '(<span class="bold">1 active</span> job slot + <span class="bold">600 Database</span> credits for 90 days)';
      } else if (isYearlyPlan) {
        planSubtextEl.innerHTML = '(<span class="bold">1 active</span> job slot + <span class="bold">2400 Database</span> credits for 365 days)';
      } else {
        planSubtextEl.innerHTML = '(<span class="bold">1 active</span> job slot + <span class="bold">200 Database</span> credits for 30 days)';
      }
    }

    if (monthlyBasePriceEl) {
      monthlyBasePriceEl.textContent = `₹${monthlyBasePrice.toLocaleString('en-IN')}`;
    }

    // Set auto-renew date (30 days for monthly, 90 days for quarterly, 365 days for yearly)
    const daysToAdd = isQuarterlyPlan ? 90 : (isYearlyPlan ? 365 : 30);
    const renewDate = new Date();
    renewDate.setDate(renewDate.getDate() + daysToAdd);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const renewDateStr = renewDate.toLocaleDateString('en-GB', options);
    const renewDateEl = document.getElementById('renew-date');
    if (renewDateEl) renewDateEl.textContent = renewDateStr;

    // Period suffix (/month, /quarter, /year)
    const freqSuffix = isQuarterlyPlan ? '/quarter' : (isYearlyPlan ? '/year' : '/month');

    window.updateMonthlyTotals = function() {
      const modeInput = document.querySelector('input[name="payment-mode"]:checked');
      if (!modeInput) return;
      const mode = modeInput.value;
      
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
        
        discount = Math.round(monthlyBasePrice * 0.05);
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
      
      const subtotal = monthlyBasePrice - discount;
      const tax = Math.round(subtotal * 0.18);
      const total = subtotal + tax;
      
      if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
      if (taxEl) taxEl.textContent = `₹${tax.toLocaleString('en-IN')}`;
      if (totalEl) totalEl.textContent = `₹${total.toLocaleString('en-IN')}`;
      
      if (mode === 'autopay') {
        if (proceedBtn) proceedBtn.textContent = `Subscribe ₹${total.toLocaleString('en-IN')} ${freqSuffix}`;
        if (renewAmountEl) renewAmountEl.textContent = `₹${total.toLocaleString('en-IN')} ${freqSuffix}`;
      } else {
        if (proceedBtn) proceedBtn.textContent = `Proceed to pay ₹${total.toLocaleString('en-IN')}`;
      }
    };
    
    // Initial calculation
    updateMonthlyTotals();
    
    return; // Exit here, do not run Single Job logic
  }

  // --- Single Job Logic ---
  const fullJobPrice = unitPrice * planCount;
  let bulkDiscount = 0;

  if (planCount === 4) {
    bulkDiscount = Math.round(fullJobPrice * 0.10); // 10% discount for 4 jobs
  } else if (planCount === 8) {
    bulkDiscount = Math.round(fullJobPrice * 0.20); // 20% discount for 8 jobs
  }

  const netJobPrice = fullJobPrice - bulkDiscount;

  if (sumPlanNameEl) sumPlanNameEl.textContent = `${planName} job x ${planCount}`;
  if (sumPlanPriceEl) sumPlanPriceEl.textContent = `₹${fullJobPrice.toLocaleString('en-IN')}`;

  // Bulk Discount Line Item
  if (planCount > 1 && bulkDiscount > 0) {
    if (sumBulkDiscountEl) sumBulkDiscountEl.classList.remove('hidden');
    if (sumDiscountValEl) sumDiscountValEl.textContent = `-₹${bulkDiscount.toLocaleString('en-IN')}`;
  } else {
    if (sumBulkDiscountEl) sumBulkDiscountEl.classList.add('hidden');
  }

  // Set single AI Calling Agent card labels to AI Calling Agent x1 & fixed ₹1,190 price for all job counts
  const addonTitleEl = document.querySelector('#ai-addon-box h3');
  const addonPriceEl = document.querySelector('.addon-price');
  const addonOldPriceEl = document.querySelector('.addon-old-price');
  const sumAiAddonNameEl = document.querySelector('#summary-ai-addon .bold-text:first-child');
  const sumAiAddonValEl = document.querySelector('#summary-ai-addon .bold-text:last-child');

  if (addonTitleEl) addonTitleEl.textContent = `AI Calling Agent x 1`;
  if (sumAiAddonNameEl) sumAiAddonNameEl.textContent = `AI Calling Agent x 1`;
  if (addonPriceEl) addonPriceEl.textContent = `₹${ADDON_PRICE.toLocaleString('en-IN')}`;
  if (addonOldPriceEl) addonOldPriceEl.textContent = `₹${ADDON_OLD_PRICE.toLocaleString('en-IN')}`;
  if (sumAiAddonValEl) sumAiAddonValEl.textContent = `₹${ADDON_PRICE.toLocaleString('en-IN')}`;

  function calculateTotals() {
    let subtotal = netJobPrice;
    
    // Add single AI Addon price if toggled
    if (aiToggleBtn && aiToggleBtn.checked) {
      subtotal += ADDON_PRICE;
      if (sumAiAddonEl) sumAiAddonEl.classList.remove('hidden');
      if (aiAddonBox) aiAddonBox.classList.add('active-addon');
    } else {
      if (sumAiAddonEl) sumAiAddonEl.classList.hidden = true;
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
