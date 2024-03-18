const Author = require("../models/author");
const asyncHandler = require("express-async-handler");

exports.author_list = asyncHandler(async (req, res, next) => {
  res.send("not implemented: author list");
});

exports.author_detail = asyncHandler(async (req, res, next) => {
  res.send(`not implemented: author detail: ${req.params.id}`);
});

exports.author_create_get = asyncHandler(async (req, res, next) => {
  res.send("not implemented: author create get");
});

exports.author_create_post = asyncHandler(async (req, res, next) => {
  res.send("not implemented: author create post");
});

exports.author_delete_get = asyncHandler(async (req, res, next) => {
  res.send("not implemented: author delete get");
});

exports.author_delete_post = asyncHandler(async (req, res, next) => {
  res.send("not implemented: author delete post");
});

exports.author_update_get = asyncHandler(async (req, res, next) => {
  res.send("not implemented: author update get");
});

exports.author_update_post = asyncHandler(async (req, res, next) => {
  res.send("not implemented: author update post");
});
