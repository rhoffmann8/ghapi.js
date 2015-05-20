/**
 * ghapi.js
 * http://github.com/rhoffmann8/ghapi.js
 *
 * An extremely low-power wrapper library for (some of) Github API's JSONP functionality.
 * This was written for the sole purpose of facilitating a joke webpage polling GH to check
 * how many new JS framework repositories were created that day. This could on some level be
 * considered ironic given I essentially wrote a framework to do just that (well, sort of).
 *
 * Copyright (c) 2015 Rob Hoffmann <rhoffmann8@gmail.com>
 * Licensed under the MIT license.
 *
 * I may or may not improve this in the future.
 */

var GHApi = ( function( window, document, undefined ) {

    var _path,
        _query,
        _params = {},
        _filters = {},
        _callback = null,
        _funcCount = 0;

    var addParam = function(param, value) {
        return ( _params[param] = value, this );
    };

    var clearParams = function() {
        return ( _params = {}, this );
    }

    // filtering
    var addFilter = function(param, value) {
        return ( _filters[param] = value, this );
    };

    var clearFilters = function() {
        return ( _filters = {}, this );
    };

    // 'q' param
    var query = function(queryText) {
        return ( _params.q = queryText.split(' ').join('+'), this );
    };

    var setCallback = function(cb) {
        return ( _callback = cb, this );
    };

    // set endpoint
    var open = function(path) {
        if (!path) {
            throw new Error('path cannot be empty!');
        }

        return ( _path = path, this );
    };

    // args passed in this call override any set in object members
    var submit = function(path, params, filters, cb) {
        return ( _api(path, params, filters, cb), this );
    };

    var _parseParams = function(params, filters) {
        var q = 'q=' + (params.q || _query),
            queryParams = [],
            tmpParams = [],
            tmpFilters = [];

        for (var prop in params) {
            if (prop == 'q') continue;
            tmpParams.push(prop + '=' + params[prop]);
        }

        for (var prop in filters) {
            tmpFilters.push(prop + ':' + filters[prop]);
        }

        if (tmpFilters.length) {
            q += '+' + tmpFilters.join('+');
        }

        queryParams.push(q);
        if (tmpParams.length) queryParams.push(tmpParams.join('&'));

        // join params and filters
        queryParams = queryParams.join('&').replace(' ', '+');

        return queryParams;
    }

    var _api = function(path, params, filters, cb) {
        var script = document.createElement('script'),
            cb = cb || _callback,
            request = {
                path:     path || _path,
                params: _parseParams(params || _params, filters || _filters)
            };

        if (!cb) {
            throw new Error('callback must be set!');
        }

        // new cb to handle specific request
        window['cors'+_funcCount] = (function(i, req) {
            return function(response) {
                cb.call(req, response.meta, response.data);

                delete window['cors'+i]; // cleanup
            };
        })(_funcCount, request);

        script.src = '//api.github.com' + request.path + '?callback=cors'+(_funcCount++)+(request.params.length ? '&' + request.params : '');
        document.getElementsByTagName('head')[0].appendChild(script);
    };

    return {
        addParam: addParam,
        addFilter: addFilter,
        clearFilters, clearFilters,
        open: open,
        query: query,
        setCallback: setCallback,
        submit: submit
    };

})( this, this.document );
