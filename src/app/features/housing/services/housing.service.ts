import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap, tap, timer } from 'rxjs';
import { Listing } from '../models/housing.model';

@Injectable({
  providedIn: 'root',
})
export class HousingService {
  private readonly baseUrl = 'http://localhost:5001';

  constructor(private http: HttpClient) {}

  getAllListings(): Observable<Listing[]> {
    return this.http
      .get<{ listings: Listing[] }>(`${this.baseUrl}/api/housing/listings`)
      .pipe(map(response => response.listings));
  }

  getTopListings(): Observable<Listing[]> {
    return this.http
      .get<{ top_listings: Listing[] }>(`${this.baseUrl}/api/housing/listings/top`)
      .pipe(map(response => response.top_listings));
  }

  getListingsByFilter(filter: string, page: number = 1, per_page: number = 50): Observable<Listing[]> {
    const params: any = { page, per_page };

    if (filter) {
      params.filter = filter; // <-- pass tab filter to backend
    }

    return this.http
      .get<{ listings: Listing[] }>(`${this.baseUrl}/api/housing/listings`, { params })
      .pipe(map(res => res.listings));
  }


  getTopFilters(): Observable<string[]> {
    return this.http
      .get<{
        top_listings: any[];
        top_amenities: string[];
        top_house_types: string[];
      }>(`${this.baseUrl}/api/housing/listings/top`)
      .pipe(
        map(res => {
          const topSevenHouseTypes = (res.top_house_types || []).slice(0, 7);
          const topThreeAmenities = (res.top_amenities || []).slice(0, 3);
          // Merge into single array
          return ['All Listings',...topSevenHouseTypes,...topThreeAmenities,];
        })
      );
  }


  getListingById(id: string): Observable<Listing> {
    return this.http.get<Listing>(`${this.baseUrl}/api/housing/listing/${id}`);
  }

  getMyListing():Observable<Listing[]>{
    return this.http
    .get<{listings:Listing[]}>(`${this.baseUrl}/api/housing/my-listings`)
    .pipe(
      map(response=> response.listings)
    )

  }

  createListing(formData: FormData): Observable<any> {
    // Interceptor will attach Bearer token automatically
    return this.http.post(`${this.baseUrl}/api/housing/listing`, formData);
  }


  updateListing(id: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/listings/${id}`, formData);
  }

  deleteListing(id: string): Observable<any> {
    const token=localStorage.getItem('token')

    return this.http.delete(`${this.baseUrl}/api/housing/listing/${id}`);
  }



}
