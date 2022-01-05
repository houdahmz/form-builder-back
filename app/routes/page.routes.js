module.exports = app => {
  const pages = require("../controllers/page.controller.js");

  var router = require("express").Router();

  // Create a new page
  router.post("/", pages.create);

  // Retrieve all pages
  router.get("/", pages.findAll);
  router.get("/field", pages.findAllField);

  // Retrieve all published pages
  router.get("/published", pages.findAllPublished);

  // Retrieve a single page with id
  router.get("/:id", pages.findOne);

  // Update a page with id
  router.put("/:id", pages.update);

  router.delete("/field/:id", pages.deleteFieled);

  router.delete("/field", pages.deleteAllField);

  // Delete a page with id
  router.delete("/:id", pages.delete);

  // Create a new page
  router.delete("/", pages.deleteAll);
  app.use('/api/pages', router);
};