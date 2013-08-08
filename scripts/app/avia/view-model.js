window.aviaApp.viewModel = (function (ko, datacontext, routeHistory) {
    var self = {
        // ticket list (true) 
        // or search form (false)
        isShowResult: ko.observable(false),
        // can be loaded from server (for input autocomplete)
        ActualAirportList: ko.observableArray(),
        TicketList: ko.observableArray(),
        TicketViewList: datacontext.getTicketViewList(),
        SelectedTicketViewId: ko.observable(datacontext.QueryString['ticket-view']),
        DepartureAbbr: ko.observable(datacontext.QueryString['departure-point']),
        ArrivalAbbr: ko.observable(datacontext.QueryString['arrival-point']),
        findTicketList: function () {
            // load and show ticket list
            self.isShowResult(true);
            // write encoded string to url
            var redirectUrl = '?departure-point=' + encodeURI(self.DepartureAbbr())
                            + '&arrival-point=' + encodeURI(self.ArrivalAbbr())
                            + '&ticket-view=' + self.SelectedTicketViewId();

            History.pushState({}, null, redirectUrl);

            ////datacontext.getTicketList().done(function (ticketList) {
            ////    console.log(ticketList);
            ////}).fail(function (error) {

            ////});
        },
        // update or add airport from the server
        fillActualAirportList: function () {
            var airportListResponse = datacontext.getAirportList({ filter: 'userStartEnterPointName' });
            console.log(airportListResponse);
            var mappedAirportList = $.map(airportListResponse, function (elemValue, elemIndex) {
                return datacontext.createAirport(elemValue);
            });
            console.log(mappedAirportList);

            self.ActualAirportList(mappedAirportList);
            console.log(self.ActualAirportList());
        }
    };

    // computed observables
    self.IsValidSearchForm = ko.computed(function () {
        return (self.DepartureAbbr()
            && self.ArrivalAbbr()
            && self.DepartureAbbr() !== self.ArrivalAbbr()
            && self.SelectedTicketViewId());
    });

    // put airports to the select boxes
    self.fillActualAirportList();

    // if user put all request fields to the url, then show him ready ticket list
    if (self.IsValidSearchForm()) {
        self.findTicketList();
    }

    return self;
})(ko, window.aviaApp.datacontext, History);

$(function () {
    ko.applyBindings(window.aviaApp.viewModel);
});