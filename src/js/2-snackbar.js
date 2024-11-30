import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector('form');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const delay = formData.get('delay');
  
  if (delay < 0) {
    iziToast.error({
      title: 'Ошибка',
      message: 'Пожалуйста, введите положительное значение задержки.',
    });
    return;
  }

  const state = formData.get('state');

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });

  promise
    .then((delay) => {
      iziToast.success({
        title: 'Успех',
        message: `✅ Fulfilled promise in ${delay}ms`,
      });
    })
    .catch((delay) => {
      iziToast.error({
        title: 'Ошибка',
        message: `❌ Rejected promise in ${delay}ms`,
      });
    });
});
