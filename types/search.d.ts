import { Observable } from 'rxjs';
import { PropertySearchQuery, Property } from './types';
export declare function search(query: PropertySearchQuery): Observable<Property>;
