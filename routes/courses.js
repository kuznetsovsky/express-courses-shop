const {Router} = require(`express`);
const router = Router();

const Course = require(`../models/course`);

const auth = require(`../middleware/auth`);

router.get(`/`, async (req, res) => {
  const courses = await Course.find()
    .lean()
    .populate(`userId`, `email name`)
    .select(`title price imageUrl`);

  res.render(`courses`, {
    title: `Courses catalog`,
    isActiveCourses: true,
    courses,
  });
});

router.get(`/:id`, async (req, res) => {
  const course = await Course.findById(req.params.id).lean(); 

  res.render(`course`, {
    layout: `empty`,
    title: `Course: ${course.title}`,
    course,
  });
});

router.get(`/:id/edit`, auth, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect(`/`);
  }

  const course = await Course.findById(req.params.id).lean(); 

  res.render(`course-edit`, {
    title: `Edit course ${course.title}`,
    course,
  });
});

router.post(`/edit`, auth, async (req, res) => {
  const id = req.body._id;
  delete  req.body._id;
  await Course.findByIdAndUpdate(id, req.body); 
  res.redirect(`/courses`);
});

router.post(`/remove`, auth, async (req, res) => {
  try {
    await Course.deleteOne({ _id: req.body._id });
    res.redirect(`/courses`);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;