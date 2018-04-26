$(document).ready(function(){
  var myTable = $(myTable).DataTable({
    data: gLib._books,
    columns: [
      {data:"image"},
      {data: "author"},
      {data: "title"},
      {data: "numPages"},
      {data: "pubDate",render: function(data, type, row, meta) {
                 return data.toLocaleDateString("en-US", {year: "numeric", month: "long", day: "numeric"}); }},
      { "orderable": false, data: "icons", render: function(data, type, row, meta) {
                 return ("<a href=\"javascript:updateRow(" + row + ")\"> <img class=\"delete\" src=\"images/update2.png\"> " +
                 "<a href=\"javascript:deleteRow(" + row + ")\"> <img class=\"delete\" src=\"images/delete.png\">");
             }}
    ]
  });

});
