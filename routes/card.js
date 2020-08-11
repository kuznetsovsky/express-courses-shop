const {Router} = require(`express`);
const router = Router();

const Course = require(`../models/course`);

router.get(`/`, async (req, res) => {
  const card = await Card.fetch();
  res.render(`card`, {
    title: `Basket of goods`,
    courses: card.courses,
    totalPrice: card.totalPrice,
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