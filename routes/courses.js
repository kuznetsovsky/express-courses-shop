const {Router} = require(`express`);
const router = Router();

const isOwner = require(`../utils/isOwner`);

const Course = require(`../models/course`);

const auth = require(`../middleware/auth`);

router.get(`/`, async (req, res) => {
  try {
    const courses = await Course.find()
      .lean()
      .populate(`userId`, `email name`)
      .select(`title price imageUrl`);
  
    res.render(`courses`, {
      title: `Courses catalog`,
      isActiveCourses: true,
      userId: req.user ? req.user._id.toString() : null,
      courses,
    });
  } catch (error) {
    console.log(error);
  }
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

  try {
    const course = await Course.findById(req.params.id).lean(); 

    if (!isOwner(course, req)) {
      return res.redirect(`/courses`);
    }

    res.render(`course-edit`, {
      title: `Edit course ${course.title}`,
      course,
    });
    
  } catch (error) {
    console.log(error);
  }
});

router.post(`/edit`, auth, async (req, res) => {
  try {
    const id = req.body._id;
    delete  req.body._id;
    const course = await Course.findById(id);

    if (!isOwner(course, req)) {
      return res.redirect(`/courses`);
    }

    Object.assign(course, req.body);
    await course.save();     
    res.redirect(`/courses`);    
  } catch (error) {
    console.log(error);
  }
});

router.post(`/remove`, auth, async (req, res) => {
  try {
    await Course.deleteOne({ 
      _id: req.body._id,
      userId: req.user._id, 
    });
    res.redirect(`/courses`);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;