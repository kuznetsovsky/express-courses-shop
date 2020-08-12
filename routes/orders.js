const { Router } = require(`express`);
const router = Router();

const OrderModel = require(`../models/order`);

const auth = require(`../middleware/auth`);

router.get(`/`, auth, async (req, res) => {
  try {
    
    const orders = await OrderModel.
      find({ 'user.userId': req.user._id }).
      lean().
      populate(`user.userId`);

    res.render(`orders`, {
      isOrder: true,
      title: `Orders`,
      orders: orders.map((it) => {
        return {
          ...it,
          price: it.courses.reduce((total, items) => {
            return total += items.count * items.course.price;
          }, 0),
        }
      }),
    });

  } catch (error) {
    console.log(error);
  }
});

router.post(`/`, auth, async (req, res) => {
  try {
    const user = await req.user.populate(`cart.items.courseId`).execPopulate();

    const courses = user.cart.items.map((it) => ({
      count: it.count,
      course: { ...it.courseId._doc },
    }));

    const order = new OrderModel({
      user: {
        name: req.user.name,
        userId: req.user,
      },
      courses,
    });

    await order.save();
    await req.user.clearCart();

    res.redirect(`/orders`);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;