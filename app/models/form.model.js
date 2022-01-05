module.exports = mongoose => {
  const Form = mongoose.model(
    "form",
    mongoose.Schema({
      published: Boolean,
      pages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "page"
      }]
    },
      { timestamps: true }
    )
  );

  return Form;
};