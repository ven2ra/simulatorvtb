(() => {
  const backdrop = document.getElementById("backdrop");
  const toast = document.getElementById("toast");
  const body = document.body;

  const actionsSheet = document.getElementById("sheet");
  const topupSheet = document.getElementById("topupSheet");
  const requisitesSheet = document.getElementById("requisitesSheet");
  const refillSheet = document.getElementById("refillSheet");
  const destPickerSheet = document.getElementById("destPickerSheet");
  const destFilterSheet = document.getElementById("destFilterSheet");
  const bankPickerSheet = document.getElementById("bankPickerSheet");
  const filterSheet = document.getElementById("filterSheet");
  const searchSheet = document.getElementById("searchSheet");
  const infoSheet = document.getElementById("infoSheet");

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

  /* ---------- Главный экран: сторис, вкладки, лента ---------- */

  const STORIES = [
    {
      title: "Топ-10 акций",
      text: "Собрали 10 самых популярных акций у клиентов ВТБ Мои Инвестиции за последний месяц.",
    },
    {
      title: "До 16% годовых",
      text: "Подборка облигаций с низким риском и доходностью до 16% годовых к погашению.",
    },
    {
      title: "Сохранность: +50%",
      text: "Структурные продукты с защитой капитала до 100% и потенциальной доходностью выше вклада.",
    },
    {
      title: "Портфель для ребёнка",
      text: "Как открыть счёт на имя ребёнка и собрать портфель на долгосрочную цель.",
    },
    {
      title: "Валютные облигации",
      text: "Замещающие и валютные облигации для диверсификации портфеля.",
    },
    {
      title: "Обновление приложения",
      text: "Новый дизайн ленты, сторис и подборок — рассказываем, что изменилось.",
    },
  ];

  const storyOverlay = document.getElementById("storyOverlay");
  const storyOverlayTitle = document.getElementById("storyOverlayTitle");
  const storyOverlayText = document.getElementById("storyOverlayText");

  function openStory(index) {
    const story = STORIES[index];
    if (!story) return;
    storyOverlayTitle.textContent = story.title;
    storyOverlayText.textContent = story.text;
    storyOverlay.classList.add("open");
  }

  document.querySelectorAll(".story-item").forEach((item) => {
    item.addEventListener("click", () => openStory(Number(item.dataset.story)));
  });

  document.getElementById("storyOverlayClose").addEventListener("click", () => {
    storyOverlay.classList.remove("open");
  });

  /* Верхние вкладки: Действия / История / Анализ */

  const viewPortfolio = document.getElementById("view-portfolio");
  const viewHistory = document.getElementById("view-history");
  const viewAnalysis = document.getElementById("view-analysis");
  const topPills = [document.getElementById("tab-actions"), document.getElementById("tab-history"), document.getElementById("tab-analysis")];

  function switchView(name) {
    viewPortfolio.classList.toggle("active", name === "portfolio");
    viewHistory.classList.toggle("active", name === "history");
    viewAnalysis.classList.toggle("active", name === "analysis");
    topPills.forEach((pill) => pill.classList.toggle("active", pill.dataset.tab === name));
  }

  document.getElementById("tab-actions").dataset.tab = "portfolio";
  document.getElementById("tab-history").dataset.tab = "history";
  document.getElementById("tab-analysis").dataset.tab = "analysis";

  document.getElementById("tab-actions").addEventListener("click", () => switchView("portfolio"));
  document.getElementById("tab-history").addEventListener("click", () => switchView("history"));
  document.getElementById("tab-analysis").addEventListener("click", () => switchView("analysis"));

  switchView("portfolio");

  /* Подвкладки: Счета / Избранное */

  const subtabAccounts = document.getElementById("subtab-accounts");
  const subtabFavorites = document.getElementById("subtab-favorites");
  const accountsPanel = document.getElementById("accountsPanel");
  const favoritesPanel = document.getElementById("favoritesPanel");

  subtabAccounts.addEventListener("click", () => {
    subtabAccounts.classList.add("active");
    subtabFavorites.classList.remove("active");
    accountsPanel.hidden = false;
    favoritesPanel.hidden = true;
  });

  subtabFavorites.addEventListener("click", () => {
    subtabFavorites.classList.add("active");
    subtabAccounts.classList.remove("active");
    accountsPanel.hidden = true;
    favoritesPanel.hidden = false;
  });

  /* Демо-набор инструментов (invest.vtb.ru) */

  function stockAvatarHTML(letters, bg) {
    return `<span class="feed-stock-avatar" style="background:${bg}">${letters}</span>`;
  }

  function stockIconHTML(ticker) {
    return `<img class="feed-stock-avatar" src="https://headless-cms7.vtb.ru/projects/mpmi/files/icons/${ticker}.png" alt="" draggable="false" style="object-fit:cover" />`;
  }

  const DEMO_STOCKS = [
    { name: "Лукойл", ticker: "LKOH", price: "4 309,5 ₽", changeAbs: "147,5 ₽", changePct: "3,5 %", positive: true, avatar: stockIconHTML("LKOH") },
    { name: "ДОМ.РФ", ticker: "DOMRF", price: "2 154,4 ₽", changeAbs: "14,6 ₽", changePct: "0,7 %", positive: true, avatar: stockIconHTML("DOMRF") },
    { name: "Сургутнефтегаз-п", ticker: "SNGSP", price: "42,5 ₽", changeAbs: "1 ₽", changePct: "2,3 %", positive: true, avatar: stockIconHTML("SNGSP") },
    { name: "Мать и Дитя", ticker: "MDMG", price: "1 303,3 ₽", changeAbs: "10,1 ₽", changePct: "0,8 %", positive: true, avatar: stockIconHTML("MDMG") },
    { name: "Новатэк", ticker: "NVTK", price: "932,6 ₽", changeAbs: "11,1 ₽", changePct: "1,2 %", positive: true, avatar: stockIconHTML("NVTK") },
    { name: "Московская биржа", ticker: "MOEX", price: "152,2 ₽", changeAbs: "0,5 ₽", changePct: "0,3 %", positive: true, avatar: stockIconHTML("MOEX") },
    { name: "Совкомфлот", ticker: "FLOT", price: "76,7 ₽", changeAbs: "3,6 ₽", changePct: "5 %", positive: true, avatar: stockIconHTML("FLOT") },
    { name: "Газпром", ticker: "GAZP", price: "84,9 ₽", changeAbs: "2,6 ₽", changePct: "3,1 %", positive: true, avatar: stockIconHTML("GAZP") },
    { name: "Сбербанк", ticker: "SBER", price: "270 ₽", changeAbs: "2,7 ₽", changePct: "1 %", positive: true, avatar: stockIconHTML("SBER") },
    { name: "Яндекс", ticker: "YDEX", price: "3 484,5 ₽", changeAbs: "28,5 ₽", changePct: "0,8 %", positive: true, avatar: stockIconHTML("YDEX") },
  ];

  const DEMO_BONDS_RUB = [
    {
      title: "До 1 года",
      items: [{ name: "Автодр5Р16", rate: "14,3 %к оферте", rating: 5, avatar: stockAvatarHTML("АД", "rgb(224,120,60)") }],
    },
    {
      title: "От 1 года до 3 лет",
      items: [
        { name: "ИКС5ФиЗ17", rate: "15,4 %к оферте", rating: 5, avatar: stockAvatarHTML("X5", "rgb(33,160,80)") },
        { name: "РусГид2О08", rate: "15 %к погашению", rating: 5, avatar: stockAvatarHTML("РГ", "rgb(0,122,255)") },
        { name: "ФПК2Р01", rate: "15,9 %к погашению", rating: 5, avatar: stockAvatarHTML("ФК", "rgb(213,29,29)") },
        { name: "ГПБ001Р17Р", rate: "15,8 %к оферте", rating: 5, avatar: stockAvatarHTML("ГБ", "rgb(0,90,180)") },
        { name: "ВымпелК1Р8", rate: "15,7 %к погашению", rating: 5, avatar: stockAvatarHTML("ВК", "rgb(224,180,0)") },
      ],
    },
    {
      title: "От 3 лет до 5 лет",
      items: [
        { name: "Магнит1Р15", rate: "15,2 %к погашению", rating: 5, avatar: stockAvatarHTML("МТ", "rgb(213,29,29)") },
        { name: "Ростел2Р05", rate: "14,9 %к оферте", rating: 4, avatar: stockAvatarHTML("РТ", "rgb(0,90,180)") },
      ],
    },
  ];

  const DEMO_BONDS_CNY = [
    {
      title: "До 3 лет",
      items: [
        { name: "ГазКап3Р20", rate: "9 %к погашению", rating: 5, avatar: stockAvatarHTML("ГК", "rgb(0,90,180)") },
        { name: "ФосАгро2П5", rate: "8,4 %к погашению", rating: 5, avatar: stockAvatarHTML("ФА", "rgb(33,160,80)") },
        { name: "ЭНплГ1РС10", rate: "9,5 %к погашению", rating: 4, avatar: stockAvatarHTML("ЭН", "rgb(33,160,80)") },
      ],
    },
    {
      title: "От 3 лет до 5 лет",
      items: [
        { name: "РЖД 1P-51R", rate: "9 %к погашению", rating: 5, avatar: stockAvatarHTML("РЖ", "rgb(213,29,29)") },
        { name: "Акрон Б2Р3", rate: "8,8 %к погашению", rating: 5, avatar: stockAvatarHTML("АК", "rgb(213,29,29)") },
      ],
    },
  ];

  const DEMO_PLACEMENTS = [
    { name: "ЗПИКФ ВИМ Недвижимость", kind: "Фонды", big: "SFO", small: "Цена: 1 246,04 ₽", icon: "https://headless-cms7.vtb.ru/projects/mpmi/files/icons/LQDT.png" },
    { name: "ЗПИФН ВИМ РД 3", kind: "Фонды", big: "SFO", small: "Цена: 1 049,49 ₽", icon: "https://headless-cms7.vtb.ru/projects/mpmi/files/icons/LQDT.png" },
    { name: "ЗПИКФ ВИМ - Спектр", kind: "Фонды", big: "SFO", small: "Цена: 105 570,7 ₽", icon: "https://headless-cms7.vtb.ru/projects/mpmi/files/icons/LQDT.png" },
    { name: "ВТБ Б1-400", kind: "Облигации", big: "На 119 дней", small: "Купон: 13.5% в ₽", icon: "https://headless-cms7.vtb.ru/projects/mpmi/files/icons/ISSR_7702070139.png" },
    { name: "АБЗ-1 2Р07", kind: "Облигации", big: "На 3 года", small: "Купон: 18% в ₽", icon: "https://headless-cms7.vtb.ru/projects/mpmi/files/icons/ABZ.png" },
    { name: "АйДиКол1P9", kind: "Облигации", big: "На 4 года", small: "Купон: 20.25% в ₽", icon: "https://headless-cms7.vtb.ru/projects/mpmi/files/icons/idcollect.png" },
    { name: "ФосАгро2П7", kind: "Облигации", big: "На 2 года 2 мес.", small: "Купон: Около 15,4%", icon: "https://headless-cms7.vtb.ru/projects/mpmi/files/icons/PHOR.png" },
    { name: "iВУШ 1P8", kind: "Облигации", big: "На 3 года 1 мес.", small: "Купон: до 22% в ₽", icon: "https://headless-cms7.vtb.ru/projects/mpmi/files/icons/4-00075-L.png" },
  ];

  const DEMO_FUNDS = [
    { name: "Российские облигации (OBLG)", kind: "Фонд", pct: "20 %", sub: "за 12 месяцев" },
    { name: "ВИМ-Накопительный резерв", kind: "Фонд", pct: "28 %", sub: "за 12 месяцев" },
    { name: "Ликвидность", kind: "Фонд", pct: "14,1 %", sub: "за 12 месяцев" },
  ];

  const DEMO_STRUCT_BONDS = [
    { name: "ВТБ Б-1-417 «Потенциал ОФЗ»", kind: "Облигации", rate: "23,5 % в ₽", sub: "На 1 год" },
    { name: "ВТБ Б-1-415 «Сохранность: +50%»", kind: "Облигации", rate: "13,95 % в ₽", sub: "На 3 г. 7 мес." },
    { name: "ВТБ Б-1-420 «Ставка на рост»", kind: "Облигации", rate: "До 14,8 % в ₽", sub: "На 2 года" },
  ];

  const DEMO_STRUCT_OBLIGATIONS = [
    { name: "СО СФО ВТБ ИП «Фавориты стратегии»", kind: "Облигации", rate: "~53 % годовых", sub: "1 год" },
    { name: "СО СФО ВТБ ИП «Инвестиция в разницу Х2: Технологии»", kind: "Облигации", rate: "~25 % годовых", sub: "6 мес." },
    { name: "СО СФО ВТБ ИП «Индекс с защитой»", kind: "Облигации", rate: "~29 % годовых", sub: "6 мес." },
  ];

  const DEMO_STRUCT_PRODUCTS = [
    {
      name: "Перспектива: Газпром (3 мес.)",
      sub: "Поставочный контракт с фиксированным доходом",
      yield: "24 % год.",
      amount: "100 000 ₽",
      maturity: "29.11.2026",
    },
    {
      name: "Перспектива: Сбербанк (6 мес.)",
      sub: "Поставочный контракт с фиксированным доходом",
      yield: "19 % год.",
      amount: "50 000 ₽",
      maturity: "27.02.2027",
    },
    {
      name: "Перспектива: Лукойл (3 мес.)",
      sub: "Поставочный контракт с фиксированным доходом",
      yield: "22 % год.",
      amount: "100 000 ₽",
      maturity: "29.11.2026",
    },
  ];

  const DEMO_IDEAS = [
    { title: "Рост нефтегазового сектора", potential: "+18 %", sub: "Потенциал за 6 месяцев" },
    { title: "Защита от волатильности", potential: "+9 %", sub: "Потенциал за 3 месяца" },
    { title: "Дивидендная выборка", potential: "+12 %", sub: "Потенциал за 12 месяцев" },
  ];

  const DEMO_NEWS = [
    { title: "Выручка АФК «Система» за II квартал выросла на 10,2%, до 336,2 млрд руб., скорр. OIBDA — на 12,4%", meta: "Сегодня 20:55 · Интерфакс" },
    { title: "Девелопер «Эталон» в I полугодии сократил чистый убыток по РСБУ на 21%", meta: "Сегодня 20:51 · Интерфакс" },
  ];

  const DEMO_DIGESTS = [
    { title: "Дивидендные лидеры", badge: "+11" },
    { title: "Фавориты стратегии", badge: "+7" },
  ];

  function bondRatingHTML(rating) {
    const bars = [3, 5, 7, 9, 11];
    return `<span class="feed-bond-rating">${bars
      .map((h, i) => `<span style="height:${h}px" class="${i < rating ? "" : "empty"}"></span>`)
      .join("")}</span>`;
  }

  function renderAnalystStockRow(stock) {
    const row = document.createElement("button");
    row.className = "feed-stock-row";
    row.innerHTML = `
      ${stock.avatar}
      <div style="flex:1;min-width:0">
        <div class="feed-stock-name">${stock.name}</div>
        <div class="feed-stock-ticker">${stock.ticker}</div>
      </div>
      <div class="feed-stock-right">
        <div class="feed-stock-price">${stock.price}</div>
        <div class="feed-stock-change ${stock.positive ? "positive" : "negative"}">${stock.changeAbs} · ${stock.changePct}</div>
      </div>
    `;
    row.addEventListener("click", () => showToast(`Демо: карточка «${stock.name}» недоступна`));
    return row;
  }

  function renderAnalystTab(tab) {
    const content = document.getElementById("analystTabContent");
    content.innerHTML = "";

    if (tab === "stocks") {
      const wrap = document.createElement("div");
      wrap.className = "feed-analyst-columns";

      const left = document.createElement("div");
      left.className = "feed-analyst-col";
      left.innerHTML = `<div class="feed-analyst-col-title">Топ-10 акций <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" style="vertical-align:-2px"><circle cx="12" cy="12" r="9"></circle><line x1="12" y1="11" x2="12" y2="16"></line><circle cx="12" cy="8" r="0.6" fill="currentColor"></circle></svg></div>`;
      DEMO_STOCKS.slice(0, 5).forEach((s) => left.appendChild(renderAnalystStockRow(s)));

      const right = document.createElement("div");
      right.className = "feed-analyst-col";
      DEMO_STOCKS.slice(5, 10).forEach((s) => right.appendChild(renderAnalystStockRow(s)));

      wrap.appendChild(left);
      wrap.appendChild(right);
      content.appendChild(wrap);
      return;
    }

    const groups = tab === "rub" ? DEMO_BONDS_RUB : DEMO_BONDS_CNY;
    const wrap = document.createElement("div");
    wrap.className = "feed-analyst-columns";
    groups.forEach((group) => {
      const col = document.createElement("div");
      col.className = "feed-analyst-col";
      const title = document.createElement("div");
      title.className = "feed-analyst-col-title";
      title.textContent = group.title;
      col.appendChild(title);
      group.items.forEach((bond) => {
        const row = document.createElement("button");
        row.className = "feed-stock-row";
        row.innerHTML = `
          ${bond.avatar}
          <div style="flex:1;min-width:0">
            <div class="feed-stock-name">${bond.name}</div>
            <div class="feed-stock-change positive">${bond.rate}</div>
            ${bondRatingHTML(bond.rating)}
          </div>
        `;
        row.addEventListener("click", () => showToast(`Демо: карточка «${bond.name}» недоступна`));
        col.appendChild(row);
      });
      wrap.appendChild(col);
    });
    content.appendChild(wrap);
  }

  document.querySelectorAll("#analystTabs .feed-subtab").forEach((tabBtn) => {
    tabBtn.addEventListener("click", () => {
      document.querySelectorAll("#analystTabs .feed-subtab").forEach((b) => b.classList.remove("active"));
      tabBtn.classList.add("active");
      renderAnalystTab(tabBtn.dataset.analystTab);
    });
  });

  function renderHCards(listId, items, className, buildInner) {
    const list = document.getElementById(listId);
    list.innerHTML = "";
    items.forEach((item) => {
      const card = document.createElement("button");
      card.className = `feed-hcard ${className}`;
      card.innerHTML = buildInner(item);
      card.addEventListener("click", () => showToast(`Демо: карточка «${item.name}» недоступна`));
      list.appendChild(card);
    });
  }

  function renderPlacements() {
    renderHCards(
      "placementsList",
      DEMO_PLACEMENTS,
      "feed-hcard--placement",
      (item) => `
        <div class="feed-hcard-badge"><img src="${item.icon}" alt="" draggable="false" width="22" height="22" style="border-radius:50%" /></div>
        <div class="feed-hcard-kind">${item.kind}</div>
        <div class="feed-hcard-name">${item.name}</div>
        <div class="feed-hcard-code">${item.big}</div>
        <div class="feed-hcard-price">${item.small}</div>
      `
    );
  }

  function renderFunds() {
    renderHCards(
      "fundsList",
      DEMO_FUNDS,
      "feed-hcard--fund",
      (item) => `
        <div class="feed-hcard-badge"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgb(0,122,255)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
        <div class="feed-hcard-name">${item.name}</div>
        <div class="feed-hcard-kind">${item.kind}</div>
        <div class="feed-hcard-pct">${item.pct}</div>
        <div class="feed-hcard-sub">${item.sub}</div>
      `
    );
  }

  function renderStructBonds() {
    renderHCards(
      "structBondsList",
      DEMO_STRUCT_BONDS,
      "feed-hcard--struct",
      (item) => `
        <div class="feed-hcard-badge"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgb(0,122,255)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
        <div class="feed-hcard-kind">${item.kind}</div>
        <div class="feed-hcard-name">${item.name}</div>
        <div class="feed-hcard-rate">${item.rate}</div>
        <div class="feed-hcard-sub" style="color:rgba(255,255,255,0.75)">${item.sub}</div>
      `
    );
  }

  function renderStructObligations() {
    renderHCards(
      "structObligList",
      DEMO_STRUCT_OBLIGATIONS,
      "feed-hcard--struct",
      (item) => `
        <div class="feed-hcard-badge"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgb(0,122,255)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>
        <div class="feed-hcard-kind">${item.kind}</div>
        <div class="feed-hcard-name">${item.name}</div>
        <div class="feed-hcard-rate">${item.rate}</div>
        <div class="feed-hcard-sub" style="color:rgba(255,255,255,0.75)">${item.sub}</div>
      `
    );
  }

  function renderStructProducts() {
    renderHCards(
      "structProductsList",
      DEMO_STRUCT_PRODUCTS,
      "feed-hcard--dark",
      (item) => `
        <div class="feed-hcard-dark-badge"><svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><circle cx="12" cy="12" r="9"></circle></svg></div>
        <div class="feed-hcard-name">${item.name}</div>
        <div class="feed-hcard-kind">${item.sub}</div>
        <div class="feed-hcard-dark-grid">
          <div><div class="feed-hcard-dark-label">Доход-сть до</div><div class="feed-hcard-dark-value">${item.yield}</div></div>
          <div><div class="feed-hcard-dark-label">Сумма от</div><div class="feed-hcard-dark-value">${item.amount}</div></div>
          <div><div class="feed-hcard-dark-label">Погашение</div><div class="feed-hcard-dark-value">${item.maturity}</div></div>
        </div>
      `
    );
  }

  function renderIdeas() {
    renderHCards(
      "ideasList",
      DEMO_IDEAS,
      "",
      (idea) => `
        <div class="feed-hcard-name">${idea.title}</div>
        <div class="feed-hcard-potential">${idea.potential}</div>
        <div class="feed-hcard-sub">${idea.sub}</div>
      `
    );
    document.getElementById("ideasList").querySelectorAll(".feed-hcard").forEach((card, i) => {
      card.addEventListener("click", () => showToast(`Демо: идея «${DEMO_IDEAS[i].title}» недоступна`));
    });
  }

  function renderNews() {
    const list = document.getElementById("newsList");
    list.innerHTML = "";
    DEMO_NEWS.forEach((item) => {
      const row = document.createElement("button");
      row.className = "feed-news-row";
      row.innerHTML = `
        <div class="feed-news-title">${item.title}</div>
        <div class="feed-news-meta">${item.meta}</div>
      `;
      row.addEventListener("click", () => showToast("Демо: новость недоступна"));
      list.appendChild(row);
    });
  }

  function renderDigests() {
    const list = document.getElementById("digestsList");
    list.innerHTML = "";
    DEMO_DIGESTS.forEach((item) => {
      const card = document.createElement("button");
      card.className = "feed-hcard feed-hcard--digest";
      card.innerHTML = `
        <div class="digest-icons"><span style="background:rgb(0,122,255)">Т</span><span style="background:rgb(213,29,29)">Л</span><span style="background:rgb(33,160,80)">С</span></div>
        <div class="digest-icons-more">${item.badge}</div>
        <div class="feed-hcard-name">${item.title}</div>
      `;
      card.addEventListener("click", () => showToast(`Демо: подборка «${item.title}» недоступна`));
      list.appendChild(card);
    });
  }

  renderAnalystTab("stocks");
  renderPlacements();
  renderFunds();
  renderStructBonds();
  renderStructObligations();
  renderStructProducts();
  renderIdeas();
  renderNews();
  renderDigests();

  /* Карусель промо-баннеров */

  const PROMO_SLIDES = [
    {
      image: "https://headless-cms7.vtb.ru/projects/mpmi/files/store/widget/widget_1270.jpg",
      title: "Лучший частный инвестор 2026",
      sub: "Призы в 2 раза больше с ВТБ",
    },
    {
      image: "https://headless-cms7.vtb.ru/projects/mpmi/files/store/widget/widget_3073.jpg",
      title: "10 призов по 100 000 ₽",
      sub: "Участвуйте в розыгрыше каждую неделю",
    },
  ];

  function renderPromoCarousel() {
    const track = document.getElementById("promoCarouselTrack");
    const dots = document.getElementById("promoCarouselDots");
    track.innerHTML = "";
    dots.innerHTML = "";
    PROMO_SLIDES.forEach((slide, i) => {
      const btn = document.createElement("button");
      btn.className = "promo-slide";
      btn.style.backgroundImage = `linear-gradient(rgba(0,40,120,0.15), rgba(0,20,80,0.55)), url('${slide.image}')`;
      btn.innerHTML = `
        <div class="promo-slide-title">${slide.title}</div>
        <div class="promo-slide-sub">${slide.sub}</div>
      `;
      btn.addEventListener("click", () => showToast("Демо: действие недоступно"));
      track.appendChild(btn);

      const dot = document.createElement("span");
      dot.className = "promo-carousel-dot" + (i === 0 ? " active" : "");
      dots.appendChild(dot);
    });
  }

  renderPromoCarousel();

  document.getElementById("promoCarouselTrack").addEventListener("scroll", (e) => {
    const track = e.target;
    const index = Math.round(track.scrollLeft / track.clientWidth);
    document.querySelectorAll(".promo-carousel-dot").forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  });

  /* Сетка быстрых плиток */

  const TILE_ITEMS = [
    { label: "Розыгрыш миллиона рублей", bg: "linear-gradient(135deg, rgb(180,150,240), rgb(120,90,210))", image: "https://h2.vtb.ru/projects/mpmi/files/skins/Shortcuts/crystal_new_light.png" },
    { label: "Акция: кредит под активы", bg: "linear-gradient(135deg, rgb(100,170,255), rgb(30,120,240))", image: "https://h2.vtb.ru/projects/mpmi/files/skins/Shortcuts/star_light.png" },
    { label: "Открыть новый субсчет", image: "https://headless-cms7.vtb.ru/projects/mpmi/files/skins/Shortcuts/portfel_light.png" },
    { label: "Маржинальная торговля", image: "https://headless-cms7.vtb.ru/projects/mpmi/files/skins/Shortcuts/percent_light.png" },
    { label: "ИИС", image: "https://headless-cms7.vtb.ru/projects/mpmi/files/skins/Shortcuts/diamond_light.png" },
    { label: "ФинКод: всё об инвестициях", image: "https://headless-cms7.vtb.ru/projects/mpmi/files/skins/Shortcuts/fincod_light.png" },
    { label: "Голосования акционеров", image: "https://headless-cms7.vtb.ru/projects/mpmi/files/skins/Shortcuts/check_light.png" },
    { label: "Индивидуальный подход с Advisory", image: "https://headless-cms7.vtb.ru/projects/mpmi/files/skins/Shortcuts/profile_light.png" },
  ];

  function renderTileGrid() {
    const grid = document.getElementById("tileGrid");
    grid.innerHTML = "";
    TILE_ITEMS.forEach((tile) => {
      const btn = document.createElement("button");
      btn.className = "tile-card" + (tile.bg ? " tile-card--gradient" : "");
      if (tile.bg) btn.style.background = tile.bg;
      const iconHTML = tile.image ? `<img class="tile-card-icon" src="${tile.image}" alt="" draggable="false" />` : "";
      btn.innerHTML = `<div class="tile-card-label">${tile.label}</div>${iconHTML}`;
      btn.addEventListener("click", () => showToast("Демо: действие недоступно"));
      grid.appendChild(btn);
    });
  }

  renderTileGrid();

  /* Инфо-шторка (Новые размещения / Фонды / Инвестидеи / Индекс ВТБ) */

  const INFO_TEXTS = {
    placements: {
      title: "Новые размещения",
      text: "В блоке отображаются новые выпуски облигаций и других активов. Также здесь можно найти акции компаний, которые выходят на IPO или SPO — размещают акции впервые или выпускают в обращение дополнительные бумаги.\n\nРазмещения — это первичный рынок, все ценные бумаги вы покупаете напрямую у компании или государства.\n\nЧтобы участвовать в размещении, зайдите на карточку актива и нажмите кнопку «Участвовать». Если размещение еще не началось, вы можете подписаться на обновления.",
    },
    funds: {
      title: "Фонды ВТБ",
      text: "Фонд — это готовый набор акций, облигаций и других активов. Покупая долю в фонде, вы инвестируете сразу в десятки или сотни активов. Это снижает зависимость портфеля от каждой конкретной бумаги и существенно снижает риск.\n\nЕсли вы владеете долей от 3 лет, то после ее продажи или погашения, в том числе частичного, можете получить налоговый вычет.",
    },
    ideas: {
      title: "Инвестидеи на короткий срок",
      text: "В блоке отображаются инвестидеи на срок от 1 до 6 месяцев. В начале — самые актуальные.\n\nИнвестидея — это мнение наших аналитиков, что в ближайшие несколько месяцев определенная акция или облигация может подорожать из-за краткосрочных причин. Например, если компания публикует хороший финансовый отчет, объявляет дивиденды или покупает конкурента.\n\nПотенциальная доходность определяется так: мы сравниваем текущую цену с ценой, которую ожидают аналитики через 1–6 месяцев.\n\nВажно: инвестидеи — это не индивидуальные рекомендации, а помощь в выборе. Решение о том, покупать или продавать, принимаете только вы сами.",
    },
    mood: {
      title: "Как рассчитывается индекс ВТБ",
      text: "Чтобы определить настроение инвесторов — клиентов ВТБ, сумма всех покупок акций делится на общий объем торгов акциями среди сделок клиентов ВТБ и умножается на 100%. Полученный процент и есть индекс ВТБ.\n\nПоказатель от 0% до 49% означает, что большинство инвесторов настроены негативно и продают акции.\n\nОт 49% до 51% — нейтральное настроение рынка, при котором покупки и продажи акций примерно равны.\n\nПри показателе от 51% до 100% покупок акций больше продаж — это означает, что большинство инвесторов настроены позитивно.",
    },
  };

  document.querySelectorAll("[data-info]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const info = INFO_TEXTS[btn.dataset.info];
      if (!info) return;
      document.getElementById("infoSheetTitle").textContent = info.title;
      document.getElementById("infoSheetText").textContent = info.text;
      openScreen(infoSheet);
    });
  });

  document.getElementById("infoSheetClose").addEventListener("click", closeTop);
  document.getElementById("infoSheetOk").addEventListener("click", closeTop);

  /* Поиск инструментов */

  document.getElementById("searchBarBtn").addEventListener("click", () => {
    renderSearchResults("");
    document.getElementById("searchInput").value = "";
    openScreen(searchSheet);
    document.getElementById("searchInput").focus();
  });
  document.getElementById("searchBack").addEventListener("click", closeTop);

  function renderSearchResults(query) {
    const list = document.getElementById("searchResultsList");
    list.innerHTML = "";
    const q = query.trim().toLowerCase();
    const matches = DEMO_STOCKS.filter(
      (s) => !q || s.name.toLowerCase().includes(q) || s.ticker.toLowerCase().includes(q)
    );
    if (matches.length === 0) {
      list.innerHTML = '<div class="picker-empty">Ничего не найдено</div>';
      return;
    }
    matches.forEach((stock) => {
      const row = document.createElement("button");
      row.className = "feed-stock-row";
      row.innerHTML = `
        <div>
          <div class="feed-stock-name">${stock.name}</div>
          <div class="feed-stock-ticker">${stock.ticker}</div>
        </div>
        <div class="feed-stock-right">
          <div class="feed-stock-price">${stock.price}</div>
          <div class="feed-stock-change ${stock.positive ? "positive" : "negative"}">${stock.changeAbs} · ${stock.changePct}</div>
        </div>
      `;
      row.addEventListener("click", () => showToast(`Демо: карточка «${stock.name}» недоступна`));
      list.appendChild(row);
    });
  }

  document.getElementById("searchInput").addEventListener("input", (e) => {
    renderSearchResults(e.target.value);
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
  let appliedCurrencyFilter = new Set(["RUB"]); // default filter: Ruble only; null = show all currencies
  let filterChoice = "RUB";
  let zeroSectionOpen = false;

  const destAccounts = [
    {
      id: "d-brok-main",
      type: "Брокерский счет",
      agreement: "11MD3A",
      market: "Основной",
      extra: "",
      balance: 10.23,
      fundable: true,
      icon: "account",
    },
    {
      id: "d-iis-main",
      type: "ИИС",
      agreement: "144IMP",
      market: "Основной",
      extra: "",
      balance: 1.16,
      fundable: true,
      icon: "account_iis",
    },
    {
      id: "d-iis-otc",
      type: "ИИС",
      agreement: "144IMP",
      market: "Внебиржевой",
      extra: "",
      balance: 0,
      fundable: false,
      icon: "account_iis",
    },
    {
      id: "d-iis-fut",
      type: "ИИС",
      agreement: "144IMP",
      market: "Срочный",
      extra: "SPBFUT1927c",
      balance: 0,
      fundable: false,
      icon: "account_iis",
    },
  ];
  let selectedDestId = "d-brok-main";
  let destMarketFilter = null; // single market string, null = show all
  let destAgreementFilter = null; // single agreement string, null = show all
  let destFilterMarketChoice = null;
  let destFilterAgreementChoice = null;

  function getDestById(id) {
    return destAccounts.find((a) => a.id === id) || null;
  }

  function destSubLabel(acc) {
    return acc.extra ? `${acc.agreement} • ${acc.extra} • ${acc.market}` : `${acc.agreement} • ${acc.market}`;
  }

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
    const dest = getDestById(selectedDestId);
    const sumEl = document.getElementById("refillDestSum");
    const subEl = document.getElementById("refillDestSub");
    const avatarEl = document.getElementById("refillDestAvatar");
    if (!dest) {
      sumEl.textContent = "Выберите счёт";
      subEl.textContent = "";
      avatarEl.innerHTML = "";
      return;
    }
    sumEl.textContent = formatAmountDisplay(dest.balance, "RUB");
    subEl.textContent = `${dest.type} • ${destSubLabel(dest)}`;
    avatarEl.innerHTML = brokerAvatarInnerSVG(dest.icon);
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
    const dest = getDestById(selectedDestId);
    const destCurrency = "RUB";

    const raw = input.value.replace(/\s/g, "").replace(",", ".");
    const amount = raw ? parseFloat(raw) : 0;

    errorEl.textContent = "";
    let valid = false;

    if (!dest) {
      valid = false;
    } else if (!dest.fundable) {
      errorEl.textContent = "Пополнение на этот счет недоступно";
      valid = false;
    } else if (!source) {
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
    return { amount, source, dest, valid };
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
    const { amount, source, dest, valid } = validateRefill();
    if (!valid) return;

    dest.balance += amount;
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
    renderDestPickerHeaderChips();
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
  document.getElementById("destFilterClose").addEventListener("click", closeTop);

  function destAccountVisible(acc) {
    const marketOk = !destMarketFilter || destMarketFilter === acc.market;
    const agreementOk = !destAgreementFilter || destAgreementFilter === acc.agreement;
    return marketOk && agreementOk;
  }

  function destAccountRowHTML(acc, selected) {
    return `
      ${brokerAvatarSVG(acc.icon)}
      <span class="picker-account-info">
        <span class="picker-account-name">${formatAmountDisplay(acc.balance, "RUB")}</span>
        <span class="picker-account-sub">${acc.type}</span>
        <span class="picker-account-sub">${destSubLabel(acc)}</span>
      </span>
      <span class="picker-radio${selected ? " checked" : ""}"></span>
    `;
  }

  function renderDestPicker() {
    const list = document.getElementById("destPickerList");
    list.innerHTML = "";
    const visible = destAccounts.filter(destAccountVisible);
    if (visible.length === 0) {
      list.innerHTML = '<div class="picker-empty">Нет счетов по выбранным фильтрам</div>';
      return;
    }
    visible.forEach((acc) => {
      const item = document.createElement("button");
      item.className = "picker-account-row";
      item.innerHTML = destAccountRowHTML(acc, acc.id === selectedDestId);
      item.addEventListener("click", () => {
        selectedDestId = acc.id;
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

  const BROKER_AVATAR_PALETTE = {
    account: {
      radial: ["rgb(131,182,255)", "rgb(68,145,255)", "rgb(8,95,228)"],
      icon: "rgb(51,149,255)",
    },
    account_iis: {
      radial: ["rgb(129,126,255)", "rgb(76,88,240)", "rgb(55,3,254)"],
      icon: "rgb(111,111,255)",
    },
  };

  function brokerAvatarInnerSVG(paletteKey) {
    const uid = `pb${avatarUidCounter++}`;
    const palette = BROKER_AVATAR_PALETTE[paletteKey] || BROKER_AVATAR_PALETTE.account;
    return `
      <svg viewBox="0 0 40 40" width="40" height="40" fill="none">
        <defs>
          <radialGradient cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(40,0,0,40,20,0)" id="${uid}Radial">
            <stop stop-color="${palette.radial[0]}" offset="0.458007812"></stop>
            <stop stop-color="${palette.radial[1]}" offset="0.78439939"></stop>
            <stop stop-color="${palette.radial[2]}" offset="1"></stop>
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
        <path d="M10.587 28.4125C10.786 28.6111 11.0051 28.7594 11.2446 28.8573C11.4768 28.9524 11.7285 29 11.9998 29L28.0002 29C28.5503 29 29.0213 28.8042 29.413 28.4125C29.8047 28.0208 30 27.55 30 27L30 16C30 15.45 29.8047 14.9792 29.413 14.5875C29.0213 14.1958 28.5503 14 28.0002 14L25.5556 13.9118C24.7233 12.8889 24.2697 11.4445 23.4125 10.5875C23.0208 10.1958 22.5499 10 21.9998 10L18.0002 10C17.729 10 17.4772 10.0476 17.245 10.1427C17.0063 10.2406 16.7864 10.3889 16.5875 10.5875C15.7259 11.4492 15.2539 12.9591 14.4444 14L11.9998 14C11.7285 14 11.4768 14.0476 11.2446 14.1427C11.0051 14.2406 10.786 14.3889 10.587 14.5875C10.3852 14.79 10.2351 15.0136 10.1367 15.2584C10.0456 15.4871 10 15.7343 10 16L10 27C10 27.55 10.1953 28.0208 10.587 28.4125ZM23.4125 14L16.5875 14L18.0002 12L21.9998 12L23.4125 14ZM19.9957 19.3641C18.6784 19.3641 12.0052 18.2255 12.0052 18.2255L11.9965 19.9247C11.9965 19.9247 15.3494 20.496 17.7778 20.8265L17.7778 21.1765C17.7778 21.7938 18.2747 22.2941 18.8889 22.2941L21.1111 22.2941C21.7253 22.2941 22.2222 21.7938 22.2222 21.1765L22.2222 20.8247C24.6506 20.493 27.997 19.9212 27.997 19.9212L27.9991 18.2301C27.9991 18.2301 21.3151 19.3641 19.9957 19.3641Z" fill="${palette.icon}" fill-rule="evenodd"></path>
      </svg>
    `;
  }

  function brokerAvatarSVG(paletteKey) {
    return `<span class="refill-avatar refill-avatar--vtb">${brokerAvatarInnerSVG(paletteKey)}</span>`;
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

  function updateFilterButtonState() {
    const isFiltered = !!appliedCurrencyFilter;
    document.getElementById("filterOpenBtn").classList.toggle("active", isFiltered);
    document.getElementById("filterDot").hidden = !isFiltered;
  }

  function renderPickerHeaderChip() {
    const actions = document.getElementById("pickerHeaderActions");
    const existing = document.getElementById("pickerActiveFilterChip");
    if (existing) existing.remove();
    updateFilterButtonState();
    if (!appliedCurrencyFilter) return;
    const currency = Array.from(appliedCurrencyFilter)[0];
    const label = currency === "RUB" ? "Рубль" : "Юань";
    const chip = document.createElement("button");
    chip.className = "picker-active-filter-chip";
    chip.id = "pickerActiveFilterChip";
    chip.innerHTML = `${label}<svg width="16" height="16" viewBox="0 0 16 16" fill="#75767F"><path fill="#75767F" d="m7.99 8.99-3.47 3.48c-.13.13-.3.19-.5.19s-.37-.06-.5-.19a.678.678 0 0 1-.19-.5c0-.2.06-.37.19-.5L7 8 3.52 4.52a.678.678 0 0 1-.19-.5c0-.2.06-.37.19-.5s.3-.19.5-.19.37.06.5.19L7.99 7l3.48-3.48c.13-.13.3-.19.5-.19s.37.06.5.19.19.3.19.5-.06.37-.19.5L8.99 8l3.48 3.47c.13.13.19.3.19.5s-.06.37-.19.5-.3.19-.5.19-.37-.06-.5-.19L7.99 8.99Z"></path></svg>`;
    chip.addEventListener("click", () => {
      appliedCurrencyFilter = null;
      zeroSectionOpen = false;
      renderBankPicker();
      renderPickerHeaderChip();
    });
    actions.appendChild(chip);
  }

  function updateFilterRows() {
    document.querySelectorAll(".filter-row").forEach((row) => {
      row.classList.toggle("selected", row.dataset.currency === filterChoice);
    });
  }

  document.getElementById("filterOpenBtn").addEventListener("click", () => {
    filterChoice = appliedCurrencyFilter ? Array.from(appliedCurrencyFilter)[0] : "RUB";
    updateFilterRows();
    openScreen(filterSheet);
  });

  document.querySelectorAll(".filter-row").forEach((row) => {
    row.addEventListener("click", () => {
      filterChoice = row.dataset.currency;
      updateFilterRows();
    });
  });

  document.getElementById("filterApplyBtn").addEventListener("click", () => {
    appliedCurrencyFilter = new Set([filterChoice]);

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

  function updateDestFilterButtonState() {
    const isFiltered = !!destMarketFilter || !!destAgreementFilter;
    document.getElementById("destFilterOpenBtn").classList.toggle("active", isFiltered);
    document.getElementById("destFilterDot").hidden = !isFiltered;
  }

  function renderDestPickerHeaderChips() {
    const actions = document.getElementById("destPickerHeaderActions");
    actions.querySelectorAll(".picker-active-filter-chip").forEach((chip) => chip.remove());
    updateDestFilterButtonState();

    function addChip(label, onRemove) {
      const chip = document.createElement("button");
      chip.className = "picker-active-filter-chip";
      chip.innerHTML = `${label}<svg width="16" height="16" viewBox="0 0 16 16" fill="#75767F"><path fill="#75767F" d="m7.99 8.99-3.47 3.48c-.13.13-.3.19-.5.19s-.37-.06-.5-.19a.678.678 0 0 1-.19-.5c0-.2.06-.37.19-.5L7 8 3.52 4.52a.678.678 0 0 1-.19-.5c0-.2.06-.37.19-.5s.3-.19.5-.19.37.06.5.19L7.99 7l3.48-3.48c.13-.13.3-.19.5-.19s.37.06.5.19.19.3.19.5-.06.37-.19.5L8.99 8l3.48 3.47c.13.13.19.3.19.5s-.06.37-.19.5-.3.19-.5.19-.37-.06-.5-.19L7.99 8.99Z"></path></svg>`;
      chip.addEventListener("click", () => {
        onRemove();
        renderDestPicker();
        renderDestPickerHeaderChips();
      });
      actions.appendChild(chip);
    }

    if (destMarketFilter) {
      addChip(destMarketFilter, () => {
        destMarketFilter = null;
      });
    }
    if (destAgreementFilter) {
      addChip(destAgreementFilter, () => {
        destAgreementFilter = null;
      });
    }
  }

  function updateDestFilterPills() {
    document.querySelectorAll("#destMarketChips .filter-pill").forEach((pill) => {
      pill.classList.toggle("selected", pill.dataset.market === destFilterMarketChoice);
    });
    document.querySelectorAll("#destAgreementChips .filter-pill").forEach((pill) => {
      pill.classList.toggle("selected", pill.dataset.agreement === destFilterAgreementChoice);
    });
  }

  function updateDestFilterApplyState() {
    const btn = document.getElementById("destFilterApplyBtn");
    const active = !!destFilterMarketChoice || !!destFilterAgreementChoice;
    btn.disabled = !active;
    btn.classList.toggle("active", active);
  }

  document.getElementById("destFilterOpenBtn").addEventListener("click", () => {
    destFilterMarketChoice = destMarketFilter;
    destFilterAgreementChoice = destAgreementFilter;
    updateDestFilterPills();
    updateDestFilterApplyState();
    openScreen(destFilterSheet);
  });

  document.querySelectorAll("#destMarketChips .filter-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      const market = pill.dataset.market;
      destFilterMarketChoice = destFilterMarketChoice === market ? null : market;
      updateDestFilterPills();
      updateDestFilterApplyState();
    });
  });

  document.querySelectorAll("#destAgreementChips .filter-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      const agreement = pill.dataset.agreement;
      destFilterAgreementChoice = destFilterAgreementChoice === agreement ? null : agreement;
      updateDestFilterPills();
      updateDestFilterApplyState();
    });
  });

  document.getElementById("destFilterApplyBtn").addEventListener("click", () => {
    if (!destFilterMarketChoice && !destFilterAgreementChoice) return;
    destMarketFilter = destFilterMarketChoice;
    destAgreementFilter = destFilterAgreementChoice;

    const currentDest = getDestById(selectedDestId);
    if (!currentDest || !destAccountVisible(currentDest)) {
      selectedDestId = null;
    }

    renderDestPicker();
    renderDestPickerHeaderChips();
    refreshDestRow();
    validateRefill();
    closeTop();
  });

  refreshDestRow();
  refreshSourceRow();
})();
