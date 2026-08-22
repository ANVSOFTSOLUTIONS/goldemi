/* ==========================================================================
   Golden Letters Online Solutions Private Limited - JavaScript Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Live Gold Rates (per gram base)
  let baseRates = {
    '24k': 74.25, // $74.25 per gram for 24K
    '22k': 68.06, // $68.06 per gram for 22K
    '18k': 55.68  // $55.68 per gram for 18K
  };

  // --- 1. Automatic Nav Link Active State ---
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinksList = document.querySelectorAll('.nav-link');
  navLinksList.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else if (href !== 'index.html' && currentPath.includes(href)) {
      link.classList.add('active');
    }
  });

  // --- 2. Live Gold Rate Ticker Simulation ---
  const el24k = document.getElementById('rate-24k');
  const el22k = document.getElementById('rate-22k');
  const el18k = document.getElementById('rate-18k');

  function updateTickerPrices() {
    const changeFactor = 1 + (Math.random() * 0.002 - 0.001);
    baseRates['24k'] = +(baseRates['24k'] * changeFactor).toFixed(2);
    baseRates['22k'] = +(baseRates['22k'] * changeFactor).toFixed(2);
    baseRates['18k'] = +(baseRates['18k'] * changeFactor).toFixed(2);

    if (el24k) el24k.textContent = `$${(baseRates['24k'] * 10).toFixed(2)}`;
    if (el22k) el22k.textContent = `$${(baseRates['22k'] * 10).toFixed(2)}`;
    if (el18k) el18k.textContent = `$${(baseRates['18k'] * 10).toFixed(2)}`;

    // Safely trigger calculator updates if present on page
    if (typeof calculateGoldLoan === 'function') calculateGoldLoan();
    if (typeof calculateBuyEMI === 'function') calculateBuyEMI();
    if (typeof calculateSellPayout === 'function') calculateSellPayout();
  }

  setInterval(updateTickerPrices, 8000);


  // --- 3. Mobile Navigation Toggle ---
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (navLinks.classList.contains('active')) {
        icon.className = 'fa-solid fa-xmark';
      } else {
        icon.className = 'fa-solid fa-bars';
      }
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        if (mobileToggle.querySelector('i')) {
          mobileToggle.querySelector('i').className = 'fa-solid fa-bars';
        }
      });
    });
  }


  // --- 4. Calculator Tab Switching ---
  const calcTabs = document.querySelectorAll('.calc-tab');
  const calcContents = document.querySelectorAll('.calc-tab-content');

  if (calcTabs.length > 0) {
    calcTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        calcTabs.forEach(t => t.classList.remove('active'));
        calcContents.forEach(c => c.classList.remove('active'));

        tab.classList.add('active');
        const targetId = tab.getAttribute('data-tab');
        const targetContent = document.getElementById(targetId);
        if (targetContent) targetContent.classList.add('active');
      });
    });
  }


  // --- 5. Tab 1: Gold Loan Interest & EMI Calculator ---
  const loanAmtSlider = document.getElementById('loan-amt-slider');
  const loanRateSlider = document.getElementById('loan-rate-slider');
  const loanTenureSlider = document.getElementById('loan-tenure-slider');

  const loanAmtVal = document.getElementById('loan-amt-val');
  const loanRateVal = document.getElementById('loan-rate-val');
  const loanTenureVal = document.getElementById('loan-tenure-val');

  const resMonthlyEmi = document.getElementById('res-monthly-emi');
  const resPrincipal = document.getElementById('res-principal');
  const resTotalInterest = document.getElementById('res-total-interest');
  const resTotalPayable = document.getElementById('res-total-payable');
  const barPrincipal = document.getElementById('bar-principal');
  const barInterest = document.getElementById('bar-interest');

  const interestModeCards = document.querySelectorAll('#interest-mode-group .radio-card');
  let selectedInterestMode = 'monthly';

  if (interestModeCards.length > 0) {
    interestModeCards.forEach(card => {
      card.addEventListener('click', () => {
        interestModeCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        selectedInterestMode = card.getAttribute('data-value');
        calculateGoldLoan();
      });
    });
  }

  function calculateGoldLoan() {
    if (!loanAmtSlider || !loanRateSlider || !loanTenureSlider) return;

    const P = parseFloat(loanAmtSlider.value);
    const R_annual = parseFloat(loanRateSlider.value);
    const N_months = parseInt(loanTenureSlider.value);

    if (loanAmtVal) loanAmtVal.textContent = `$${P.toLocaleString()}`;
    if (loanRateVal) loanRateVal.textContent = `${R_annual}%`;
    if (loanTenureVal) loanTenureVal.textContent = `${N_months} Months`;

    const r_monthly = (R_annual / 12) / 100;
    let emi = 0;
    let totalInterest = 0;
    let totalPayable = 0;

    if (selectedInterestMode === 'monthly') {
      emi = (P * r_monthly * Math.pow(1 + r_monthly, N_months)) / (Math.pow(1 + r_monthly, N_months) - 1);
      totalPayable = emi * N_months;
      totalInterest = totalPayable - P;
    } else if (selectedInterestMode === 'interest_only') {
      const monthlyInterest = P * r_monthly;
      emi = monthlyInterest;
      totalInterest = monthlyInterest * N_months;
      totalPayable = P + totalInterest;
    } else if (selectedInterestMode === 'bullet') {
      totalInterest = P * (R_annual / 100) * (N_months / 12);
      totalPayable = P + totalInterest;
      emi = totalPayable / N_months;
    }

    if (resMonthlyEmi) resMonthlyEmi.textContent = `$${Math.round(emi).toLocaleString()}`;
    if (resPrincipal) resPrincipal.textContent = `$${P.toLocaleString()}`;
    if (resTotalInterest) resTotalInterest.textContent = `$${Math.round(totalInterest).toLocaleString()}`;
    if (resTotalPayable) resTotalPayable.textContent = `$${Math.round(totalPayable).toLocaleString()}`;

    const principalPct = (P / totalPayable) * 100;
    const interestPct = (totalInterest / totalPayable) * 100;
    if (barPrincipal) barPrincipal.style.width = `${principalPct}%`;
    if (barInterest) barInterest.style.width = `${interestPct}%`;
  }

  [loanAmtSlider, loanRateSlider, loanTenureSlider].forEach(slider => {
    if (slider) slider.addEventListener('input', calculateGoldLoan);
  });


  // --- 6. Tab 2: Buy Gold on EMI Calculator ---
  const buyWeightSlider = document.getElementById('buy-weight-slider');
  const buyTenureSlider = document.getElementById('buy-tenure-slider');
  const buyWeightVal = document.getElementById('buy-weight-val');
  const buyTenureVal = document.getElementById('buy-tenure-val');

  const resBuyEmi = document.getElementById('res-buy-emi');
  const resBuyTotal = document.getElementById('res-buy-total');
  const buyKaratCards = document.querySelectorAll('#buy-karat-group .radio-card');
  let selectedBuyKarat = '24';

  if (buyKaratCards.length > 0) {
    buyKaratCards.forEach(card => {
      card.addEventListener('click', () => {
        buyKaratCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        selectedBuyKarat = card.getAttribute('data-karat');
        calculateBuyEMI();
      });
    });
  }

  function calculateBuyEMI() {
    if (!buyWeightSlider || !buyTenureSlider) return;

    const weightGrams = parseFloat(buyWeightSlider.value);
    const months = parseInt(buyTenureSlider.value);

    if (buyWeightVal) buyWeightVal.textContent = `${weightGrams}g`;
    if (buyTenureVal) buyTenureVal.textContent = `${months} Months`;

    const ratePerGram = baseRates[`${selectedBuyKarat}k`] || baseRates['24k'];
    const totalGoldCost = weightGrams * ratePerGram;
    const monthlyInstallment = totalGoldCost / months;

    if (resBuyEmi) resBuyEmi.textContent = `$${Math.round(monthlyInstallment).toLocaleString()}`;
    if (resBuyTotal) resBuyTotal.textContent = `$${Math.round(totalGoldCost).toLocaleString()}`;
  }

  [buyWeightSlider, buyTenureSlider].forEach(slider => {
    if (slider) slider.addEventListener('input', calculateBuyEMI);
  });


  // --- 7. Tab 3: Instant Gold Cash Payout Valuer ---
  const sellWeightSlider = document.getElementById('sell-weight-slider');
  const sellWeightVal = document.getElementById('sell-weight-val');
  const resSellPayout = document.getElementById('res-sell-payout');
  const resSellRate = document.getElementById('res-sell-rate');

  const sellKaratCards = document.querySelectorAll('#sell-karat-group .radio-card');
  const sellCondCards = document.querySelectorAll('#sell-cond-group .radio-card');

  let selectedSellKarat = '22';
  let selectedSellCond = 'jewel';

  if (sellKaratCards.length > 0) {
    sellKaratCards.forEach(card => {
      card.addEventListener('click', () => {
        sellKaratCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        selectedSellKarat = card.getAttribute('data-karat');
        calculateSellPayout();
      });
    });
  }

  if (sellCondCards.length > 0) {
    sellCondCards.forEach(card => {
      card.addEventListener('click', () => {
        sellCondCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        selectedSellCond = card.getAttribute('data-cond');
        calculateSellPayout();
      });
    });
  }

  function calculateSellPayout() {
    if (!sellWeightSlider) return;

    const weightGrams = parseFloat(sellWeightSlider.value);
    if (sellWeightVal) sellWeightVal.textContent = `${weightGrams}g`;

    const ratePerGram = baseRates[`${selectedSellKarat}k`] || baseRates['22k'];
    let conditionMultiplier = 1.0;

    if (selectedSellCond === 'coin') conditionMultiplier = 1.01;
    if (selectedSellCond === 'pledged') conditionMultiplier = 0.99;

    const estimatedPayout = weightGrams * ratePerGram * conditionMultiplier;

    if (resSellPayout) resSellPayout.textContent = `$${Math.round(estimatedPayout).toLocaleString()}`;
    if (resSellRate) resSellRate.textContent = `$${(ratePerGram * 10).toFixed(2)} (per 10g)`;
  }

  if (sellWeightSlider) {
    sellWeightSlider.addEventListener('input', calculateSellPayout);
  }

  // Run initial calculator logic if elements are on page
  calculateGoldLoan();
  calculateBuyEMI();
  calculateSellPayout();


  // --- 8. FAQ Accordion Logic ---
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length > 0) {
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      if (question) {
        question.addEventListener('click', () => {
          const isActive = item.classList.contains('active');
          faqItems.forEach(i => i.classList.remove('active'));
          if (!isActive) {
            item.classList.add('active');
          }
        });
      }
    });
  }


  // --- 9. Contact Form Submission & Modal Handling ---
  const contactForm = document.getElementById('contact-form');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  if (contactForm && modalOverlay) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      modalOverlay.classList.add('active');
      contactForm.reset();
    });
  }

  if (modalCloseBtn && modalOverlay) {
    modalCloseBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
    });

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
      }
    });
  }
});
