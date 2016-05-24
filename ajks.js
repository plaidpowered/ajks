var Ajks = function(url, method, dataType) {
    "use strict";

    this.url = url || window.location.href;
    this.method = method || "GET";
    this.dataType = dataType || "text";

    this.onSent = undefined;
    this.onDone = undefined;
    this.onSuccess = undefined;
    this.onFailure = undefined;

    var request = new XMLHttpRequest();

    request.ajks = this;

    request.onreadystatechange = function () {

        if (request.readyState === XMLHttpRequest.DONE) {

            if (typeof request.ajks.onDone === "function") {
                request.ajks.onDone(request);
            }

            if (request.status === Ajks.SUCCESS && typeof request.ajks.onSuccess === "function") {
                request.ajks.onSuccess(request.response);
            } else if (typeof this.onFailure === "function") {
                request.ajks.onFailure(request.status, request.response);
            }

        } else if (request.readyState === XMLHttpRequest.OPENED && typeof request.ajks.onSent === "function") {

            request.ajks.onSent(request);

        }

    };

    this.request = request;


}

Ajks.SUCCESS = 200;

/**
 * Don't like creating neat, tidy, and readable objects? This
 * is the function for you!
 * @param   {[[Type]]} url      [[Description]]
 * @param   {[[Type]]} method   [[Description]]
 * @param   {[[Type]]} data     [[Description]]
 * @param   {[[Type]]} dataType [[Description]]
 * @returns {[[Type]]} Ajks class/object
 */
Ajks.instance = function (args, send) {
    "use strict";

    var ajks = new Ajks(args.url, args.method, args.dataType);
    ajks.onDone = args.onDone;
    ajks.onSent = args.onSent;
    ajks.onSuccess = args.onSuccess;
    ajks.onFailure = args.onFailure;

    if (typeof send === "undefined" || send === true) {
        ajks.send(args.data);
    }

    return ajks;

};

Ajks.load = function (url, selector, onDone) {
    "use strict";

    var instance = Ajks.instance({
        url: url,
        dataType: 'document',
        onSuccess: function (response) {

            var portion = response.querySelector(selector),
                title = response.querySelector('title');

            if (typeof onDone === "function") {
                onDone({
                    html: portion,
                    title: title.innerHTML,
                }, Ajks.SUCCESS);
            }
        },
        onFailure: function (status, response) {
            if (typeof onDone === "function") {
                onDone(response, status);
            }
        }
    })

    return instance;

};

/**
 * Set callbacks with a handy function rather than through
 * direct property access. Most useful for instance based
 * function calls.
 * @param   {[[Type]]} property [[Description]]
 * @param   {[[Type]]} value    [[Description]]
 * @returns {[[Type]]} Ajks instance
 *
Ajks.prototype.on = function (property, value) {
    "use strict";

    if (typeof property === "object" && property.isArray()) {
        var index;
        for (index in property) {
            if (property.hasOwnProperty(index)) {
                this['on' + index] = property[index];
            }
        }
    } else if (typeof value === "function") {
        this['on' + property] = value;
    }

    return this;

};
*/

/**
 * Send your request where ever it is meant to go
 * @param   {[[Type]]} data         [[Description]]
 * @param   {[[Type]]} asynchronous Boolean, true by default
 * @returns {[[Type]]} Returns response if async is off, otherwise the Ajks instance
 */
Ajks.prototype.send = function (data, asynchronous) {
    "use strict";

    if (typeof asynchronous !== "boolean") {
        asynchronous = true;
    }

    this.request.responseType = this.dataType;
    this.request.open(this.method, this.url, asynchronous);

    var responseData = this.request.send(data);

    return asynchronous ? this : responseData;

};
