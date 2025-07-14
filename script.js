const form = document.getElementById('budget-form');
const dailyBreakdown = document.getElementById('daily-breakdown');
const weeklyTotalEl = document.getElementById('weekly-total');
const resetBtn = document.getElementById('reset-week');

let data = JSON.parse(localStorage.getItem('budgetarian-data')) || {};

function updateUI() {
  dailyBreakdown.innerHTML = '';
  let weeklyTotal = 0;

  const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

  days.forEach(day => {
    const entries = data[day] || [];
    if (entries.length === 0) return;

    const dayTotal = entries.reduce((sum, e) => sum + e.amount, 0);
    weeklyTotal += dayTotal;

    const div = document.createElement('div');
    div.innerHTML = `<strong>${day}:</strong> ₱${dayTotal} from ${entries.length} people`;
    dailyBreakdown.appendChild(div);
  });

  weeklyTotalEl.textContent = `₱${weeklyTotal}`;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim() || 'Anonymous';
  const amount = parseFloat(document.getElementById('amount').value);
  const day = document.getElementById('day').value;

  // Validation
  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid amount greater than ₱0.");
    return;
  }

  if (!day) {
    alert("Please select a day.");
    return;
  }

  if (!data[day]) data[day] = [];
  data[day].push({ name, amount });

  localStorage.setItem('budgetarian-data', JSON.stringify(data));
  form.reset();
  updateUI();
});

// Reset week handler
resetBtn.addEventListener('click', () => {
  const confirmReset = confirm("Are you sure you want to reset the week's data?");
  if (confirmReset) {
    data = {};
    localStorage.removeItem('budgetarian-data');
    updateUI();
  }
});

updateUI();

const themeSwitch = document.getElementById('theme-switch');

// Load previous mode
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  document.body.classList.add(savedTheme);
  if (savedTheme === 'dark-mode') themeSwitch.checked = true;
}

// Toggle theme
themeSwitch.addEventListener('change', () => {
  if (themeSwitch.checked) {
    document.body.classList.replace('light-mode', 'dark-mode') ||
    document.body.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark-mode');
  } else {
    document.body.classList.replace('dark-mode', 'light-mode') ||
    document.body.classList.add('light-mode');
    localStorage.setItem('theme', 'light-mode');
  }
});

const tips = [
  "Track every peso you spend for a week. You'll be surprised.",
  "Always pay yourself first—save before you spend.",
  "Avoid impulse buying: wait 24 hours before buying non-essentials.",
  "Cook at home more often to save hundreds monthly.",
  "Set a weekly spending limit—and stick to it!",
  "Budgeting isn’t punishment. It’s power.",
  "Use cash when possible—it hurts more than swiping.",
  "Cut 1 subscription you barely use. Instant savings!",
  "Group expenses by categories: needs, wants, future.",
  "Small daily savings can build big emergency funds!"
];

const tipDisplay = document.getElementById('daily-tip');
const today = new Date().getDate(); // simple rotation based on day
tipDisplay.textContent = tips[today % tips.length];

