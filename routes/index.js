const express = require("express");
const router = express.Router();

const myDb = require("../db/myMongoDB.js");

/* GET home page. */
router.get("/", async function (req, res) {

  res.redirect("/events");
});

router.get("/events", async (req, res, next) => {
  console.log("events", req.user);


  const query = req.query.q || "";
  const page = +req.query.page || 1;
  const pageSize = +req.query.pageSize || 24;
  const msg = req.query.msg || null;
  if (msg) req.session.messages = [msg];
  try {
    let total = await myDb.getEventsCount(query);
    let events = await myDb.getEvents(query, page, pageSize);
    let participants = await myDb.getParticipants(query);
    console.log(participants);
    res.render("./pages/index", {
      events,
      participants,
      query,
      msg,
      currentPage: page,
      lastPage: Math.ceil(total/pageSize),
      user: req.user
    });
  } catch (err) {
    next(err);
  }
});


router.get("/events/:_id/edit", async (req, res, next) => {
  const _id = req.params._id;

  const msg = req.query.msg || null;
  if (msg) req.session.messages = [msg];
  try {

    let eve = await myDb.getEventByID(_id);

    console.log("edit event", {
      eve,

      msg,
    });


    res.render("./pages/editEvent", {
      eve,
      msg,
      user: req.user
    });
  } catch (err) {
    next(err);
  }
});

router.post("/events/:_id/edit", async (req, res, next) => {
  const _id = req.params._id;
  const ref = req.body;

  try {

    let updateResult = await myDb.updateEventByID(_id, ref);
    console.log("update", updateResult);

    if (updateResult && updateResult.changes === 1) {
      res.redirect("/events/?msg=Updated");
    } else {
      res.redirect("/events/?msg=Error Updating");
    }

  } catch (err) {
    next(err);
  }
});



router.get("/events/:_id/delete", async (req, res, next) => {
  const _id = req.params._id;

  try {

    let deleteResult = await myDb.deleteEventByID(_id);

    if (deleteResult && deleteResult.changes === 1) {
      res.redirect("/events/?msg=Deleted");
    } else {
      res.redirect("/events/?msg=Error Deleting");
    }

  } catch (err) {
    next(err);
  }
});

router.post("/createEvent", async (req, res, next) => {
  const eve = req.body;

  try {
    const insertRes = await myDb.insertEvent(eve);

    console.log("Inserted", insertRes);
    res.redirect("/events/?msg=Inserted");
  } catch (err) {
    console.log("Error inserting", err);
    next(err);
  }
});

module.exports = router;
