//singleton
var Library;
(function() {
  var library_instance;

  window.Library = function Library(libraryKey) {
    if (library_instance) {
      return library_instance;
    }

    library_instance = this;

    // all the functionality
    library_instance._books = [];
    library_instance.libraryKey = libraryKey;

    return library_instance;
  };
}());

Library.prototype.init = function() {
  this.$addBookBtn = $("#addBookBtn");
  this.$body = $("body");
  // this.$deleteIcon = $(".delete");
  this.$getRandomBook = $("#getRandomBook");
  window.Library().getLibrary();
  this._setUpTable();
  this._removeRow();
  // window.gLib.getLibrary();

  this._bindEvents();
  return false;
};

Library.prototype._bindEvents = function() {

  this.$addBookBtn.on("click", $.proxy(this._btnAddABook, this));
  this.$deleteIcon.on("click", $.proxy(this._removeRow, this));
  this.$body.on("updateLibrary", $.proxy(this._handleUpdateLibrary, this));
  this.$getRandomBook.on("click",$.proxy(this._handlegetRandomBook, this));
  return false;
};

Library.prototype._setUpTable = function() {
  var books = this._books;
  this.myTable = $("#myTable").DataTable({
    data: this._books,
    columns: [{
        data: "image",
        render: function(data, type, row, meta) {
          return (" <img class=\"cover\" src=" + row.image + ">");
        }
      },
      {
        data: "author"
      },
      {
        data: "title"
      },
      {
        data: "numPages"
      },
      {
        data: "pubDate",
        render: function(data, type, row, meta) {
          return data.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
          });
        }
      },
      {
        "orderable": false,
        data: "icons",
        render: function(data, type, row, meta) {
          return ("<img class=\"delete\" src=\"img/delete.png\">");
        }
      }
    ]
  });
  this.tableApi = $("#myTable").dataTable();
  this.$deleteIcon = $(".delete");
  this.$deleteIcon.on("click", $.proxy(this._removeRow, this));
};

Library.prototype._removeRow = function() {
  this.myTable.row($(".delete").parents('tr'))
    .remove()
    .draw();
};


Library.prototype._btnAddABook = function() {

  var title = $('#addBookInput1').val();
  var author = $('#addBookInput2').val();
  var numPages = $('#addBookInput3').val();
  var pubDate = $('#addBookInput4').val();
  var jsonBook = {};
  var options = {year: 'numeric', month: 'long', day: 'numeric' };
  jsonBook["title"] = title;
  jsonBook["author"] = author;
  jsonBook["numPages"] = numPages;
  jsonBook["pubDate"] = pubDate;
  gLib.addBook(new Book(jsonBook));
  gLib.setLibrary();
  this.tableApi.fnDestroy();
  this._setUpTable();
};


Library.prototype._handleUpdateLibrary = function() {
  this.tableApi.fnDestroy();
  this._setUpTable();
};

Library.prototype._handlegetRandomBook = function() {
  this.displayRandomBook();
};

//book object
var Book = function(arg) {
  this.image = arg.image;
  this.title = arg.title;
  this.author = arg.author;
  this.numPages = arg.numPages;
  this.pubDate = new Date(arg.pubDate);
};
//new Library
var gLib = new Library("libraryStorage");

Library.prototype.updateLibrary = function() {
  this.$body.trigger("updateLibrary");
};

//add book function
Library.prototype.addBook = function(book) {
  for (var i = 0; i < book.length; i++) {
    if (Array.isArray(book)) {
      return false;
    }
  }
  for (var j = 0; j < this._books.length; j++) {
    if (this._books[j].title === book.title) {
      return false;
    }
  }
  this._books.push(book);
  this.updateLibrary();
  localStorage.setItem(this.libraryKey, JSON.stringify(this._books));
  return true;
};

//remove book title
Library.prototype.removeBookbyTitle = function(title) {
  for (var i = 0; i < this._books.length; i++) {
    if (this._books[i].title === title) {
      this._books.splice(i, 1);
      this.updateLibrary();
      return true;
    }
  }
  return false;
};

//remove book by author
Library.prototype.removeBooksbyAuthor = function(author) {
  var result = false;
  for (var i = this._books.length - 1; i >= 0; i--) {
    if (this._books[i].author === author) {
      this._books.splice(i, 1);
      this.updateLibrary();
      result = true;
    }
  }
  return result;
};

//get random Book
Library.prototype.getRandomBook = function() {
  if (this._books.length === 0) {
    return null;
  }
  return this._books[Math.floor(Math.random() * this._books.length)];
};

Library.prototype.displayImage = function() {
        $("#coverImg").attr("src", "");
    };


Library.prototype.displayRandomBook = function() {
  var book = this.getRandomBook();
  $('#randomTitle').val(book.title);
  $('#randomAuthor').val(book.author);
  $('#randomNumPages').val(book.numPages);
  $('#randomPubDate').val(book.pubDate);
};

//get book by title
Library.prototype.getBookByTitle = function(title) {
  var tempArray = [];
  var titleSearch = new RegExp(title, "i");
  for (var i = 0; i < this._books.length; i++) {
    if (titleSearch.test(this._books[i].title)) {
      tempArray.push(this._books[i]);
    }
  }
  return tempArray;
};

//get book by author
Library.prototype.getBooksByAuthor = function(author) {
  var tempArray = [];
  var authorSearch = new RegExp(author, "i");
  for (var i = 0; i < this._books.length; i++) {
    if (authorSearch.test(this._books[i].author)) {
      tempArray.push(this._books[i]);
    }
  }
  return tempArray;
};

//add books
Library.prototype.addBooks = function(books) {
  for (var i = 0; i < books.length; i++) {
    if (!Array.isArray(books)) {
      return false;
    }
  }

  var bookCount = 0;
  for (var j = 0; j < books.length; j++) {
    if (this.addBook(books[j])) {
      bookCount++;
    }
  }
  return bookCount;
};

//Get authors
Library.prototype.getAuthors = function() {
  var authorArray = [];
  for (var i = 0; i < this._books.length; i++) {
    if (authorArray.indexOf(this._books[i].author) === -1) {
      authorArray.push(this._books[i].author);
    }
  }
  return authorArray;
};

//getRandomAuthorName
Library.prototype.getRandomAuthorName = function() {
  if (this._books.length === 0) {
    return null;
  }
  return this._books[Math.floor(Math.random() * this._books.length)].author;
};

//search function for one or more properties
Library.prototype.searchProperties = function(string) {
  var bookSelection = [];
  // this.getBookByTitle(string);
  bookSelection.push(this.getBookByTitle(string));
  // this.getBooksByAuthor(string);
  bookSelection.push(this.getBooksByAuthor(string));
  return bookSelection;
};

//stringify & localStorage
Library.prototype.setLibrary = function(libraryKey) {
  localStorage.setItem(libraryKey, JSON.stringify(this._books));
  return true;
};

Library.prototype.getLibrary = function(libraryKey) {

  var tempArray = JSON.parse(localStorage.getItem(libraryKey));
  for (var i = 0; i < tempArray.length; i++){
    var book = new Book(tempArray[i]);
    this.addBook(book);
  }
};

$(document).ready(function(e) {
  window.gLib = new Library();
  window.gLib.init();
});

var gIT = new Book({
  image: "img/img125px/It.jpg",
  title: "IT",
  author: "Stephen King",
  numPages: 1169,
  pubDate: "January 1, 2016"
});
var gTheStand = new Book({
  image: "img/img125px/it.jpg",
  title: "The Stand",
  author: "Stephen King",
  numPages: 1348,
  pubDate: "June 24, 2008"
});
var gAPlaceToStand = new Book({
  image: "img/img125px/APlacetoStand.jpg",
  title: "A Place To Stand",
  author: "Jimmy Santiago Baca ",
  numPages: 276,
  pubDate: "December 1, 2007"
});
var gGlutenFree1 = new Book({
  image: "img/img125px/GlutenFree1.jpg",
  title: "Gluten-Free on a Shoestring: 250 Easy Recipes for Eating Well on the Cheap",
  author: "Nicole Hunn",
  numPages: 298,
  pubDate: "October 10, 2017"
});
var gGlutenFree2 = new Book({
  image: "img/img125px/GlutenFree2.jpg",
  title: "Gluten-Free on a Shoestring Bakes Bread",
  author: "Nicole Hunn",
  numPages: 203,
  pubDate: "December 10, 2013"
});
var gCatcherInTheRye = new Book({
  image: "img/img125px/Catcher.jpg",
  title: "Catcher In The Rye",
  author: "JD Salinger",
  numPages: 200,
  pubDate: "July 16, 1951"
});
var gGreenEggsAndHam = new Book({
  image: "img/img125px/GreenEggs.jpg",
  title: "Green Eggs And Ham",
  author: "Dr. Seuss",
  numPages: 35,
  pubDate: "August 12, 1960"
});
var gAWrinkleInTime = new Book({
  image: "img/img125px/Wrinkle.jpg",
  title: "A Wrinkle In Time",
  author: "Madeleine L'Engle",
  numPages: 368,
  pubDate: "September 20, 1968"
});
var gAHouseLikeaLotus = new Book({
  image: "img/img125px/HouseLikeaLotus.jpg",
  title: "A House Like a Lotus",
  author: "Madeleine L'Engle",
  numPages: 336,
  pubDate: "February 14, 2012"
});
var gTheodoreBooneKidLawyer = new Book({
  image: "img/img125px/KidLawyer.jpg",
  title: "Theodore Boone: Kid Lawyer",
  author: "John Grisham",
  numPages: 273,
  pubDate: "November 10, 2011"
});
var gTheodoreBooneTheActivist = new Book({
  image: "img/img125px/TheActivist.jpg",
  title: "Theodore Boone: The Activist",
  author: "John Grisham",
  numPages: 373,
  pubDate: "November 10, 2010"
});
var gTheodoreBooneTheAccused = new Book({
  image: "img/img125px/TheAccused.jpg",
  title: "Theodore Boone: The Accused",
  author: "John Grisham",
  numPages: 253,
  pubDate: "September 20, 2009"
});

var myBooks = [gCatcherInTheRye, gAHouseLikeaLotus, gGreenEggsAndHam, gAWrinkleInTime, gTheodoreBooneKidLawyer, gTheodoreBooneTheAccused, gTheodoreBooneTheActivist, gAPlaceToStand, gTheStand, gGlutenFree1, gGlutenFree2];
