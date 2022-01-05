const { getPagination } = require("../helpers/paginate");
const db = require("../models");
const Form = db.form;
const Field = db.field;
const Page = db.page;

// Create and Save a new Form
exports.create = async (req, res) => {

  if (!req.body.pages) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }
  try {
    const pages = req.body.pages;
    console.log('pages length', pages.length);
    for (let index = 0; index < pages.length; index++) {
      const bodyPage = {
        title: pages[index].title,
        description: pages[index].description,
      }
      const createPage = await Page.create(bodyPage);
      console.log("\n>> createPage:\n", createPage);
      const arrayField = req.body.pages[index].fields;
      console.log('innerArrayField', arrayField);
      for (let i = 0; i < arrayField.length; i++) {
        arrayField[i].page= createPage._id
        const createField = await Field.create(arrayField[i]);
        console.log("\n>> createField:\n", createField);
        const pageUpdate = await Page.findByIdAndUpdate(
          createPage._id,
          { $push: { fields: createField._id } },
          { new: true, useFindAndModify: false }
        );
        console.log("\n>> updatePage:\n", pageUpdate);

      }
      const createForm = await Form.create({ published: false })
      console.log("\n>> createForm:\n", createForm);
      const formUpdate = await Form.findByIdAndUpdate(
        createForm._id,
        { $push: { pages: createPage._id } },
        { new: true, useFindAndModify: false }
      );
      const pageUpdate1 = await Page.findByIdAndUpdate(
        createPage._id,
        { form: createForm._id },
        { new: true, useFindAndModify: false }
      );
      console.log("\n>>pageUpdate1:\n", pageUpdate1);

      console.log("\n>> updateForm:\n", formUpdate);
      const result = await Form.findById(createForm._id)
        .populate({
          path: 'pages',
          model: 'page',
          populate: {
            path: 'fields',
            model: 'field'
          }
        })
      res.status(201).send(result)
    }

  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the Form."
    });
  }
}

// Retrieve all Forms from the database.
exports.findAll = (req, res) => {
  const { page, size, title } = req.query;
  const published = req.query.published;
  var condition = published ? { published: published } : {};
  const { limit, offset } = getPagination(page, size);

  Form.find(condition).populate({
    path: 'pages',
    model: 'page',
    populate: {
      path: 'fields',
      model: 'field'
    }
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Form."
      });
    });
};

// Find a single Form with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Form.findById(id)
    .populate({
      path: 'pages',
      model: 'page',
      populate: {
        path: 'fields',
        model: 'field'
      }
    })
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Form with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Form with id=" + id });
    });
};

// Update a Form by the id in the request
exports.update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;
  const form = awaitForm.findById(id)
    .populate({
      path: 'pages',
      model: 'page',
      populate: {
        path: 'fields',
        model: 'field'
      }
    })
  if (req.body.pages) {
    const pages = req.body.pages;
    console.log('pages length', pages.length);
    for (let index = 0; index < pages.length; index++) {
      const bodyPage = {
        title: pages[index].title,
        description: pages[index].description,
      }
      const createPage = await Page.findByIdAndUpdate(id, bodyPage, { useFindAndModify: false });
      console.log("\n>> createPage:\n", createPage);
      const arrayField = req.body.pages[index].fields;
      console.log('innerArrayField', arrayField);
      for (let i = 0; i < arrayField.length; i++) {
        const createField = await Field.create(arrayField[i]);
        console.log("\n>> createField:\n", createField);
        const pageUpdate = await Page.findByIdAndUpdate(
          createPage._id,
          { $push: { fields: createField._id } },
          { new: true, useFindAndModify: false }
        );
        console.log("\n>> updatePage:\n", pageUpdate);

      }
      const createForm = await Form.create({ published: false })
      console.log("\n>> createForm:\n", createForm);
      const formUpdate = await Form.findByIdAndUpdate(
        createForm._id,
        { $push: { pages: createPage._id } },
        { new: true, useFindAndModify: false }
      );
      console.log("\n>> updateForm:\n", formUpdate);
      const result = await Form.findById(createForm._id)
        .populate({
          path: 'pages',
          model: 'page',
          populate: {
            path: 'fields',
            model: 'field'
          }
        })
      res.send(result)
    }
  }

  // Form.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
  //   .then(data => {
  //     if (!data) {
  //       res.status(404).send({
  //         message: `Cannot update Form with id=${id}. Maybe Form was not found!`
  //       });
  //     } else res.send({ message: "Form was updated successfully." });
  //   })
  //   .catch(err => {
  //     res.status(500).send({
  //       message: "Error updating Form with id=" + id
  //     });
  //   });
};

// Delete a Form with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Form.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Form with id=${id}. Maybe Form was not found!`
        });
      } else {
        res.send({
          message: "Form was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Form with id=" + id
      });
    });
};

// Delete all Forms from the database.
exports.deleteAll = (req, res) => {
  Form.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Form were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Form."
      });
    });
};

// Find all published Forms
exports.findAllPublished = (req, res) => {
  // Form.find({ published: true })
  // .then(data => {
  //   res.send(data);
  // })
  // .catch(err => {
  //   res.status(500).send({
  //     message:
  //       err.message || "Some error occurred while retrieving Forms."
  //   });
  // });
};