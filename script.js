(() => {
  const sheet = document.getElementById("sheet");
  const backdrop = document.getElementById("backdrop");
  const openBtn = document.getElementById("tab-actions");
  const closeBtn = document.getElementById("sheet-close");
  const toast = document.getElementById("toast");
  const body = document.body;

  let toastTimer = null;
  let lastFocused = null;

  function showToast(text) {
    toast.textContent = text;
    toast.classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("visible"), 1800);
  }

  function openSheet() {
    lastFocused = document.activeElement;
    sheet.classList.add("open");
    backdrop.classList.add("visible");
    body.classList.add("sheet-open");
    closeBtn.focus();
    document.addEventListener("keydown", onKeydown);
  }

  function closeSheet() {
    sheet.classList.remove("open");
    backdrop.classList.remove("visible");
    body.classList.remove("sheet-open");
    document.removeEventListener("keydown", onKeydown);
    if (lastFocused) lastFocused.focus();
  }

  function onKeydown(e) {
    if (e.key === "Escape") closeSheet();
  }

  openBtn.addEventListener("click", openSheet);
  closeBtn.addEventListener("click", closeSheet);
  backdrop.addEventListener("click", closeSheet);

  sheet.querySelectorAll(".sheet-row").forEach((row) => {
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
