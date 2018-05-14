class MeetUp {
  constructor(){
    this.meetings = []
};

init() {
  this._bindEvents();
  this.tableResults = $("#tableResults").DataTable({
      // serverSide: false,
      data: this.meetings,
      columns: [
          { data: "country" },
          { data: "state" },
          { data: "city" },
          { data: "zip" },
          { data: "ranking" },
          { data: "member_count" }
      ]
  });
};

_bindEvents() {
  $("#submitBtn").on("click", $.proxy(this.btnGetData, this));
};

btnGetData(){
  let _this = this;
  let country = $("#country").val();
  let state = $("#state").val();
  let rowCount = $("#rowCount").val();
  this.tableResults.clear();
  this.meetings = [];
  $.ajax({
      url: "https://api.meetup.com/2/cities",
      dataType: 'jsonp',
      type: "GET",
      data:{
        key: "305a94f351337526c496415787a49",
        country: country,
        state: state,
        page: rowCount
      }})
      .done(function(response){
        _this.meetings = response.results;
        _this.setUpTable()
      });
}

setUpTable() {
      let _this = this;
      this.tableResults.clear();
      (this.meetings).forEach(meeting => {
          _this.tableResults.row.add(meeting);
      });
      this.tableResults.draw();
  }

};

$(function () {
    window.meetup = new MeetUp();
    window.meetup.init();
});
