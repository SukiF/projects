class Book {
  constructor(book) {
    this.cover = book.cover;
    this.title = book.title;
    this.author = book.author;
    this.numPages = book.numPages;
    this.pubDate = new Date(book.pubDate);
    this.edit = book.edit;
    this._id = book._id;
  }
};

class Library {
  constructor(libraryKey) {
    this.bookCollection = [];
    this.libraryKey = libraryKey;
  }

  init() {
    this.$addBookBtn = $("#addBookBtn");
    this.$update = $("update");
    this.$getRandomBook = $("#getRandomBook");
    this._getBookAjax();
    this._setUpTable();
    this._bindEvents();
    return false;
  };

  _bindEvents() {
    this.$addBookBtn.on("click", $.proxy(this._btnAddABook, this));
    this.$update.on("updateLibrary", $.proxy(this._handleUpdateLibrary, this));
    this.$getRandomBook.on("click", $.proxy(this._handlegetRandomBook, this));
    this.$myTable.on("click", $.proxy(this._removeRow, this));
    $(document).on("click", ".delete", $.proxy(this._removeRow, this));
    $("#authorsModal").on("show.bs.modal", $.proxy(this._handlegetAuthors, this));
    $("#authorsInLibrary").on("click", ".authorHTML", $.proxy(this._handleremoveBooksbyAuthor, this));

    return false;
  };

  _handleUpdateLibrary() {
    this.tableApi.fnDestroy();
    this._setUpTable();
  };

  _handlegetRandomBook() {
    this.displayRandomBook();
  };

  _handleDeleteLibrary(e){
    let row = $(e.currentTarget).parent().parent().remove();
    this._removeRow();
      return true;
  };

  _handleremoveBooksbyAuthor(e) {
    let author = $(e.currentTarget).text();
    this.removeBooksbyAuthor(author);
    location.reload();
  };

  _handlegetAuthors() {
    let authorHTML = "";
    let authors = this.getAuthors();
    authors.forEach(function(author) {
      authorHTML = authorHTML + "<li class = \"authorHTML\">" + author + "</li>";
    });
    $("#authorsInLibrary").empty();
    $("#authorsInLibrary").append(authorHTML);
  };

  updateLibrary() {
    this.$update.trigger("updateLibrary");
  };

  _setUpTable() {
  console.log(this.bookCollection);
    this.$myTable = $("#myTable").DataTable({
      data: this.bookCollection,
      columns: [{
          data: "_id"
        },
        {
          data: "cover",
          render: function(data, type, row, meta) {
            return (" <img class=\"cover\" src=" + row.cover + ">");
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
          data: "edit",
          render: function(data, type, row, meta) {
            return ("<button class='btn btn-info editBook'>Edit</button>");
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

  _removeRow(e) {
    // let row = (e.currentTarget).parent().parent("tr");
    let parsedHTML = $.parseHTML($(e.currentTarget).parent().parent("tr").html());
    let title = $(parsedHTML[2]);
    let _id = $(parsedHTML[0]);
    if (confirm("Are you sure you want to delete this book? " + title)) {
      this.removeBookbyTitle(title);
      // this.setLibrary();
    }
  };

  _btnAddABook() {
    let cover = $('#coverImage').val();
    cover = cover.replace("C:\\fakepath\\", "");
    cover = "img/img125px/" + cover;
    let title = $('#addBookInput1').val();
    let author = $('#addBookInput2').val();
    let numPages = $('#addBookInput3').val();
    let pubDate = $('#addBookInput4').val();
    let options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };

    this.addBook(new Book({
      cover: cover,
      title: title,
      author: author,
      numPages: numPages,
      pubDate: pubDate
    }));
    this.tableApi.fnDestroy();
    this._setUpTable();
    $("#addBookForm").trigger('reset');
  };

  //add book function
  addBook(book) {
    for (let i = 0; i < book.length; i++) {
      if (Array.isArray(book)) {
        return false;
      }
    }
    for (let j = 0; j < this.bookCollection.length; j++) {
      if (this.bookCollection[j].title === book.title) {
        return false;
      }
    }
    this.bookCollection.push(book);
    this.addBookAjax(); //Post
    this.updateLibrary();
    // this.setLibrary();
    return true;
  };

  //remove book title
  removeBookbyTitle(title, _id) {
    for (let i = 0; i < this.bookCollection.length; i++) {
      if (this.bookCollection[i].title === title) {
        this.deleteBookAjax(_id);
        this.bookCollection.splice(i, 1);
        this.updateLibrary();
        return true;
      }
    }
    return false;
  };

  //remove book by author
  removeBooksbyAuthor(author) {
    let result = false;
    for (let i = this.bookCollection.length - 1; i >= 0; i--) {
      if (this.bookCollection[i].author === author) {
        this.deleteBookAjax(this.bookCollection[i]);
        this.bookCollection.splice(i, 1);
        this.updateLibrary();
        // this.setLibrary();
        result = true;
      }
    }
    return result;
  };

  //get random Book
  getRandomBook() {
    if (this.bookCollection.length === 0) {
      return null;
    }
    return this.bookCollection[Math.floor(Math.random() * this.bookCollection.length)];
  };

  // Need to finish this
  displaycover() {
    $("#coverImg").attr("src", "cover");
  };

  displayRandomBook() {
    let book = this.getRandomBook();
    $('#coverImg').attr('src', book.cover);
    $('#randomTitle').text(book.title);
    $('#randomAuthor').text(book.author);
    $('#randomNumPages').text(book.numPages);
    $('#randomPubDate').text(book.pubDate.toLocaleDateString('us-en'));
  };

  displayAuthors() {
    let book = this.displayAuthors();
    $('#authorsLibrary').text(book.author);
  };

  //get book by title
  getBookByTitle(title) {
    let tempArray = [];
    let titleSearch = new RegExp(title, "i");
    for (let i = 0; i < this.bookCollection.length; i++) {
      if (titleSearch.test(this.bookCollection[i].title)) {
        tempArray.push(this.bookCollection[i]);
      }
    }
    return tempArray;
  };

  //get book by author
  getBooksByAuthor(author) {
    let tempArray = [];
    let authorSearch = new RegExp(author, "i");
    for (let i = 0; i < this.bookCollection.length; i++) {
      if (authorSearch.test(this.bookCollection[i].author)) {
        tempArray.push(this.bookCollection[i]);
      }
    }
    return tempArray;
  };

  //add books
  addBooks(books) {

    let bookCount = 0;
    for (let j = 0; j < books.length; j++) {
      if (this.addBook(books[j])) {
        bookCount++;
      }
    }
    return bookCount;
  }

  //Get authors
  getAuthors() {
    let authorArray = [];
    for (let i = 0; i < this.bookCollection.length; i++) {
      if (authorArray.indexOf(this.bookCollection[i].author) === -1) {
        authorArray.push(this.bookCollection[i].author);
      }
    }
    return authorArray;
  };

  //getRandomAuthorName
  getRandomAuthorName() {
    if (this.bookCollection.length === 0) {
      return null;
    }
    return this.bookCollection[Math.floor(Math.random() * this.bookCollection.length)].author;
  };

  //search function for one or more properties
  searchProperties(string) {
    let bookSelection = [];
    // this.getBookByTitle(string);
    bookSelection.push(this.getBookByTitle(string));
    // this.getBooksByAuthor(string);
    bookSelection.push(this.getBooksByAuthor(string));
    return bookSelection;
  };

  _getBookAjax() {
    let _this = this;
    $.ajax({
        dataType: 'json',
        type: "GET",
        url: "http://localhost:3000/library/"
      })
      .done(function(response) {
        // console.log(response);
        for (var i = 0; i < response.length; i++) {
          let book = new Book(response[i]);
          // console.log(book);
          _this.$myTable.row.add(book);
          _this.bookCollection.push(book);
        }
        _this.$myTable.draw();
        // console.log(this.bookCollection);

      }).fail(function() {
        console.log("Your GET request has failed");
      });
  }

  addBookAjax() {
    $.ajax({
        dataType: 'json',
        type: "POST",
        url: "http://localhost:3000/library/",
        data: {
          cover: $('#coverImage').val(),
          title: $('#addBookInput1').val(),
          author: $('#addBookInput2').val(),
          pubDate: $('#addBookInput4').val(),
          numPages: $('#addBookInput3').val()
        }
      }).done(function(response) {})
      .fail(function() {
        console.log("Your POST request failed");
      });
  }

  deleteBookAjax(_id) {
    let _this = this;
    $.ajax({
      dataType: 'json',
      type: "DELETE",
      url: "http://localhost:3000/library/" + _id,
    }).done( function(response) {
           }).fail( function(response) {
             console.log(response);
    });
  }

  // removeBookByIdFromLibrary(_id, callback) {
  //        let _this = this;
  //        $.ajax ({
  //            url: "http://localhost:3000/library/" + _id,
  //            dataType: "json",
  //            type: "DELETE",
  //        }).done( function(response) {
  //            // console.log("delete success response")
  //            callback(_id);
  //        }).fail( function(response) {
  //            // console.log("delete fail response")
  //            callback(_id);
  //            // _this.failedResponse(response);
  //        });
  //    }

  getRandomBookAjax(books) {
    $.ajax({
        dataType: 'json',
        type: "GET",
        url: "http://localhost:3000/library/" + book._id,
      })
      .done(function(response) {})
      .fail(function() {
        console.log("Your GET request has failed");
      });
  }

}
//   }).done(function(response){
//     console.log(response)}).fail(function(){
//     console.log("Your POST request has failed");
//   });
// }

//   })
// }
//stringify & localStorage
// setLibrary() {
//   localStorage.setItem(this.libraryKey, JSON.stringify(this.bookCollection));
//   return true;
// };

//   getLibrary() {
//     let tempArray = JSON.parse(localStorage.getItem(this.libraryKey));
//     if (tempArray !== null) {
//       for (let i = 0; i < tempArray.length; i++) {
//         let book = new Book(tempArray[i]);
//         this.addBook(book);
//       }
//     } else {
//       tempArray = [];
//     }
//   };
// };

let gLib = new Library("libraryStorage");

$(document).ready(function() {
  var gLib = new Library("libraryStorage");
  gLib.init();
  // gLib.addBooks(myBooks);
});
//
// const gIT = new Book({
//   cover: "img/img125px/It.jpg",
//   title: "IT",
//   author: "King, Stephen",
//   numPages: 1169,
//   pubDate: "January 1, 2016"
// });
// const gTheStand = new Book({
//   cover: "img/img125px/TheStand.jpg",
//   title: "The Stand",
//   author: "King, Stephen",
//   numPages: 1348,
//   pubDate: "June 24, 2008"
// });
// const gAPlaceToStand = new Book({
//   cover: "img/img125px/APlacetoStand.jpg",
//   title: "A Place To Stand",
//   author: "Santiago Baca, Jimmy",
//   numPages: 276,
//   pubDate: "December 1, 2007"
// });
// const gGlutenFree1 = new Book({
//   cover: "img/img125px/GlutenFree1.jpg",
//   title: "Gluten-Free on a Shoestring: 250 Easy Recipes for Eating Well on the Cheap",
//   author: "Hunn, Nicole",
//   numPages: 298,
//   pubDate: "October 10, 2017"
// });
// const gGlutenFree2 = new Book({
//   cover: "img/img125px/GlutenFree2.jpg",
//   title: "Gluten-Free on a Shoestring Bakes Bread",
//   author: "Hunn, Nicole",
//   numPages: 203,
//   pubDate: "December 10, 2013"
// });
// const gCatcherInTheRye = new Book({
//   cover: "img/img125px/Catcher.jpg",
//   title: "Catcher In The Rye",
//   author: "Salinger, JD ",
//   numPages: 200,
//   pubDate: "July 16, 1951"
// });
// const gGreenEggsAndHam = new Book({
//   cover: "img/img125px/GreenEggs.jpg",
//   title: "Green Eggs And Ham",
//   author: "Seuss, Dr.",
//   numPages: 35,
//   pubDate: "August 12, 1960"
// });
// const gAWrinkleInTime = new Book({
//   cover: "img/img125px/Wrinkle.jpg",
//   title: "A Wrinkle In Time",
//   author: "L'Engle, Madeleine",
//   numPages: 368,
//   pubDate: "September 20, 1968"
// });
// const gAHouseLikeaLotus = new Book({
//   cover: "img/img125px/HouseLikeaLotus.jpg",
//   title: "A House Like a Lotus",
//   author: "L'Engle, Madeleine",
//   numPages: 336,
//   pubDate: "February 14, 2012"
// });
// const gTheodoreBooneKidLawyer = new Book({
//   cover: "img/img125px/KidLawyer.jpg",
//   title: "Theodore Boone: Kid Lawyer",
//   author: "Grisham, John",
//   numPages: 273,
//   pubDate: "November 10, 2011"
// });
// const gTheodoreBooneTheActivist = new Book({
//   cover: "img/img125px/TheActivist.jpg",
//   title: "Theodore Boone: The Activist",
//   author: "Grisham, John",
//   numPages: 373,
//   pubDate: "November 10, 2010"
// });
// const gTheodoreBooneTheAccused = new Book({
//   cover: "img/img125px/TheAccused.jpg",
//   title: "Theodore Boone: The Accused",
//   author: "Grisham, John",
//   numPages: 253,
//   pubDate: "September 20, 2009"
// });
// const gTheodoreBooneTheFugitive = new Book({
//   cover: "img/img125px/theFugitive.jpg",
//   title: "Theodore Boone: The Fugitive",
//   author: "Grisham, John",
//   numPages: 257,
//   pubDate: "May 12, 2011"
// });
//
// const myBooks = [gCatcherInTheRye, gAHouseLikeaLotus, gGreenEggsAndHam, gAWrinkleInTime, gTheodoreBooneKidLawyer, gTheodoreBooneTheAccused, gTheodoreBooneTheActivist, gTheodoreBooneTheFugitive, gAPlaceToStand, gTheStand, gIT, gGlutenFree1, gGlutenFree2];
