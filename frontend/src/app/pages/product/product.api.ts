import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type ApiResponse<T> = {
  statusCode: number;
  message?: string;
  data?: T;
};

export type Product = {
  id: number;
  code: string;
  created_at?: string;
};

@Injectable({ providedIn: 'root' })
export class ProductApi {
  constructor(private http: HttpClient) {}

  list(): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>('/api/v1/products');
  }

  create(code: string): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>('/api/v1/products', { code });
  }

  delete(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`/api/v1/products/${id}`);
  }
}
