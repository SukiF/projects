//library construct
var Library = function (libraryKey){
  this._books = [];
  this.libraryKey = libraryKey;
}

//book object
var Book = function(arg){
    this.title = arg.title;
    this.author = arg.author;
    this.numberOfPages = arg.numPages;
    this.publishDate = new Date(arg.pubDate);
}
//new library
var gLib = new Library("libraryStorage");

//add book function
Library.prototype.addBook = function(book) {
 for (var i = 0; i < book.length; i++){
    if(Array.isArray(book)){
      return false;
    }
  }
    for (var i = 0; i < this._books.length; i++){
     if(this._books[i].title === book.title) {
       return false;
   }
 }
 this._books.push(book)
 return true;
}

//remove book title
Library.prototype.removeBookbyTitle = function(title) {
 for (var i = 0; i < this._books.length; i++) {
   if (this._books[i].title === title) {
     this._books.splice(i, 1);
           return true;
   }
 }
      return false;
}

//remove book by author
Library.prototype.removeBooksbyAuthor = function (author) {
  var result = false;
  for (var i = this._books.length-1; i >= 0; i--) {
    if(this._books[i].author === author) {
      this._books.splice(i, 1);
        result = true;
    }
  }
        return result;
}

//get random Book
Library.prototype.getRandomBook = function (){
  if (this._books.length === 0){
    return null;
  }
  return this._books[Math.floor(Math.random()* this._books.length)];
}

//get book by title
Library.prototype.getBookByTitle = function(title){
  var tempArray = [];
  var titleSearch = new RegExp(title, "i");
  for (var i = 0; i < this._books.length; i++) {
    if (titleSearch.test(this._books[i].title)) {
    tempArray.push(this._books[i]);
      }
    }
      return tempArray;
  }

//get book by author
Library.prototype.getBooksByAuthor = function(author){
  var tempArray = [];
  var authorSearch = new RegExp(author, "i");
  for (var i = 0; i < this._books.length; i++) {
    if (authorSearch.test(this._books[i].author)) {
    tempArray.push(this._books[i]);
    }
  }
  return tempArray;
}

//add books
Library.prototype.addBooks = function(books){
  for (var i = 0; i < books.length; i++) {
    if(!Array.isArray(books)){
      return false;
      }
    }
      var bookCount = 0;
      for (var i = 0; i < books.length; i++) {
        if(this.addBook(books[i])){
          bookCount++;
        }
      }
      return bookCount;
}

//Get authors
Library.prototype.getAuthors = function(){
  var authorArray = [];
  for (var i = 0; i < this._books.length; i++){
    if(authorArray.indexOf(this._books[i].author) === -1){
      authorArray.push(this._books[i].author);
    }
  }
    return authorArray;
}

//getRandomAuthorName
Library.prototype.getRandomAuthorName = function(){
  if (this._books.length === 0){
    return null;
  }
  return this._books[Math.floor(Math.random()* this._books.length)].author;
  }

//Bonus:
//search function for one or more properties
Library.prototype.searchProperties = function(string){
  var bookSelection = [];
  // this.getBookByTitle(string);
  bookSelection.push(this.getBookByTitle(string));
  // this.getBooksByAuthor(string);
  bookSelection.push(this.getBooksByAuthor(string));
  return bookSelection;
}

//stringify & localStorage
  Library.prototype.setLibrary = function(libraryKey){
    localStorage.setItem(libraryKey, JSON.stringify(this._books));
    return true;
  }

  Library.prototype.getLibrary = function(libraryKey){
    return this._books = JSON.parse(localStorage.getItem(libraryKey));
  }

  var gIT = new Book({title: "IT", author: "Stephen King", numPages: 1169, pubDate: "January 1, 2016"});
  var gTheStand = new Book({title: "The Stand", author: "Stephen King", numPages: 1348, pubDate: "June 24, 2008"});
  var gAPlaceToStand = new Book({title: "A Place To Stand", author: "	Jimmy Santiago Baca ", numPages: 276, pubDate: "December 1, 2007"});
  var gGlutenFree1 = new Book({title: "Gluten-Free on a Shoestring: 125 Easy Recipes for Eating Well on the Cheap", author: "Nicole Hunn", numPages: 298, pubDate: "October 10, 2017"});
  var gGlutenFree2 = new Book({title: "Gluten-Free on a Shoestring Bakes Bread", author: "Nicole Hunn", numPages: 203, pubDate: "December 10, 2013"});
  var gCatcherInTheRye = new Book({title: "Catcher In The Rye", author: "JD Salinger", numPages: 200, pubDate: "July 16, 1951"});
  var gGreenEggsAndHam = new Book({title: "Green Eggs And Ham", author: "Dr. Seuss", numPages: 35, pubDate: "August 12, 1960"});
  var gAWrinkleInTime = new Book({title: "A Wrinkle In Time", author: "Madeleine L'Engle", numPages: 368,pubDate: "September 20, 1968"});
  var gAHouseLikeaLotus = new Book({title: "A House Like a Lotus", author: "Madeleine L'Engle", numPages: 336,pubDate: "February 14, 2012"});
  var gTheodoreBooneKidLawyer = new Book({title: "Theodore Boone: Kid Lawyer", author: "John Grisham", numPages: 273, pubDate: "November 10, 2011"});
  var gTheodoreBooneTheActivist = new Book({title: "Theodore Boone: The Activist", author: "John Grisham", numPages: 373, pubDate: "November 10, 2010"});
  var gTheodoreBooneTheAccused = new Book({title: "Theodore Boone: The Accused", author: "John Grisham", numPages: 253, pubDate: "September 20, 2009"});

  var myBooks = [gCatcherInTheRye, gGreenEggsAndHam, gAWrinkleInTime, gTheodoreBooneKidLawyer, gIT, gTheStand];
