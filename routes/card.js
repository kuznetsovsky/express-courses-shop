const { Router } = require(`express`);
const router = Router();

const Course = require(`../models/course`);

const getCourses = (cart) => {
  return cart.items.map((it) => ({
    ...it.courseId._doc,
    count: it.count
  }));
};

const getTotalPrice = (courses) => {
  return courses.reduce((total, it) => {
    return total += it.price * it.count;
  }, 0);
};

router.get(`/`, async (req, res) => {
  const user = await req.user.
    populate(`cart.items.courseId`).
    execPopulate();

  const courses = getCourses(user.cart);
  const totalPrice = getTotalPrice(courses);

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
  await req.user.removeCartItems(req.params.id);
  const user = await req.user.populate(`cart.items.courseId`).execPopulate();

  const courses = getCourses(user.cart);
  const totalPrice = getTotalPrice(courses);

  const card = {courses, totalPrice};
  res.status(200).json(card);
});

module.exports = router;