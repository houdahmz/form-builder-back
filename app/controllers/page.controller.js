const db = require("../models");
const Pages = db.page;
const Field = db.field;

// Create and Save a new Pages
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a Pages
  const pages = new Pages({
    title: req.body.title,
    description: req.body.description,
    link: req.body.link,

  });

  // Save Pages in the database
  pages
    .save(pages)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Pages."
      });
    });
};

// Retrieve all Pagess from the database.
exports.findAll = (req, res) => {
  const { start_date, end_date } = req.query;
  const title = req.query.title;
  const formId = req.query.formId;

  let conditionDate = null;
  if (start_date && end_date) {
    conditionDate = {
      createdAt: {
        between: [start_date, moment(end_date).add(1, 'days')],
      },
    };
  }
  if (start_date && !end_date) {
    conditionDate = {
      createdAt: { gte: start_date },
    };
  }

  if (!start_date && end_date) {
    conditionDate = {
      createdAt: {
        lte
          : moment(end_date).add(1, 'days')
      },
    };
  }
  var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};
  var conditionForm = formId ? { form: form } : {};

  Pages.find().populate({
    path: 'fields',
    model: 'field'
  }
  )
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Pages."
      });
    });
};
exports.findAllField = (req, res) => {
  const { start_date, end_date } = req.query;
  const title = req.query.title;
  const formId = req.query.formId;

  let conditionDate = null;
  if (start_date && end_date) {
    conditionDate = {
      createdAt: {
        between: [start_date, moment(end_date).add(1, 'days')],
      },
    };
  }
  if (start_date && !end_date) {
    conditionDate = {
      createdAt: { gte: start_date },
    };
  }

  if (!start_date && end_date) {
    conditionDate = {
      createdAt: {
        lte
          : moment(end_date).add(1, 'days')
      },
    };
  }
  var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};
  var conditionForm = formId ? { form: form } : {};

  Field.find().populate({
    path: 'page',
    model: 'page'
  }
  )
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Pages."
      });
    });
};
// Find a single Pages with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Pages.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Pages with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Pages with id=" + id });
    });
};

// Update a Pages by the id in the request
exports.update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }
  try {
    const id = req.params.id;
    const pageUp = await Pages.findById(id)
      .populate({
        path: 'fields',
        model: 'field'
      }
      )
    if (req.body.fields) {
      const arrayField = req.body.fields
      for (let i = 0; i < arrayField.length; i++) {
        const createField = await Field.findByIdAndUpdate(arrayField[i]._id, arrayField[i], { useFindAndModify: false })
        console.log("\n>> createField:\n", createField);
        // const pageUpdate = await Page.findByIdAndUpdate(
        //   createPage._id,
        //   { $push: { fields: createField._id } },
        //   { new: true, useFindAndModify: false }
        // );
        // console.log("\n>> updatePage:\n", pageUpdate);

      }
      res.send(pageUp)

    }
  } catch (err) {
    res.status(500).send({
      message: "Error updating Pages with id=" + id
    })
  }
  // Pages.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
  //   .then(data => {
  //     if (!data) {
  //       res.status(404).send({
  //         message: `Cannot update Pages with id=${id}. Maybe Pages was not found!`
  //       });
  //     } else res.send({ message: "Pages was updated successfully." });
  //   })
  //   .catch(err => {
  //     res.status(500).send({
  //       message: "Error updating Pages with id=" + id
  //     });
  //   });
};

// Delete a Pages with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Pages.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Pages with id=${id}. Maybe Pages was not found!`
        });
      } else {
        res.send({
          message: "Pages was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Pages with id=" + id
      });
    });
};
exports.deleteFieled = (req, res) => {
  const id = req.params.id;

  Field.findByIdAndRemove(id)
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Pages with id=${id}. Maybe Pages was not found!`
        });
      } else {
        res.send({
          message: "Pages was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Pages with id=" + id
      });
    });
};
// Delete all Pagess from the database.
exports.deleteAll = (req, res) => {
  Pages.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Pages were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Pages."
      });
    });
};
exports.deleteAllField = (req, res) => {
  Field.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Pages were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Pages."
      });
    });
};
// Find all published Pagess
exports.findAllPublished = (req, res) => {
  // Pages.find({ published: true })
  // .then(data => {
  //   res.send(data);
  // })
  // .catch(err => {
  //   res.status(500).send({
  //     message:
  //       err.message || "Some error occurred while retrieving Pagess."
  //   });
  // });
};