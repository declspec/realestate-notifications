export enum PropertyType {
    House = 'house',
    Townhouse = 'townhouse',
    Apartment = 'unit apartment',
    Villa = 'villa',
    Land = 'land',
    Acreage = 'acreage',
    Rural = 'rural',
    Block = 'unit block',
    Retirement = 'retire'
};

export type PropertyFilters = {
    bedrooms?: number
    [key: string]: any
};

export type PropertySearchQuery = {
    propertyTypes?: PropertyType[]
    price?: { min: number, max: number }
    filters?: PropertyFilters
    postcodes: number[]
};

export type Property = {
    id: number
    address: string
    uri: string
    bedrooms?: number
    bathrooms?: number
    carparks?: number
    postcode?: number
    price?: string
    agent?: string
};