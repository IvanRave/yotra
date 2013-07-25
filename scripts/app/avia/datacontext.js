window.aviaApp = window.aviaApp || {};

window.aviaApp.datacontext = (function (ko) {
    var baseApiUrl = "http://api.example.com/";

    /// <summary>
    /// Ajax request: return $.ajax
    /// </summary>
    /// <params name="type">Request type</params>
    /// <params name="url">Request url</params>
    /// <params name="uqp">Url query parameters</params>
    function ajaxRequest(type, url, uqp) {
        var requestUrl = baseApiUrl + url;

        // add query parameters
        if (uqp) { requestUrl += "?" + $.param(uqp); }

        return $.ajax(requestUrl, {
            type: type
        });
    }

    var QueryString = function () {
        // This function is anonymous, is executed immediately and 
        // the return value is assigned to QueryString!
        var query_string = {};
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            // If first entry with this name
            if (typeof query_string[pair[0]] === "undefined") {
                query_string[pair[0]] = pair[1];
                // If second entry with this name
            } else if (typeof query_string[pair[0]] === "string") {
                var arr = [query_string[pair[0]], pair[1]];
                query_string[pair[0]] = arr;
                // If third or later entry with this name
            } else {
                query_string[pair[0]].push(pair[1]);
            }
        }

        return query_string;
    }();

    function createAirport(data) {
        return new datacontext.Airport(data); // from model
    }

    function getAirportList() {
        return [
            { Name: 'Москва', Abbr: 'MOW' },
            { Name: 'Санкт-Петербург', Abbr: 'LED' },
            { Name: 'Париж', Abbr: 'PAR' }
        ];

        ////return ajaxRequest('GET', 'airport');
    }

    function getTicketList() {
        // load some data from server
        return ajaxRequest('GET', 'ticket');
    }

    function getTicketViewList() {
        // if need - load from server
        return [{ Id: 'price', Name: 'Цена' }, { Id: 'schedule', Name: 'Расписание' }];
    }

    /// <summary>Load html for ticket view, choosed by user</summary>
    /// <param name="ticketViewId">Price or schedule or smth. else: show tickets using this view</param>
    function loadTicketViewTemplate(ticketViewId) {
        var ticketViewUrl = '/avia/template/ticket-view-' + ticketViewId + '.html';
        return $.ajax(ticketViewUrl, { type: 'GET' });
    }

    var datacontext = {
        createAirport: createAirport,
        getTicketList: getTicketList,
        getAirportList: getAirportList,
        QueryString: QueryString,
        getTicketViewList: getTicketViewList,
        loadTicketViewTemplate: loadTicketViewTemplate
    };

    return datacontext;
})(ko);