/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

const bookSchema = require("../schemes").Book;

module.exports = function (app) {
  app
    .route("/api/books")
    .get(async (req, res) => {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      //search for all books in db and return them
      let library = await bookSchema.find({});
      return res.json(library);
    })

    .post(async (req, res) => {
      let bookTitle = req.body.title;
      //response will contain new book object including atleast _id and title
      if (!bookTitle) {
        let missingTitleString = "missing required field title";
        res.send(missingTitleString);
      }
      try {
        //look for book in database
        let bookModel = await bookSchema.findOne({ title: bookTitle });
        //if not found
        if (!bookModel) {
          //create new book in db
          bookModel = new bookSchema({ title: bookTitle });
        }
        //wait for the book to be saved than return it in json
        let book = await bookModel.save();
        return res.json(book);
      } catch (err) {
        let missingBookString = "no book exists";
        res.send(missingBookString);
      }
    })

    .delete(async (req, res) => {
      //if successful response will be 'complete delete successful'
      let deletedLibrary = await bookSchema.deleteMany({});
      let deletedLibraryString = "complete delete successful";
      res.send(deletedLibraryString);
    });

  app
    .route("/api/books/:id")
    .get(async (req, res) => {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      try {
        //find book with corresponding id in database
        let currentBook = await bookSchema.findOne({ _id: bookid });
        //if there is no match
        if (!currentBook) {
          let missingBookString = "no book exists";
          res.send(missingBookString);
        } else {
          return res.json(currentBook);
        }
      } catch (err) {
        console.log(err);
        res.send(missingBookString);
      }
    })

    .post(async (req, res) => {
      let bookid = req.params.id;
      let comment = req.body.comment;
      let missingBookString = "no book exists";
      try {
        //find book with corresponding id in database
        let currentBook = await bookSchema.findOne({ _id: bookid });
        //if there is no match
        if (!currentBook) {
          res.send(missingBookString);
        }
        //if there is no comment
        if (!comment) {
          let missingCommentString = "missing required field comment";
          res.send(missingCommentString);
        } else {
          //if there is a comment push it and calculate comment count
          currentBook.comments.push(comment);
          currentBook.commentcount = currentBook.comments.length;
        }
        //json res format same as .get
        let book = await currentBook.save();
        res.json(book);
      } catch (err) {
        res.send(missingBookString);
      }
    })

    .delete(async (req, res) => {
      let bookid = req.params.id;
      let missingBookString = "no book exists";
      //if successful response will be 'delete successful'
      try {
        let bookToDelete = await bookSchema.findOne({ _id: bookid });
        if (!bookToDelete) {
          res.send(missingBookString);
        }
        let deletedBook = await bookSchema.deleteOne({ _id: bookid });
        if (!deletedBook) {
          res.send("no book exists");
        }
        let deleteBookString = "delete successful";
        res.send(deleteBookString);
      } catch (err) {
        res.send("no book exists");
      }
    });
};
