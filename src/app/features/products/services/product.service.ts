import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { FinancialProduct } from '../../../core/models/financial-product.interface';

@Injectable({
  providedIn: 'root' // Singleton disponible en toda la app
})
export class ProductService {
  private readonly apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  /**
   * F1. Obtener listado de productos.
   */
  getProducts(): Observable<FinancialProduct[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => {
         // Validamos si viene envuelto en 'data' según documentación.
         return response.data ? response.data : response;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * F4. Agregar producto.
   */
  createProduct(product: FinancialProduct): Observable<FinancialProduct> {
    return this.http.post<any>(this.apiUrl, product).pipe(
      map(response => response.data ? response.data : response), 
      catchError(this.handleError)
    );
  }

  /**
   * F5. Actualizar producto.
   */
  updateProduct(product: FinancialProduct): Observable<FinancialProduct> {
    return this.http.put<any>(`${this.apiUrl}/${product.id}`, product).pipe(
      map(response => response.data ? response.data : response), 
      catchError(this.handleError)
    );
  }

  /**
   * F6. Eliminar producto.
   */
  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Validación: Verificar existencia de ID, retorna true si existe, false si no.
   */
  verifyId(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/verification/${id}`);
  }

  // Manejo centralizado de errores 
  private handleError(error: any) {
    console.error('An error occurred:', error); // Logueo para desarrollo
    return throwError(() => error); 
  }
}