import { Observable } from 'rxjs';
import { format } from 'util';
import { PropertySearchQuery, Property } from './types';
import { get } from './https';
import { parse } from './parse';

export function search(query: PropertySearchQuery): Observable<Property> {
    const urlFormat = createUrlFormat(query);

    return new Observable<Property>(subscriber => {
        let page = 0;

        const next = () => {
            const promise = get(format(urlFormat, ++page))
                .then(parse);

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

function createUrlFormat(query: PropertySearchQuery) {
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

