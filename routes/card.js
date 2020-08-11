const { Router } = require(`express`);
const router = Router();

const Course = require(`../models/course`);

router.get(`/`, async (req, res) => {
  const user = await req.user.
    populate(`cart.items.courseId`).
    execPopulate();

  const courses = user.cart.items.map((it) => ({
    ...it.courseId._doc,
    count: it.count
  }));

  const totalPrice = courses.reduce((total, it) => {
    return total += it.price * it.count;
  }, 0);

  res.render(`card`, {
    title: `Basket of goods`,
    courses,
    totalPrice,
  });
});

router.post(`/add`, async (req, res) => {
  const course = await Course.findById(req.body._id);
  await req.user.addToCart(course);
  res.redirect(`/card`);
});

router.delete(`/remove/:id`, async (req, res) => {
  const card = await Card.remove(req.params.id);
  res.status(200).json(card);
});

module.exports = router;