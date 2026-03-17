import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'cityFilter' })
export class CityFilterPipe implements PipeTransform {
  transform(city: string, query: string): boolean {
    if (!query || !query.trim()) return true;
    const q = query.trim();
    // If query contains digits (looks like a postcode), show all city pills
    if (/\d/.test(q)) return true;
    return city.toLowerCase().includes(q.toLowerCase());
  }
}
