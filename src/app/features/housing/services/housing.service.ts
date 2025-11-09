import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
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


  getListingById(id: string): Observable<Listing> {
    return this.http.get<Listing>(`${this.baseUrl}/api/housing/listing/${id}`);
  }

  createListing(payload: {
    title: string;
    description: string;
    price: number;
    location: string;
  }): Observable<any> {
    const token = localStorage.getItem('token');
    console.log(token)
    return this.http.post(`${this.baseUrl}/api/housing/listing`, payload,{
      headers: {
        Authorization: `Bearer ${token}`}
      });

  }


  updateListing(id: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/listings/${id}`, formData);
  }

  deleteListing(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/listings/${id}`);
  }
}
