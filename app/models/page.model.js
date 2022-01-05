module.exports = mongoose => {
  const Page = mongoose.model(
    "page",
    mongoose.Schema(
      {
        title: String,
        description: String,
        link: String,
        fields: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: "field"
        }],
        form: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "form"
        }
      },
      { timestamps: true }
    )
  );

  return Page;
};