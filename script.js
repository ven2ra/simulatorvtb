(() => {
  const backdrop = document.getElementById("backdrop");
  const toast = document.getElementById("toast");
  const body = document.body;

  const actionsSheet = document.getElementById("sheet");
  const topupSheet = document.getElementById("topupSheet");
  const requisitesSheet = document.getElementById("requisitesSheet");

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
    showToast("Демо: счёт банка не подключён");
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
})();
