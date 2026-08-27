(() => {
  const backdrop = document.getElementById("backdrop");
  const toast = document.getElementById("toast");
  const body = document.body;

  const actionsSheet = document.getElementById("sheet");
  const topupSheet = document.getElementById("topupSheet");
  const requisitesSheet = document.getElementById("requisitesSheet");
  const refillSheet = document.getElementById("refillSheet");
  const destPickerSheet = document.getElementById("destPickerSheet");
  const bankPickerSheet = document.getElementById("bankPickerSheet");
  const filterSheet = document.getElementById("filterSheet");

  let toastTimer = null;
  const stack = [];

  function showToast(text) {
    toast.textContent = text;
    toast.classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("visible"), 1800);
  }

  function openScreen(el) {
    if (stack.includes(el)) return;
    stack.push(el);
    el.classList.add("open");
    backdrop.classList.add("visible");
    body.classList.add("sheet-open");
  }

  function closeTop() {
    const el = stack.pop();
    if (el) el.classList.remove("open");
    if (stack.length === 0) {
      backdrop.classList.remove("visible");
      body.classList.remove("sheet-open");
    }
  }

  function onKeydown(e) {
    if (e.key === "Escape" && stack.length > 0) closeTop();
  }
  document.addEventListener("keydown", onKeydown);

  document.getElementById("tab-actions").addEventListener("click", () => openScreen(actionsSheet));
  document.getElementById("sheet-close").addEventListener("click", closeTop);
  backdrop.addEventListener("click", closeTop);

  document.getElementById("row-topup").addEventListener("click", () => openScreen(topupSheet));
  document.getElementById("topupClose").addEventListener("click", closeTop);
  document.getElementById("topupBack").addEventListener("click", closeTop);

  document.getElementById("row-topup-requisites").addEventListener("click", () => openScreen(requisitesSheet));
  document.getElementById("requisitesClose").addEventListener("click", closeTop);

  document.getElementById("row-topup-vtb").addEventListener("click", () => {
    openScreen(refillSheet);
  });

  document.getElementById("row-topup-other-bank").addEventListener("click", () => {
    showToast("Демо: действие недоступно");
  });

  document.querySelectorAll(".vtb-card").forEach((card) => {
    card.addEventListener("click", () => {
      showToast("Демо: счёт банка не подключён");
    });
  });

  document.querySelectorAll(".bank-pill").forEach((chip) => {
    chip.addEventListener("click", () => {
      showToast(`Пополнение через ${chip.dataset.bank} недоступно в симуляторе`);
    });
  });

  document.getElementById("reqCopyBtn").addEventListener("click", () => {
    const values = Array.from(document.querySelectorAll("#requisitesSheet .req-value"))
      .map((el) => el.textContent)
      .join("\n");
    if (navigator.clipboard) {
      navigator.clipboard.writeText(values).catch(() => {});
    }
    showToast("Скопировано");
  });

  actionsSheet.querySelectorAll(".sheet-row[data-action]").forEach((row) => {
    row.addEventListener("click", () => showToast("Демо: действие недоступно"));
  });

  document.querySelectorAll("[data-toast]").forEach((el) => {
    el.addEventListener("click", () => showToast("Демо: действие недоступно"));
  });

  const eyeToggle = document.getElementById("eye-toggle");
  const sumValue = document.getElementById("sum-value");
  const sumDots = "••••••";
  let sumHidden = false;
  const realSum = sumValue.textContent;

  const changeTexts = document.querySelectorAll(".change-text");
  const accountSums = document.querySelectorAll(".account-sum");
  const accountChanges = document.querySelectorAll(".account-change");

  eyeToggle.addEventListener("click", () => {
    sumHidden = !sumHidden;

    sumValue.textContent = sumHidden ? sumDots : realSum;

    changeTexts.forEach((el) => {
      el.textContent = sumHidden ? el.dataset.percent : el.dataset.full;
    });

    accountSums.forEach((el) => {
      el.textContent = sumHidden ? "••••••" : el.dataset.full;
    });

    accountChanges.forEach((el) => {
      el.textContent = sumHidden ? el.dataset.percent : el.dataset.full;
    });
  });

  /* ---------- Пополнение со счета банка ---------- */

  const CURRENCY_SYMBOL = { RUB: "₽", CNY: "¥" };

  const sourceAccounts = [
    { id: "master", name: "Мастер-счет в рублях", number: "1234", balance: 596.63, currency: "RUB", zero: false },
    { id: "savings", name: "Накопительный счет", number: "1234", balance: 111665.16, currency: "RUB", zero: false },
    { id: "zero-rub", name: "Текущий счет", number: "0000", balance: 0, currency: "RUB", zero: true },
    { id: "zero-cny", name: "Счет в юанях", number: "0001", balance: 0, currency: "CNY", zero: true },
  ];
  let selectedSourceId = "master";
  let appliedCurrencyFilter = null; // null = show all currencies
  let filterSelection = new Set();
  let zeroSectionOpen = false;

  const homeAccountRows = Array.from(document.querySelectorAll(".account-row"));
  const DEST_ALLOWED = [true, true, false, false];
  const DEST_DISABLED_REASON = [
    "",
    "",
    "Инвесткопилку нельзя пополнить с этого экрана",
    "Счета фондов нельзя пополнить с этого экрана",
  ];
  let selectedDestIndex = 0;

  function formatRub(n) {
    const rounded = Math.round(n * 100) / 100;
    const str = rounded % 1 === 0 ? String(rounded) : rounded.toFixed(2).replace(".", ",");
    const [intPart, decPart] = str.split(",");
    const intFormatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return decPart ? `${intFormatted},${decPart}` : intFormatted;
  }

  function formatAmountDisplay(n, currency) {
    const parts = n.toFixed(2).split(".");
    const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return `${intPart},${parts[1]} ${CURRENCY_SYMBOL[currency]}`;
  }

  function getSourceById(id) {
    return sourceAccounts.find((a) => a.id === id) || null;
  }

  function refreshDestRow() {
    const row = homeAccountRows[selectedDestIndex];
    const sum = row.querySelector(".account-sum");
    const sub = row.querySelector(".account-sub");
    document.getElementById("refillDestSum").textContent = sum.dataset.full;
    document.getElementById("refillDestSub").textContent = sub.textContent;
  }

  function refreshSourceRow() {
    const source = getSourceById(selectedSourceId);
    const sumEl = document.getElementById("refillSourceSum");
    const nameEl = document.getElementById("refillSourceName");
    const numberEl = document.getElementById("refillSourceNumber");
    if (!source) {
      sumEl.textContent = "Выберите счёт";
      nameEl.textContent = "";
      numberEl.textContent = "";
      return;
    }
    sumEl.textContent = `${formatRub(source.balance)} ${CURRENCY_SYMBOL[source.currency]}`;
    nameEl.textContent = source.name;
    numberEl.textContent = `• ${source.number}`;
    document.getElementById("refillAmountCurrency").textContent = CURRENCY_SYMBOL[source.currency];
  }

  function validateRefill() {
    const input = document.getElementById("refillAmountInput");
    const errorEl = document.getElementById("refillError");
    const submitBtn = document.getElementById("refillSubmitBtn");
    const source = getSourceById(selectedSourceId);
    const destRow = homeAccountRows[selectedDestIndex];
    const destCurrency = "RUB";

    const raw = input.value.replace(/\s/g, "").replace(",", ".");
    const amount = raw ? parseFloat(raw) : 0;

    errorEl.textContent = "";
    let valid = false;

    if (!source) {
      valid = false;
    } else if (source.currency !== destCurrency) {
      errorEl.textContent = "Нет брокерского счета в этой валюте";
      valid = false;
    } else if (!amount || amount <= 0) {
      valid = false;
    } else if (amount > source.balance) {
      errorEl.textContent = "Недостаточно денег на счете";
      valid = false;
    } else {
      valid = true;
    }

    submitBtn.disabled = !valid;
    submitBtn.classList.toggle("active", valid);
    return { amount, source, destRow, valid };
  }

  document.getElementById("refillAmountInput").addEventListener("input", (e) => {
    let v = e.target.value.replace(/[^\d,]/g, "");
    const firstComma = v.indexOf(",");
    if (firstComma !== -1) {
      v = v.slice(0, firstComma + 1) + v.slice(firstComma + 1).replace(/,/g, "");
      const [intPart, decPart] = v.split(",");
      v = intPart.replace(/\D/g, "") + "," + (decPart || "").slice(0, 2);
    }
    const [intRaw, dec] = v.split(",");
    const intFormatted = (intRaw || "").replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    e.target.value = dec !== undefined ? `${intFormatted},${dec}` : intFormatted;
    validateRefill();
  });

  document.getElementById("refillSubmitBtn").addEventListener("click", () => {
    const { amount, source, destRow, valid } = validateRefill();
    if (!valid) return;

    const sumEl = destRow.querySelector(".account-sum");
    const currentValue = parseFloat(sumEl.dataset.full.replace(/[^\d,.-]/g, "").replace(",", "."));
    const newValue = currentValue + amount;
    const newText = `${formatRub(newValue)} ₽`;
    sumEl.dataset.full = newText;
    sumEl.textContent = newText;

    source.balance -= amount;
    refreshDestRow();
    refreshSourceRow();

    showToast(`Демо: счёт пополнен на ${formatAmountDisplay(amount, source.currency)}`);

    document.getElementById("refillAmountInput").value = "";
    document.getElementById("refillError").textContent = "";
    validateRefill();

    setTimeout(() => {
      if (stack[stack.length - 1] === refillSheet) closeTop();
    }, 700);
  });

  document.getElementById("refillDestRow").addEventListener("click", () => {
    renderDestPicker();
    openScreen(destPickerSheet);
  });

  document.getElementById("refillSourceRow").addEventListener("click", () => {
    renderBankPicker();
    renderPickerHeaderChip();
    openScreen(bankPickerSheet);
  });

  document.getElementById("refillBack").addEventListener("click", closeTop);
  document.getElementById("destPickerClose").addEventListener("click", closeTop);
  document.getElementById("bankPickerClose").addEventListener("click", closeTop);
  document.getElementById("filterClose").addEventListener("click", closeTop);

  function renderDestPicker() {
    const list = document.getElementById("destPickerList");
    list.innerHTML = "";
    homeAccountRows.forEach((row, i) => {
      const sum = row.querySelector(".account-sum").dataset.full;
      const sub = row.querySelector(".account-sub").textContent;
      const allowed = DEST_ALLOWED[i];
      const item = document.createElement("button");
      item.className = "picker-account-row" + (allowed ? "" : " disabled");
      item.innerHTML = `
        <span class="picker-radio${i === selectedDestIndex ? " checked" : ""}"></span>
        <span class="picker-account-info">
          <span class="picker-account-name">${sub.split(" · ")[0] || sub}</span>
          <span class="picker-account-sub">${sub}</span>
        </span>
        <span class="picker-account-sum">${sum}</span>
      `;
      item.addEventListener("click", () => {
        if (!allowed) {
          showToast(DEST_DISABLED_REASON[i]);
          return;
        }
        selectedDestIndex = i;
        refreshDestRow();
        validateRefill();
        closeTop();
      });
      list.appendChild(item);
    });
  }

  let avatarUidCounter = 0;
  function accountAvatarSVG() {
    const uid = `pa${avatarUidCounter++}`;
    return `
      <span class="refill-avatar refill-avatar--vtb">
        <svg viewBox="0 0 40 40" width="40" height="40" fill="none">
          <defs>
            <radialGradient cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(40,0,0,40,20,0)" id="${uid}Radial">
              <stop stop-color="rgb(131,182,255)" offset="0.458007812"></stop>
              <stop stop-color="rgb(68,145,255)" offset="0.78439939"></stop>
              <stop stop-color="rgb(8,95,228)" offset="1"></stop>
            </radialGradient>
            <linearGradient x1="0" x2="20" y1="2" y2="40" gradientUnits="userSpaceOnUse" id="${uid}Linear1">
              <stop stop-color="#fff" offset="0"></stop>
              <stop stop-color="#fff" offset="1" stop-opacity="0"></stop>
            </linearGradient>
            <linearGradient x1="40" x2="2.5" y1="40" y2="2.5" gradientUnits="userSpaceOnUse" id="${uid}Linear2">
              <stop stop-color="#fff" offset="0"></stop>
              <stop stop-color="#fff" offset="1" stop-opacity="0"></stop>
            </linearGradient>
          </defs>
          <rect width="40" height="40" rx="12" fill="url(#${uid}Radial)"></rect>
          <rect width="40" height="40" rx="12" fill="#fff" fill-opacity="0.7"></rect>
          <rect width="39" height="39" x="0.5" y="0.5" rx="11.5" stroke="url(#${uid}Linear1)"></rect>
          <rect width="39" height="39" x="0.5" y="0.5" rx="11.5" stroke="url(#${uid}Linear2)" stroke-opacity="0.6"></rect>
          <path d="M29.78 16.5H12.7L13.93 13H31l-1.22 3.5Zm-.61 1.75H12.08l-1.23 3.5H27.93l1.24-3.5Zm-18.93 5.25 17.08.004L26.08 27H9l1.24-3.5Z" fill="rgb(51,149,255)" fill-rule="evenodd"></path>
        </svg>
      </span>
    `;
  }

  function accountRowHTML(acc, selected) {
    return `
      ${accountAvatarSVG()}
      <span class="picker-account-info">
        <span class="picker-account-name">${formatRub(acc.balance)} ${CURRENCY_SYMBOL[acc.currency]}</span>
        <span class="picker-account-sub">${acc.name}</span>
        <span class="picker-account-sub">• ${acc.number}</span>
      </span>
      <span class="picker-radio${selected ? " checked" : ""}"></span>
    `;
  }

  function renderBankPicker() {
    const list = document.getElementById("bankPickerList");
    list.innerHTML = "";

    const filtered = sourceAccounts.filter(
      (a) => !appliedCurrencyFilter || appliedCurrencyFilter.has(a.currency)
    );
    const nonZero = filtered.filter((a) => !a.zero);
    const zero = filtered.filter((a) => a.zero);

    if (filtered.length === 0) {
      list.innerHTML = '<div class="picker-empty">Нет счетов в этой валюте</div>';
      return;
    }

    nonZero.forEach((acc) => {
      const item = document.createElement("button");
      item.className = "picker-account-row";
      item.innerHTML = accountRowHTML(acc, acc.id === selectedSourceId);
      item.addEventListener("click", () => selectSourceAccount(acc.id));
      list.appendChild(item);
    });

    if (zero.length > 0) {
      const toggle = document.createElement("button");
      toggle.className = "picker-zero-toggle" + (zeroSectionOpen ? " open" : "");
      toggle.innerHTML = `
        <span class="picker-zero-toggle-label">Нулевые счета</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 16c-.15 0-.28-.03-.41-.07a1.06 1.06 0 0 1-.35-.23l-4.95-4.91c-.2-.2-.29-.45-.29-.75 0-.31.09-.56.29-.75.2-.2.45-.29.75-.29.31 0 .56.09.76.29l4.2 4.17 4.19-4.17c.2-.2.45-.29.76-.29.3 0 .55.09.75.29.2.19.3.44.3.75 0 .3-.1.55-.3.75l-4.95 4.91c-.11.11-.23.18-.35.23-.13.04-.26.07-.4.07Z"></path></svg>
      `;
      const zeroList = document.createElement("div");
      zeroList.className = "picker-zero-list" + (zeroSectionOpen ? " open" : "");
      zero.forEach((acc) => {
        const item = document.createElement("button");
        item.className = "picker-account-row";
        item.innerHTML = accountRowHTML(acc, acc.id === selectedSourceId);
        item.addEventListener("click", () => selectSourceAccount(acc.id));
        zeroList.appendChild(item);
      });
      toggle.addEventListener("click", () => {
        zeroSectionOpen = !zeroSectionOpen;
        toggle.classList.toggle("open", zeroSectionOpen);
        zeroList.classList.toggle("open", zeroSectionOpen);
      });
      list.appendChild(toggle);
      list.appendChild(zeroList);
    }
  }

  function selectSourceAccount(id) {
    selectedSourceId = id;
    refreshSourceRow();
    validateRefill();
    closeTop();
  }

  function renderPickerHeaderChip() {
    const actions = document.getElementById("pickerHeaderActions");
    const existing = document.getElementById("pickerActiveFilterChip");
    if (existing) existing.remove();
    if (!appliedCurrencyFilter || appliedCurrencyFilter.size !== 1) return;
    const currency = Array.from(appliedCurrencyFilter)[0];
    const label = currency === "RUB" ? "Рубль" : "Юань";
    const chip = document.createElement("button");
    chip.className = "picker-active-filter-chip";
    chip.id = "pickerActiveFilterChip";
    chip.innerHTML = `${label}<svg width="16" height="16" viewBox="0 0 16 16" fill="#75767F"><path fill="#75767F" d="m7.99 8.99-3.47 3.48c-.13.13-.3.19-.5.19s-.37-.06-.5-.19a.678.678 0 0 1-.19-.5c0-.2.06-.37.19-.5L7 8 3.52 4.52a.678.678 0 0 1-.19-.5c0-.2.06-.37.19-.5s.3-.19.5-.19.37.06.5.19L7.99 7l3.48-3.48c.13-.13.3-.19.5-.19s.37.06.5.19.19.3.19.5-.06.37-.19.5L8.99 8l3.48 3.47c.13.13.19.3.19.5s-.06.37-.19.5-.3.19-.5.19-.37-.06-.5-.19L7.99 8.99Z"></path></svg>`;
    chip.addEventListener("click", () => {
      appliedCurrencyFilter = null;
      document.getElementById("filterDot").hidden = true;
      zeroSectionOpen = false;
      renderBankPicker();
      renderPickerHeaderChip();
    });
    actions.insertBefore(chip, document.getElementById("filterOpenBtn"));
  }

  document.getElementById("filterOpenBtn").addEventListener("click", () => {
    filterSelection = appliedCurrencyFilter ? new Set(appliedCurrencyFilter) : new Set();
    document.querySelectorAll(".filter-chip").forEach((chip) => {
      chip.classList.toggle("selected", filterSelection.has(chip.dataset.currency));
      updateChipMarkup(chip);
    });
    updateFilterApplyState();
    openScreen(filterSheet);
  });

  function updateChipMarkup(chip) {
    const currency = chip.dataset.currency;
    const label = currency === "RUB" ? "Рубль" : "Юань";
    const selected = chip.classList.contains("selected");
    chip.innerHTML = selected
      ? `${label}<span class="filter-chip-remove"><svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="m7.99 8.99-3.47 3.48c-.13.13-.3.19-.5.19s-.37-.06-.5-.19a.678.678 0 0 1-.19-.5c0-.2.06-.37.19-.5L7 8 3.52 4.52a.678.678 0 0 1-.19-.5c0-.2.06-.37.19-.5s.3-.19.5-.19.37.06.5.19L7.99 7l3.48-3.48c.13-.13.3-.19.5-.19s.37.06.5.19.19.3.19.5-.06.37-.19.5L8.99 8l3.48 3.47c.13.13.19.3.19.5s-.06.37-.19.5-.3.19-.5.19-.37-.06-.5-.19L7.99 8.99Z"></path></svg></span>`
      : label;
  }

  function updateFilterApplyState() {
    const btn = document.getElementById("filterApplyBtn");
    const active = filterSelection.size > 0;
    btn.disabled = !active;
    btn.classList.toggle("active", active);
  }

  document.querySelectorAll(".filter-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const currency = chip.dataset.currency;
      if (filterSelection.has(currency)) {
        filterSelection.delete(currency);
        chip.classList.remove("selected");
      } else {
        filterSelection.add(currency);
        chip.classList.add("selected");
      }
      updateChipMarkup(chip);
      updateFilterApplyState();
    });
  });

  document.getElementById("filterApplyBtn").addEventListener("click", () => {
    if (filterSelection.size === 0) return;
    appliedCurrencyFilter = new Set(filterSelection);
    document.getElementById("filterDot").hidden = appliedCurrencyFilter.size === 2;

    const stillVisible =
      selectedSourceId && appliedCurrencyFilter.has(getSourceById(selectedSourceId)?.currency);
    if (!stillVisible) {
      selectedSourceId = null;
      refreshSourceRow();
      validateRefill();
    }

    zeroSectionOpen = false;
    renderBankPicker();
    renderPickerHeaderChip();
    closeTop();
  });

  refreshDestRow();
  refreshSourceRow();
})();
