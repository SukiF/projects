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
    this.bookCollection = [];
    this.libraryKey = libraryKey;

    return library_instance;
  };
}());

//book object
class Book {
  constructor(image, title, author,numPages, pubDate){
    this.name = 'Book';
    this.image = image;
    this.title = title;
    this.author = author;
    this.numPages = numPages;
    this.pubDate = new Date(pubDate);
};

//new Library
var gLib = new Library("libraryStorage");

Library.prototype.init = function() {
  this.$addBookBtn = $("#addBookBtn");
  this.$body = $("body");
  this.$getRandomBook = $("#getRandomBook");
  this.getLibrary();
  this._setUpTable();
  this._bindEvents();
  return false;
};

Library.prototype._bindEvents = function() {
  this.$addBookBtn.on("click", $.proxy(this._btnAddABook, this));
  this.$body.on("updateLibrary", $.proxy(this._handleUpdateLibrary, this));
  this.$getRandomBook.on("click",$.proxy(this._handlegetRandomBook, this));
  $(document).on("click", ".delete", $.proxy(this._removeRow, this));
  $("#authorsModal").on("show.bs.modal",$.proxy(this._handlegetAuthors, this));
  $("#authorsInLibrary").on("click", ".authorHTML", $.proxy(this._handleremoveBooksbyAuthor, this));
  return false;
};

Library.prototype._handleUpdateLibrary = function() {
  this.tableApi.fnDestroy();
  this._setUpTable();
};

Library.prototype._handlegetRandomBook = function() {
  this.displayRandomBook();
};

Library.prototype._handleremoveBooksbyAuthor = function(e) {
  var author = $(e.currentTarget).text();
  this.removeBooksbyAuthor(author);
  location.reload();
};

Library.prototype._handlegetAuthors = function() {
  var authorHTML = "";
  var authors = this.getAuthors();
  authors.forEach (function (author){
  authorHTML=authorHTML +  "<li class = \"authorHTML\">" +  author +"</li>";
  });
  $("#authorsInLibrary").empty();
  $("#authorsInLibrary").append(authorHTML);
};



Library.prototype.updateLibrary = function() {
  this.$body.trigger("updateLibrary");
};

Library.prototype._setUpTable = function(){
  var books = this.bookCollection;
  this.myTable = $("#myTable").DataTable({
    data: this.bookCollection,
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
};

Library.prototype._removeRow = function(e) {
  $(e.currentTarget).parent().parent().remove();
  var parsedHTML = $.parseHTML($(e.currentTarget).parent().parent("tr").html());
   var title = $(parsedHTML[2]).html();
   if( confirm("Are you sure you want to delete this row?") ) {
       this.removeBookbyTitle(title);
       this.setLibrary();
   }
};


Library.prototype._btnAddABook = function() {
  var image = $('#exampleFormControlFile1').val();
  image = image.replace("C:\\fakepath\\", "");
  image = "img/img125px/" + image;
    console.log(image);
  var title = $('#addBookInput1').val();
  var author = $('#addBookInput2').val();
  var numPages = $('#addBookInput3').val();
  var pubDate = $('#addBookInput4').val();
  var options = {year: 'numeric', month: 'long', day: 'numeric' };

  this.addBook(new Book({image: image, title: title, author: author, numPages: numPages, pubDate: pubDate}));
  this.tableApi.fnDestroy();
  this._setUpTable();
  $("#addBookForm").trigger('reset');
};




//add book function
Library.prototype.addBook = function(book) {
  for (var i = 0; i < book.length; i++) {
    if (Array.isArray(book)) {
      return false;
    }
  }
  for (var j = 0; j < this.bookCollection.length; j++) {
    if (this.bookCollection[j].title === book.title) {
      return false;
    }
  }
  this.bookCollection.push(book);
  this.updateLibrary();
  this.setLibrary();
  return true;
};

//remove book title
Library.prototype.removeBookbyTitle = function(title) {
  for (var i = 0; i < this.bookCollection.length; i++) {
    if (this.bookCollection[i].title === title) {
      this.bookCollection.splice(i, 1);
      this.updateLibrary();
      return true;
    }
  }
  return false;
};

//remove book by author
Library.prototype.removeBooksbyAuthor = function(author) {
  var result = false;
  for (var i = this.bookCollection.length - 1; i >= 0; i--) {
    if (this.bookCollection[i].author === author) {
      this.bookCollection.splice(i, 1);
      this.updateLibrary();
      this.setLibrary();
      result = true;
    }
  }
  return result;
};

//get random Book
Library.prototype.getRandomBook = function() {
  if (this.bookCollection.length === 0) {
    return null;
  }
  return this.bookCollection[Math.floor(Math.random() * this.bookCollection.length)];
};

// Need to finish this
Library.prototype.displayImage = function() {
        $("#coverImg").attr("src", "image");
    };


Library.prototype.displayRandomBook = function() {
  var book = this.getRandomBook();
  $('#coverImg').attr('src',book.image);
  $('#randomTitle').text(book.title);
  $('#randomAuthor').text(book.author);
  $('#randomNumPages').text(book.numPages);
  $('#randomPubDate').text(book.pubDate.toLocaleDateString('us-en'));
};

Library.prototype.displayAuthors = function() {
  var book = this.displayAuthors();
  $('#authorsLibrary').text(book.author);
};
//get book by title
Library.prototype.getBookByTitle = function(title) {
  var tempArray = [];
  var titleSearch = new RegExp(title, "i");
  for (var i = 0; i < this.bookCollection.length; i++) {
    if (titleSearch.test(this.bookCollection[i].title)) {
      tempArray.push(this.bookCollection[i]);
    }
  }
  return tempArray;
};

//get book by author
Library.prototype.getBooksByAuthor = function(author) {
  var tempArray = [];
  var authorSearch = new RegExp(author, "i");
  for (var i = 0; i < this.bookCollection.length; i++) {
    if (authorSearch.test(this.bookCollection[i].author)) {
      tempArray.push(this.bookCollection[i]);
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
  for (var i = 0; i < this.bookCollection.length; i++) {
    if (authorArray.indexOf(this.bookCollection[i].author) === -1) {
      authorArray.push(this.bookCollection[i].author);
    }
  }
  return authorArray;
};

//getRandomAuthorName
Library.prototype.getRandomAuthorName = function() {
  if (this.bookCollection.length === 0) {
    return null;
  }
  return this.bookCollection[Math.floor(Math.random() * this.bookCollection.length)].author;
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
Library.prototype.setLibrary = function() {
  localStorage.setItem(this.libraryKey, JSON.stringify(this.bookCollection));
  return true;
};

Library.prototype.getLibrary = function() {

  var tempArray = JSON.parse(localStorage.getItem(this.libraryKey));
  if(tempArray !== null){
  for (var i = 0; i < tempArray.length; i++){
    var book = new Book(tempArray[i]);
    this.addBook(book);
    }
  } else {
      tempArray=[];
}
};

$(document).ready(function(e) {
  window.gLib = new Library();
  window.gLib.init();
});

var gIT = new Book({
  image: "img/img125px/It.jpg",
  title: "IT",
  author: "King, Stephen",
  numPages: 1169,
  pubDate: "January 1, 2016"
});
var gTheStand = new Book({
  image: "img/img125px/TheStand.jpg",
  title: "The Stand",
  author: "King, Stephen",
  numPages: 1348,
  pubDate: "June 24, 2008"
});
var gAPlaceToStand = new Book({
  image: "img/img125px/APlacetoStand.jpg",
  title: "A Place To Stand",
  author: "Santiago Baca, Jimmy",
  numPages: 276,
  pubDate: "December 1, 2007"
});
var gGlutenFree1 = new Book({
  image: "img/img125px/GlutenFree1.jpg",
  title: "Gluten-Free on a Shoestring: 250 Easy Recipes for Eating Well on the Cheap",
  author: "Hunn, Nicole",
  numPages: 298,
  pubDate: "October 10, 2017"
});
var gGlutenFree2 = new Book({
  image: "img/img125px/GlutenFree2.jpg",
  title: "Gluten-Free on a Shoestring Bakes Bread",
  author: "Hunn, Nicole",
  numPages: 203,
  pubDate: "December 10, 2013"
});
var gCatcherInTheRye = new Book({
  image: "img/img125px/Catcher.jpg",
  title: "Catcher In The Rye",
  author: "Salinger, JD ",
  numPages: 200,
  pubDate: "July 16, 1951"
});
var gGreenEggsAndHam = new Book({
  image: "img/img125px/GreenEggs.jpg",
  title: "Green Eggs And Ham",
  author: "Seuss, Dr.",
  numPages: 35,
  pubDate: "August 12, 1960"
});
var gAWrinkleInTime = new Book({
  image: "img/img125px/Wrinkle.jpg",
  title: "A Wrinkle In Time",
  author: "L'Engle, Madeleine",
  numPages: 368,
  pubDate: "September 20, 1968"
});
var gAHouseLikeaLotus = new Book({
  image: "img/img125px/HouseLikeaLotus.jpg",
  title: "A House Like a Lotus",
  author: "L'Engle, Madeleine",
  numPages: 336,
  pubDate: "February 14, 2012"
});
var gTheodoreBooneKidLawyer = new Book({
  image: "img/img125px/KidLawyer.jpg",
  title: "Theodore Boone: Kid Lawyer",
  author: "Grisham, John",
  numPages: 273,
  pubDate: "November 10, 2011"
});
var gTheodoreBooneTheActivist = new Book({
  image: "img/img125px/TheActivist.jpg",
  title: "Theodore Boone: The Activist",
  author: "Grisham, John",
  numPages: 373,
  pubDate: "November 10, 2010"
});
var gTheodoreBooneTheAccused = new Book({
  image: "img/img125px/TheAccused.jpg",
  title: "Theodore Boone: The Accused",
  author: "Grisham, John",
  numPages: 253,
  pubDate: "September 20, 2009"
});
var gTheodoreBooneTheFugitive = new Book({
  image: "img/img125px/theFugitive.jpg",
  title: "Theodore Boone: The Fugitive",
  author: "Grisham, John",
  numPages: 257,
  pubDate: "May 12, 2011"
});

var myBooks = [gCatcherInTheRye, gAHouseLikeaLotus, gGreenEggsAndHam, gAWrinkleInTime, gTheodoreBooneKidLawyer, gTheodoreBooneTheAccused, gTheodoreBooneTheActivist, gTheodoreBooneTheFugitive, gAPlaceToStand, gTheStand, gIT, gGlutenFree1, gGlutenFree2];
