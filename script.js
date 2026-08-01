const holidays = [
    // Major Holidays
    { name: 'New Year', emoji: '🎆', date: '01-01', category: 'major' },
    { name: 'Valentine\'s Day', emoji: '💝', date: '02-14', category: 'major' },
    { name: 'St. Patrick\'s Day', emoji: '🍀', date: '03-17', category: 'cultural' },
    { name: 'Easter', emoji: '🐰', date: '04-09', category: 'major' },
    { name: 'Mother\'s Day', emoji: '👩', date: '05-12', category: 'major' },
    { name: 'Father\'s Day', emoji: '👨', date: '06-18', category: 'major' },
    { name: 'Independence Day', emoji: '🇺🇸', date: '07-04', category: 'major' },
    { name: 'Halloween', emoji: '👻', date: '10-31', category: 'seasonal' },
    { name: 'Thanksgiving', emoji: '🦃', date: '11-23', category: 'major' },
    { name: 'Christmas', emoji: '🎄', date: '12-25', category: 'major' },
    
    // Cultural Holidays
    { name: 'Lunar New Year', emoji: '🧧', date: '02-29', category: 'cultural' },
    { name: 'Cinco de Mayo', emoji: '🇲🇽', date: '05-05', category: 'cultural' },
    { name: 'Diwali', emoji: '🪔', date: '11-01', category: 'cultural' },
    { name: 'Hanukkah', emoji: '🕎', date: '12-25', category: 'cultural' },
    
    // Seasonal Events
    { name: 'Spring Equinox', emoji: '🌸', date: '03-20', category: 'seasonal' },
    { name: 'Summer Solstice', emoji: '☀️', date: '06-21', category: 'seasonal' },
    { name: 'Fall Equinox', emoji: '🍂', date: '09-22', category: 'seasonal' },
    { name: 'Winter Solstice', emoji: '❄️', date: '12-21', category: 'seasonal' },
    
    // Additional Celebrations
    { name: 'Earth Day', emoji: '🌍', date: '04-22', category: 'major' },
    { name: 'Labor Day', emoji: '🏗️', date: '09-01', category: 'major' },
    { name: 'Back to School', emoji: '📚', date: '08-15', category: 'seasonal' },
    { name: 'Black Friday', emoji: '🛍️', date: '11-29', category: 'seasonal' },
    { name: 'Cyber Monday', emoji: '💻', date: '12-02', category: 'seasonal' },
    { name: 'New Year\'s Eve', emoji: '🎊', date: '12-31', category: 'major' },
    { name: 'Groundhog Day', emoji: '🦡', date: '02-02', category: 'cultural' },
    { name: 'Memorial Day', emoji: '🇺🇸', date: '05-27', category: 'major' },
];

let currentFilter = 'all';

function getNextOccurrence(dateString) {
    const [month, day] = dateString.split('-');
    const today = new Date();
    const currentYear = today.getFullYear();
    
    let holidayDate = new Date(currentYear, parseInt(month) - 1, parseInt(day));
    
    // If the holiday has already passed this year, move to next year
    if (holidayDate < today) {
        holidayDate = new Date(currentYear + 1, parseInt(month) - 1, parseInt(day));
    }
    
    return holidayDate;
}

function calculateCountdown(targetDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);
    
    const difference = targetDate - today;
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);
    
    return { days, hours, minutes, seconds };
}

function createHolidayCard(holiday) {
    const nextDate = getNextOccurrence(holiday.date);
    const countdown = calculateCountdown(nextDate);
    const isToday = countdown.days === 0;
    
    const card = document.createElement('div');
    card.className = 'holiday-card';
    card.dataset.category = holiday.category;
    
    let content = `
        <span class="holiday-emoji">${holiday.emoji}</span>
        <div class="holiday-name">${holiday.name}</div>
        <div class="holiday-date">${nextDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
        <div class="holiday-category">${holiday.category.toUpperCase()}</div>
    `;
    
    if (isToday) {
        content += `<div class="holiday-message">🎉 Today! 🎉</div>`;
    } else {
        content += `
            <div class="countdown">
                <div class="countdown-item">
                    <div class="countdown-number">${countdown.days}</div>
                    <div class="countdown-label">Days</div>
                </div>
                <div class="countdown-item">
                    <div class="countdown-number">${countdown.hours}</div>
                    <div class="countdown-label">Hours</div>
                </div>
                <div class="countdown-item">
                    <div class="countdown-number">${countdown.minutes}</div>
                    <div class="countdown-label">Minutes</div>
                </div>
                <div class="countdown-item">
                    <div class="countdown-number">${countdown.seconds}</div>
                    <div class="countdown-label">Seconds</div>
                </div>
            </div>
        `;
    }
    
    card.innerHTML = content;
    return card;
}

function renderHolidays() {
    const grid = document.getElementById('holidaysGrid');
    grid.innerHTML = '';
    
    // Sort holidays by days until next occurrence
    const sortedHolidays = [...holidays].sort((a, b) => {
        const countdownA = calculateCountdown(getNextOccurrence(a.date));
        const countdownB = calculateCountdown(getNextOccurrence(b.date));
        return countdownA.days - countdownB.days;
    });
    
    sortedHolidays.forEach(holiday => {
        if (currentFilter === 'all' || holiday.category === currentFilter) {
            const card = createHolidayCard(holiday);
            grid.appendChild(card);
        }
    });
}

function setupEventListeners() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            renderHolidays();
        });
    });
}

// Update countdowns every second
setInterval(() => {
    renderHolidays();
}, 1000);

// Initial render
setupEventListeners();
renderHolidays();