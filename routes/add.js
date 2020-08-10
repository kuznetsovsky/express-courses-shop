const {Router} = require(`express`);
const router = Router();

const Course = require(`../models/course`);

router.get(`/`, (req, res) => {
  res.render(`add`, {
    title: `Add course`,
    isActiveAdd: true,
  });
})

router.post(`/`, async (req, res) => {
  const course = new Course({
    title: req.body[`course-name`],
    price: req.body[`course-price`],
    imageUrl: req.body[`course-image-url`],
    userId: req.user,
  });    
  
  try {
    await course.save();
    res.redirect(`/courses`);
  } catch (error) {
    console.log(error);
  }
})

module.exports = router;