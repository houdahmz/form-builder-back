module.exports = mongoose => {
  const Field = mongoose.model(
    "field",
    mongoose.Schema({
      label: String,
      name: String,
      type: String,
      value: String,
      options: [{
        label: String,
        value: String
      }],
      required: Boolean,
      maxLength: Number,
      max: Number,
      min: Number,
      page: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "page"
      }
    },
      { timestamps: true }
    )
  );

  return Field;
};