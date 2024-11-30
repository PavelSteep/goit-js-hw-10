import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const timerDisplay = document.querySelector('.timer');
const startButton = document.querySelector('[data-start]');
startButton.disabled = true;

let selectedDate = null;
let timerId = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const currentDate = new Date();
    selectedDate = selectedDates[0];

    if (selectedDate <= currentDate) {
      iziToast.error({
        title: 'Ошибка',
        message: 'Пожалуйста, выберите дату в будущем.',
      });
      startButton.disabled = true;
    } else {
      iziToast.success({
        title: 'Успех',
        message: 'Дата выбрана корректно. Вы можете запустить таймер.',
      });
      startButton.disabled = false;
    }
  },
};

flatpickr("#datetime-picker", options);

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function updateTimer({ days, hours, minutes, seconds }) {
  timerDisplay.querySelector('[data-days]').textContent = addLeadingZero(days);
  timerDisplay.querySelector('[data-hours]').textContent = addLeadingZero(hours);
  timerDisplay.querySelector('[data-minutes]').textContent = addLeadingZero(minutes);
  timerDisplay.querySelector('[data-seconds]').textContent = addLeadingZero(seconds);
}

function startTimer() {
  const startTime = selectedDate.getTime();

  timerId = setInterval(() => {
    const currentTime = new Date().getTime();
    const deltaTime = startTime - currentTime;

    if (deltaTime <= 0) {
      clearInterval(timerId);
      updateTimer({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      iziToast.info({
        title: 'Таймер завершен',
        message: 'Время вышло!',
      });
      return;
    }

    const timeComponents = convertMs(deltaTime);
    updateTimer(timeComponents);
  }, 1000);
}

startButton.addEventListener('click', () => {
  startTimer();
  startButton.disabled = true;
});
