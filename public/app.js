document.querySelectorAll(`.price`).forEach((it) => {
  it.textContent = new Intl.NumberFormat(`ru-RU`, {
    currency: `rub`,
    style: `currency`,
  }).format(it.textContent);
});

const cardNode = document.querySelector(`#card`);

if (cardNode) {
  cardNode.addEventListener(`click`, (event) => {
    if (event.target.classList.contains(`js-course-remove`)) {
      const id = event.target.dataset.courseId;
      
      fetch(`/card/remove/${id}`, {
        method: `delete`
      }).then((res) => res.json)
        .then((card) => console.log(card))
    }
  });
}