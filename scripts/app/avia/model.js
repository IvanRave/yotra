(function (ko, datacontext) {
    var Airport = function (data) {
        var self = this;
        data = data || {};

        // properties
        self.Name = data.Name;
        self.Abbr = data.Abbr;

        self.toJson = function () {
            ko.toJSON();
        }
    };

    // model for schedule view (if user choose search by schedule)
    var AviaSchedule = function (data) {
        var self = this;
        data = data || {};


    };

    datacontext.Airport = Airport;
    datacontext.AviaSchedule = AviaSchedule;
})(ko, window.aviaApp.datacontext);