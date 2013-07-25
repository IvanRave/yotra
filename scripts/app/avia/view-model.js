window.aviaApp.viewModel = (function (ko, datacontext, routeHistory) {
    // if user write request in url, then 
    // 1. Get fields from url 
    // 2. Put to the input fields
    // 3. Start search

    // 1. Get url

    function createNodeFromHtmlString(htmlString) {
        var tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlString;
        return tempDiv;
    }

    var self = {
        // can be loaded from server (for input autocomplete)
        ActualAirportList: ko.observableArray(),
        TicketList: ko.observableArray(),
        TicketViewList: datacontext.getTicketViewList(),
        SelectedTicketViewHtml: ko.observable(),
        SelectedTicketViewId: ko.observable(datacontext.QueryString['ticket-view']),
        DepartureAbbr: ko.observable(datacontext.QueryString['departure-point']),
        ArrivalAbbr: ko.observable(datacontext.QueryString['arrival-point']),
        findTicketList: function () {
            // write encoded string to url
            var redirectUrl = '?departure-point=' + encodeURI(self.DepartureAbbr())
                            + '&arrival-point=' + encodeURI(self.ArrivalAbbr())
                            + '&ticket-view=' + self.SelectedTicketViewId();

            History.pushState({}, null, redirectUrl);

            if (!self.SelectedTicketViewHtml()) {
                // load template of tickets view
                datacontext.loadTicketViewTemplate(self.SelectedTicketViewId()).done(function (htmlResponse) {
                    // apply bindings to all elements in received html


                    // save to model property (one time per session)
                    //self.SelectedTicketViewHtml(htmlResponse);

                   // ko.applyBindings(self);//, createNodeFromHtmlString(self.SelectedTicketViewHtml()));
                });
            }
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
    }),

    self.fillActualAirportList();

    return self;
})(ko, window.aviaApp.datacontext, History);

$(function () {
    ko.applyBindings(window.aviaApp.viewModel);
});