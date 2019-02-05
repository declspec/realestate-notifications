import cheerio = require('cheerio');
import { Property } from './types';

export function parse(html: string): Array<Property> {
    const $ = cheerio.load(html);

    return $('article.resultBody').get().reduce((acc, el) => {
        const root = $(el);
        const details = root.find('.detailsButton');
        const price = getPrice(root);

        if (details.length && price !== null) {
            let address = root.find('[rel="listingName"]').text().trim();

            // listingName can be truncated, but the 'title' on the image isn't so prefer that if available.
            const images = root.find('.photoviewer img');

            if (images.length > 0)
                address = images.first().attr('title').trim();

            const postcodeMatch = address.match(/\d+$/);

            acc.push({
                id: el.attribs.id.substring(1),
                bedrooms: getAmenityValue(root, 'bed'),
                bathrooms: getAmenityValue(root, 'bath'),
                carparks: getAmenityValue(root, 'car'),
                address: address,
                uri: `https://realestate.com.au${details.attr('href').trim()}`,
                postcode: postcodeMatch ? postcodeMatch[0] : null,
                price: price,
                agent: getAgent(root)
            });
        }

        return acc;
    }, [] as Property[]);
}

function getAmenityValue(root: Cheerio, name: string) {
    const dd = root.find(`dt.rui-icon-${name}`).next('dd');
    return dd.length ? parseInt(dd.text(), 10) : NaN;
}

function getAgent(root: Cheerio) {
    const $image = root.find('.listing-header img.logo');
    if (!$image || !$image.length)
        return null;

    const name = $image.attr('alt');
    const match = $image.attr('src').match(/\/agencylogo\/([^\/]+)/i);

    return match ? { code: match[1], name: name } : null;
}

function getPrice(root: Cheerio) {
    const elem = root.find('.priceText');
    if (elem && elem.length)
        return elem.text();

    const image = root.find('.priceImg');
    if (!image || !image.length)
        return null;

    const match = image.attr('src').match(/\/convert\/([^?]+)/);
    return match ? Buffer.from(match[1], 'base64').toString('utf8') : null;
}