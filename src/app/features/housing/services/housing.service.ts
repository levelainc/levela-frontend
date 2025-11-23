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

  // getAllListings(): Observable<Listing[]> {
  //   return timer(2000).pipe(
  //     switchMap(() =>
  //       this.http
  //         .get<{ listings: Listing[] }>(`${this.baseUrl}/api/housing/listings`)
  //         .pipe(map(response => response.listings))
  //     )
  //   );
  // }
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
