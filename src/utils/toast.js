import Toastify from 'toastify-js';

export default function showToast(text, error = false) {
  Toastify({
    text: String(text),
    duration: 2000,
    close: true,
    gravity: 'bottom', // `top` or `bottom`
    position: 'right', // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: error ? 'red' : 'linear-gradient(to right, #00b09b, #96c93d)',
    },
  }).showToast();
}
