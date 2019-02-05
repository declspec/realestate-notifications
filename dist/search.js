"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const util_1 = require("util");
const https_1 = require("./https");
const parse_1 = require("./parse");
function search(query) {
    const urlFormat = createUrlFormat(query);
    return new rxjs_1.Observable(subscriber => {
        let page = 0;
        const next = () => {
            const promise = https_1.get(util_1.format(urlFormat, ++page))
                .then(parse_1.parse);
            promise.then(properties => {
                if (properties.length === 0)
                    return subscriber.complete();
                properties.forEach(p => subscriber.next(p));
                return subscriber.closed || next();
            }, err => subscriber.error(err));
        };
        next();
    });
}
exports.search = search;
function createUrlFormat(query) {
    const criteria = [];
    if (query.propertyTypes)
        criteria.push(`property-${query.propertyTypes.map(encodeURIComponent).join('-')}`);
    if (query.filters) {
        const filters = query.filters;
        const values = Object.keys(filters).filter(k => filters[k]).map(k => `${encodeURIComponent(filters[k])}-${encodeURIComponent(k)}`);
        criteria.push(`with-${values.join('-')}`);
    }
    if (query.price)
        criteria.push(`between-${encodeURIComponent(query.price.min.toString())}-${encodeURIComponent(query.price.max.toString())}`);
    criteria.push(`in-${query.postcodes.join('+')}`);
    return `https://www.realestate.com.au/rent/${criteria.join('-')}/list-%s?activeSort=list-date&includeSurrounding=false`;
}
