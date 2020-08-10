const cardNode = document.querySelector(`#card`);

const toCurrency = (price) => {
  return new Intl.NumberFormat(`ru-RU`, {
    currency: `rub`,
    style: `currency`,
  }).format(price);
}

document.querySelectorAll(`.price`).forEach((it) => {
  it.textContent = toCurrency(it.textContent);
});

if (cardNode) {
  cardNode.addEventListener(`click`, (event) => {
    if (event.target.classList.contains(`js-course-remove`)) {
      const id = event.target.dataset.courseId;

      fetch(`/card/remove/${id}`, {
        method: `delete`
      }).then((res) => res.json())
        .then((card) => {
          if (card.courses.length) {
            const html = card.courses.map((it) => {
              return `
                <tr>
                  <td>${it.title}</td>
                  <td>${it.count}</td>
                  <td>
                    <button class="waves-effect waves-light btn-small js-course-remove" data-course-id="${it._id}">Delete</button>
                  </td>
                </tr>
              `;
            }).join(``);

            cardNode.querySelector(`tbody`).innerHTML = html;
            cardNode.querySelector(`.price`).textContent = toCurrency(card.totalPrice);

          } else {
            cardNode.innerHTML = `<p>There are no items in your cart.</p>`;
          }
        })
    }
  });
}