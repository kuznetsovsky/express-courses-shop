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
  res.redirect(`/courses`);
  const course = new Course(
    req.body[`course-name`], 
    req.body[`course-price`],
    req.body[`course-image-url`]
  );

  await course.save();
})

module.exports = router;