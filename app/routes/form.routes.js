module.exports = app => {
    const forms = require("../controllers/form.controller.js");
    const form = require("../controllers/formPublished");

    var router = require("express").Router();
  
    // Create a new form
    router.post("/", forms.create);
  
    // Retrieve all forms
    // router.get("/", forms.findAll);
    router.get("/", forms.findAll);

    // Retrieve all published forms
    router.get("/published", form.findAll);
  
    // Retrieve a single form with id
    router.get("/:id", forms.findOne);
  
    // Update a form with id
    router.put("/:id", forms.update);
  
    // Delete a form with id
    router.delete("/:id", forms.delete);
  
    // Create a new form
    router.delete("/", forms.deleteAll);
  
    app.use('/api/forms', router);
  };