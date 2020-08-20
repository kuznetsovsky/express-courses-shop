const {Router} = require(`express`);
const {validationResult} = require(`express-validator`);
const router = Router();

const {validatorCourse} = require(`../utils/validators`);

const Course = require(`../models/course`);

const auth = require(`../middleware/auth`);

router.get(`/`, auth, (req, res) => {
  res.render(`add`, {
    title: `Add course`,
    isActiveAdd: true,
  });
})

router.post(`/`, auth, validatorCourse, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render(`add`, {
      title: `Add course`,
      isActiveAdd: true,
      courseError: errors.array()[0].msg,
      data: {
        title: req.body[`course-name`],
        price: req.body[`course-price`],
        imageUrl: req.body[`course-image-url`],
      }
    });
  }

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