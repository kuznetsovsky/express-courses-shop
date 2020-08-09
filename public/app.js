document.querySelectorAll(`.price`).forEach((it) => {
  it.textContent = new Intl.NumberFormat(`ru-RU`, {
    currency: `rub`,
    style: `currency`,
  }).format(it.textContent);
});