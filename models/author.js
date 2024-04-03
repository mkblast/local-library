const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const AuthorScheme = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

// virtual for author's full name
AuthorScheme.virtual("name").get(function() {
  // to avoid erros in cases where an author does not have
  // either a family name or first name
  // we want to make sure we handle the exception
  // by returning an empty string for that case.

  let fullname = "";

  if (this.first_name && this.family_name) {
    fullname = `${this.family_name} ${this.first_name}`;
  }

  return fullname;
});

// virtual for author's URL
AuthorScheme.virtual("url").get(function() {
  // we don't use an arrow function as we'll need the `this` object.

  return `/catalog/author/${this._id}`;
});


AuthorScheme.virtual("date_of_birth_formated").get(function() {
  return (
    this.date_of_birth ?
      DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED)
      :
      ""
  )
});

AuthorScheme.virtual("date_of_death_formated").get(function() {
  return (
    this.date_of_death ?
      DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED)
      :
      ""
  )
});

AuthorScheme.virtual("lifespan").get(function() {
  return (`${this.date_of_birth_formated} - ${this.date_of_death_formated}`);
})

// export model
module.exports = mongoose.model("Author", AuthorScheme);
