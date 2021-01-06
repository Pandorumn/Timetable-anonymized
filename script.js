const table = document.getElementsByClassName('table')[0];
const timRemBrut = document.querySelectorAll('.info div')[0];
const timRemNett = document.querySelectorAll('.info div')[1];
let ticking = true;

class Event {
    name;
    _durationHours;
    _durationMinutes;
    _startHours;
    _startMinutes;
    constructor(n, dH, dM, sH, sM) {
        this.name = n;
        this._durationHours = dH;
        this._durationMinutes = dM;
        this._startHours = sH;
        this._startMinutes = sM;
    }
    getStartTime() {
        let h = this.startHours;
        let m = this.startMinutes;
        if (this.startMinutes < 10) m = '0' + m;
        return `${h}:${m}`;
    }
    getDurationTime() {
        let h = this._durationHours;
        let m = this._durationMinutes;
        if (this._durationMinutes < 10) m = '0' + m;
        return `${h}:${m}`;
    }
    get durationHours() {
        return this._durationHours;
    }
    set durationHours(h) {
        if (h >= 24) this._durationHours = h - 24;
        else this._durationHours = h;
    }
    get durationMinutes() {
        return this._durationMinutes;
    }
    set durationMinutes(m) {
        if (m >= 60) {
            this._durationMinutes = m - 60;
            this._durationHours++;
        } else this._durationMinutes = m;
    }
    get startHours() {
        return this._startHours;
    }
    set startHours(h) {
        if (h >= 24) this._startHours = h - 24;
        else this._startHours = h;
    }
    get startMinutes() {
        return this._startMinutes;
    }
    set startMinutes(m) {
        if (m >= 60) {
            this._startMinutes = m - 60;
            this._startHours++;
        } else this._startMinutes = m;
    }
}

let eventsTemplates = [
    // Set 1
    [
        new Event('Подъём', 0, 30, 8, 00),
        new Event('---', 2, 00),
        new Event('<div>---</div><div>---</div><div>---</div>', 0, 50),
        new Event('---', 2, 00),
        new Event('<div>---</div><div>---</div>', 1, 25),
        new Event('---', 1, 15),
        new Event('---', 2, 00),
        new Event('<div>---</div><div>---</div><div>---</div>', 0, 50),
        new Event('---', 2, 00),
        new Event('---', 0, 30),
        new Event('---', 1, 00),
        new Event('---', 0, 40),
        new Event('Сон', 9, 00),
    ],
    // Set 2
    [
        new Event('Подъём', 0, 30, 8, 00),
        new Event('---', 2, 00),
        new Event('<div>---</div><div>---</div><div>---</div>', 0, 50),
        new Event('---', 2, 00),
        new Event('<div>---</div><div>---</div>', 2, 00),
        new Event('---', 0, 40),
        new Event('---', 2, 00),
        new Event('<div>---</div><div>---</div><div>---</div>', 0, 50),
        new Event('---', 2, 00),
        new Event('---', 0, 30),
        new Event('---', 1, 00),
        new Event('---', 0, 40),
        new Event('Сон', 9, 00),
    ],
    // Set 3
    [
        new Event('Подъём', 0, 30, 8, 00),
        new Event('---', 2, 00),
        new Event('<div>---</div><div>---</div><div>---</div>', 0, 50),
        new Event('---', 2, 00),
        new Event('<div>---</div><div>---</div>', 1, 30),
        new Event('---', 1, 30),
        new Event('---', 0, 40),
        new Event('---', 1, 00),
        new Event('<div>---</div><div>---</div><div>---</div>', 0, 50),
        new Event('---', 2, 00),
        new Event('---', 0, 30),
        new Event('---', 1, 00),
        new Event('---', 0, 40),
        new Event('Сон', 9, 00),
    ],
    // Set 4
    [
        new Event('Подъём', 0, 30, 8, 00),
        new Event('---', 2, 00),
        new Event('<div>---</div><div>---</div><div>---</div>', 0, 50),
        new Event('---', 2, 00),
        new Event('---', 0, 40),
        new Event('---', 2, 00),
        new Event('---', 0, 30),
        new Event('---', 2, 00),
        new Event('<div>---</div><div>---</div><div>---</div>', 0, 50),
        new Event('---', 1, 30),
        new Event('---', 0, 30),
        new Event('---', 1, 00),
        new Event('---', 0, 40),
        new Event('Сон', 9, 00),
    ],
];

let indexDescr = [
    '0 - Set 1',
    '1 - Set 2',
    '2 - Set 3',
    '3 - Set 4',
];

let currentIndex = 0;

let events = eventsTemplates[currentIndex];

const wasted = new Event('WASTED', 0, 00);

// currentTime.setHours(3);
// currentTime.setMinutes(0);

start();
initialize();

let repeat = setInterval(monitoring, 1000);

monitoring();

table.addEventListener('click', () => {
    // if (ticking) {
    //     clearInterval(repeat);
    //     initialize();
    //     ticking = false;
    // } else {
    //     repeat = setInterval(monitoring, 1000);
    //     ticking = true;
    //     monitoring();
    // }

    if (currentIndex >= 3) currentIndex = -1;
    events = eventsTemplates[++currentIndex];
    start();
    initialize();
    monitoring();
});

function start() {
    // Calculate and set start times
    for (let k in events) {
        if (k < 1) k = 1;
        events[k].startHours =
            events[k - 1].startHours + events[k - 1].durationHours;
        events[k].startMinutes =
            events[k - 1].startMinutes + events[k - 1].durationMinutes;
    }

    // Consider wasted time
    for (let k in events) {
        events[k].startHours += wasted.durationHours;
        events[k].startMinutes += wasted.durationMinutes;
    }
}

function initialize() {
    table.innerHTML = "<div class='current-time'></div>";
    for (let k in events) {
        table.innerHTML += `
        \<div class="event" id="ev${k}"\>
            \<div class="start-time"\>${events[k].getStartTime()}\</div\>
            \<div class="name"\>${events[k].name}\</div\>
            \<div class="duration"\>${events[k].getDurationTime()}\</div\>
            \<div class="remaining-time"\>\</div\>
        \</div\>`;
    }
    let temp = { ...events[events.length - 1] };
    // temp.getStartTime = events[events.length - 1].getStartTime;
    temp.__proto__ = events[events.length - 1].__proto__;
    temp.startHours += events[events.length - 1].durationHours;
    temp.startMinutes += events[events.length - 1].durationMinutes;
    if (temp.getStartTime() !== events[0].getStartTime()) {
        // console.error('Total time mismatch');
        alert('Total time mismatch');
    }
}

function monitoring() {
    let currentTime = new Date();
    document.querySelector('.current-time').textContent =
        currentTime.getHours() +
        ' : ' +
        (currentTime.getMinutes() < 10 ? '0' : '') +
        currentTime.getMinutes() +
        (wasted.durationHours + wasted.durationMinutes
            ? ' (+' +
              (wasted.durationHours +
                  ' : ' +
                  (wasted.durationMinutes < 10 ? '0' : '') +
                  wasted.durationMinutes +
                  ')')
            : '') +
        ` (${indexDescr[currentIndex]})`;
    // currentTime.setHours(currentTime.getHours() + 1);
    // currentTime.setHours(15);
    // currentTime.setMinutes(currentTime.getMinutes() + 31);
    let currentEventIndex = getCurrentEvent(currentTime);
    setActiveEvent(currentEventIndex);
    calcAndSetCompleteness(currentEventIndex, currentTime);
}

function getCurrentEvent(currentTime) {
    for (let k in events) {
        if (k == events.length - 1) {
            return k;
        } else if (
            ((currentTime.getHours() == events[k].startHours &&
                currentTime.getMinutes() >= events[k].startMinutes) ||
                currentTime.getHours() > events[k].startHours) &&
            ((currentTime.getHours() == events[+k + 1].startHours &&
                currentTime.getMinutes() <= events[+k + 1].startMinutes) ||
                currentTime.getHours() < events[+k + 1].startHours)
        ) {
            return k;
        }
    }
}

function setActiveEvent(k) {
    for (let i = 0; i < k; i++) {
        document.querySelector(`#ev${i}`).classList = 'event past';
    }
    document.querySelector(`#ev${k}`).classList = 'event active';
    let i;
    while (i < events.length) {
        if (i < k) {
            document.querySelector(`#ev${i}`).classList = 'event past';
        } else if (i > k) {
            document.querySelector(`#ev${i}`).classList = 'event future';
        } else {
            document.querySelector(`#ev${k}`).classList = 'event active';
        }
    }
}

function calcAndSetCompleteness(k, currentTime) {
    let timePast =
        currentTime.getHours() * 60 +
        currentTime.getMinutes() -
        events[k].startHours * 60 -
        events[k].startMinutes;
    if (timePast < 0) timePast += 1440;
    let totalDuration =
        events[k].durationHours * 60 + events[k].durationMinutes;
    let completeness = (timePast / totalDuration) * 100;
    let timeRemaining = totalDuration - timePast;
    let hRem = Math.floor(timeRemaining / 60);
    let mRem = timeRemaining % 60;
    if (mRem < 10) mRem = '0' + mRem;

    // Set current time
    // document.querySelector(`#ev${k} .current-time`).textContent =
    //     currentTime.getHours() + ':' + currentTime.getMinutes();

    if (hRem || mRem != 0) {
        // Set percentage background fill
        document.querySelector(
            `#ev${k} .name`
        ).style.background = `linear-gradient(to right,
            #0070bb88 ${completeness - 1}%,
            #afddfc ${completeness + 1}%)`;

        // Set remaining time
        document.querySelector(
            `#ev${k} .remaining-time`
        ).textContent = ` ( ${hRem}:${mRem} ) `;
    } else {
        // Clear inline styling
        document.querySelector(`#ev${k} .name`).style.background = '';
        document.querySelector(`#ev${k} .remaining-time`).textContent = '';
    }
}
