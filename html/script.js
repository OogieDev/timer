const { ipcRenderer } = window.require('electron');
const control = document.querySelector('#control');
control.addEventListener('click', setProgress);

const $timerOverlay = document.querySelector('#timer-overlay');
const $time = document.querySelector('#time');
const $content = document.querySelector('#content');
const $contentForm = $content.querySelector('form');

let controlStatus = "Старт";
let work = false;
let interval = null;

let time = 0;

function calculate() {
    let totalSeconds = time;
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    totalSeconds %= 60;
    let seconds = totalSeconds;

    let res = "";
    res += hours < 10 ? `0${hours}:` : `${hours}:`;
    res += minutes < 10 ? `0${minutes}:` : `${minutes}:`;
    res += seconds < 10 ? `0${seconds}` : `${seconds}`;

    return res;
}

function setProgress() {
    if (work) {
        work = false;
        controlStatus = "Старт";
        clearInterval(interval);
        $timerOverlay.classList.remove('animate');
        showForm();
    } else {
        work = true;
        controlStatus = "Стоп";
        $time.innerHTML = calculate();
        $timerOverlay.classList.add('animate');
        interval = setInterval(function () {
            updateTime();
            $time.innerHTML = calculate();
        }, 1000);
    }
    control.innerHTML = controlStatus;
}

function init() {
    time = 0;
    $time.innerHTML = calculate();
}

function updateTime() {
    time += 1;
}

function showForm() {
    $content.classList.add('opened');
}

function hideForm() {
    $content.classList.remove('opened');
}

function saveResult(event) {
    event.preventDefault();
    const task = event.target.task.value;
    const total = calculate();
    ipcRenderer.send('save-event', { task, total });
    init();
    hideForm();
}

$contentForm.addEventListener('submit', saveResult);