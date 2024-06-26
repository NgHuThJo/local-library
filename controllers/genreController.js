const Book = require("../models/book");
const Genre = require("../models/genre");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

// Display list of all Genre.
exports.genre_list = asyncHandler(async (req, res, next) => {
  const allGenres = await Genre.find({}).sort({ name: 1 }).exec();
  res.render("layout", {
    title: "Genre List",
    genre_list: allGenres,
    content: "./genre_list",
  });
});

// Display detail page for a specific Genre.
exports.genre_detail = asyncHandler(async (req, res, next) => {
  const [genre, booksInGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({ genre: req.params.id }, "title summary").exec(),
  ]);

  if (genre === null) {
    const err = new Error("Genre not found");
    err.status = 404;
    return next(err);
  }

  res.render("layout", {
    title: "Genre Detail",
    genre: genre,
    genre_books: booksInGenre,
    content: "./genre_detail",
  });
});

// Display Genre create form on GET.
exports.genre_create_get = (req, res, next) => {
  res.render("layout", {
    title: "Create Genre",
    content: "./genre_form",
  });
};

// Handle Genre create on POST.
exports.genre_create_post = [
  // Validate and sanitize the name field.
  body("name", "Genre name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    const genre = new Genre({ name: req.body.name });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("layout", {
        title: "Create Genre",
        genre: genre,
        errors: errors.array(),
        content: "./genre_form",
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Genre with same name already exists.
      const genreExists = await Genre.findOne({ name: req.body.name })
        .collation({ locale: "en", strength: 2 })
        .exec();
      if (genreExists) {
        // Genre exists, redirect to its detail page.
        res.redirect(genreExists.url);
      } else {
        await genre.save();
        // New genre saved. Redirect to genre detail page.
        res.redirect(genre.url);
      }
    }
  }),
];

// Display Genre delete form on GET.
exports.genre_delete_get = asyncHandler(async (req, res, next) => {
  const [genre, allBooksByGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({ genre: req.params.id }, "title summary").exec(),
  ]);

  if (genre === null) {
    res.redirect("/catalog/genres");
  }

  res.render("layout", {
    title: "Delete Genre",
    genre: genre,
    genre_books: allBooksByGenre,
    content: "./genre_delete",
  });
});

// Handle Genre delete on POST.
exports.genre_delete_post = asyncHandler(async (req, res, next) => {
  const [genre, allBooksByGenre] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({ author: req.params.id }, "title summary").exec(),
  ]);

  if (allBooksByGenre.length > 0) {
    res.render("layout", {
      title: "Delete Genre",
      genre: genre,
      genre_books: allBooksByGenre,
      content: "./genre_delete",
    });
  } else {
    await Genre.findByIdAndDelete(req.body.genreid);
    res.redirect("/catalog/genre");
  }
});

// Display Genre update form on GET.
exports.genre_update_get = asyncHandler(async (req, res, next) => {
  const genre = await Genre.findById(req.params.id).exec();

  res.render("layout", {
    title: "Update Genre",
    genre: genre,
    content: "./genre_form",
  });
});

// Handle Genre update on POST.
exports.genre_update_post = [
  body("name")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Genre must have at least 3 characters.")
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const genre = new Genre({
      name: req.body.name,
      _id: req.params.id,
    });

    // There are errors.
    if (!errors.isEmpty()) {
      // Render form with sanitized input and error messages.
      res.render("layout", {
        title: "Update genre",
        genre: genre,
        errors: errors.array(),
        content: "./genre_form",
      });
    } else {
      const updatedGenre = await Genre.findByIdAndUpdate(
        req.params.id,
        genre,
        {}
      );
      res.redirect(updatedGenre.url);
    }
  }),
];
