const diaryEntries = [
  { date: "2026-06-02", time: "07:42" },
  { date: "2026-06-02", time: "21:05" },
  { date: "2026-06-04", time: "18:30" },
  { date: "2026-06-07", time: "08:11" },
  { date: "2026-06-07", time: "23:18" },
  { date: "2026-06-07", time: "23:54" },
  { date: "2026-06-13", time: "12:07" },
  { date: "2026-06-14", time: "10:20" },
  { date: "2026-06-18", time: "16:44" },
  { date: "2026-06-24", time: "20:16" },
  { date: "2026-06-29", time: "09:40" },
  { date: "2026-06-29", time: "22:12" }
];

const shareablePeople = [
  { name: "佐藤 みどり", id: "@midori", status: "online" },
  { name: "高橋 そうた", id: "@sota", status: "away" },
  { name: "伊藤 かな", id: "@kana", status: "offline" },
  { name: "森本 れん", id: "@ren", status: "online" },
  { name: "山口 ひより", id: "@hiyori", status: "offline" }
];

const entriesByDate = diaryEntries.reduce((acc, entry) => {
  if (!acc[entry.date]) {
    acc[entry.date] = [];
  }
  acc[entry.date].push(entry.time);
  return acc;
}, {});

const monthLabel = document.getElementById("monthLabel");
const calendarGrid = document.getElementById("calendarGrid");
const selectedDateLabel = document.getElementById("selectedDateLabel");
const timeList = document.getElementById("timeList");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const todayBtn = document.getElementById("todayBtn");
const sharePersonList = document.getElementById("sharePersonList");

const now = new Date();
let currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
let selectedDate = formatDateKey(now);

function formatDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function renderCalendar() {
  calendarGrid.innerHTML = "";
  monthLabel.textContent = `${currentMonth.getFullYear()}年 ${currentMonth.getMonth() + 1}月`;

  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const startWeekday = firstDay.getDay();
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();

  const prevMonthDays = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0).getDate();

  const cells = [];

  for (let i = startWeekday - 1; i >= 0; i--) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, prevMonthDays - i);
    cells.push({ date, isOtherMonth: true });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day), isOtherMonth: false });
  }

  while (cells.length % 7 !== 0) {
    const day = cells.length - (startWeekday + daysInMonth) + 1;
    cells.push({ date: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, day), isOtherMonth: true });
  }

  cells.forEach(({ date, isOtherMonth }) => {
    const key = formatDateKey(date);
    const times = entriesByDate[key] || [];
    const dayBtn = document.createElement("button");
    dayBtn.type = "button";
    dayBtn.className = "day-cell";

    if (isOtherMonth) dayBtn.classList.add("is-other-month");
    if (key === formatDateKey(now)) dayBtn.classList.add("is-today");
    if (key === selectedDate) dayBtn.classList.add("is-selected");

    const visibleTimes = times.slice(0, 2).map((t) => `<span class=\"time-chip\">${t}</span>`).join("");
    const more = times.length > 2 ? `<span class=\"time-chip more\">+${times.length - 2}</span>` : "";

    dayBtn.innerHTML = `
      <span class="day-number">${date.getDate()}</span>
      <span class="time-badges">${visibleTimes}${more}</span>
    `;

    dayBtn.addEventListener("click", () => {
      selectedDate = key;
      if (isOtherMonth) {
        currentMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      }
      renderCalendar();
      renderDayDetail();
    });

    calendarGrid.appendChild(dayBtn);
  });
}

function renderDayDetail() {
  const times = entriesByDate[selectedDate] || [];
  selectedDateLabel.textContent = `${selectedDate} の書き込み`;

  if (times.length === 0) {
    timeList.innerHTML = '<li class="time-item">この日の書き込みはまだありません。</li>';
    return;
  }

  timeList.innerHTML = times
    .sort((a, b) => (a > b ? 1 : -1))
    .map((time) => `<li class=\"time-item\">${time}</li>`)
    .join("");
}

function statusLabel(status) {
  if (status === "online") return "オンライン";
  if (status === "away") return "離席中";
  return "オフライン";
}

function renderShareablePeople() {
  sharePersonList.innerHTML = shareablePeople
    .map(
      (person) => `
        <li class="share-person-item">
          <div>
            <div class="share-person-name">${person.name}</div>
            <div class="share-person-id">${person.id}</div>
          </div>
          <span class="share-person-state is-${person.status}">${statusLabel(person.status)}</span>
        </li>
      `
    )
    .join("");
}

prevBtn.addEventListener("click", () => {
  currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
  renderCalendar();
});

nextBtn.addEventListener("click", () => {
  currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
  renderCalendar();
});

todayBtn.addEventListener("click", () => {
  currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  selectedDate = formatDateKey(now);
  renderCalendar();
  renderDayDetail();
});

renderCalendar();
renderDayDetail();
renderShareablePeople();
