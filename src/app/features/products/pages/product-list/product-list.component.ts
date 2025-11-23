import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Observable, combineLatest, map, startWith, catchError, of } from 'rxjs';
import { Router } from '@angular/router';
import { FinancialProduct } from '../../../../core/models/financial-product.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  standalone: false,
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  // Streams de datos
  products$!: Observable<FinancialProduct[]>;
  filteredProducts$!: Observable<FinancialProduct[]>;
  
  // Controles de UI
  searchControl = new FormControl('');
  itemsPerPageControl = new FormControl(5); 
  
  // Estado de carga y mensajes
  loading = true;
  errorMessage = ''; 
  successMessage = '';

  // Modal state
  showDeleteModal = false;
  selectedProductForDelete: FinancialProduct | null = null;

  constructor(
    private productService: ProductService,
    private router: Router,
    private cdr: ChangeDetectorRef 
  ) {
    //  Capturar mensaje de éxito (usa la clave 'message')
    const navigation = this.router.getCurrentNavigation();
    
    if (navigation?.extras?.state) {
      const message = navigation.extras.state['message'];
      
      if (typeof message === 'string' && message.length > 0) {
        this.successMessage = message;
        this.autoHideMessage();
      }
    }
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  /**
   * Inicializa la carga de productos y los filtros
   */
  loadProducts(): void {
    // 1. Cargar productos iniciales
    this.products$ = this.productService.getProducts().pipe(
      map(products => {
        this.loading = false;
        return products;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error al cargar productos:', error);
        this.loading = false;
        this.errorMessage = this.parseError(error);
        return of([]); 
      })
    );

    // 2. Combinar flujos para filtrado y paginación local
    this.filteredProducts$ = combineLatest([
      this.products$,
      this.searchControl.valueChanges.pipe(startWith('')),
      this.itemsPerPageControl.valueChanges.pipe(startWith(5))
    ]).pipe(
      map(([products, searchTerm, limit]) => {
        return this.filterAndPaginate(products, searchTerm, limit);
      })
    );
  }

  confirmDelete(): void {
    if (!this.selectedProductForDelete) return;

    this.productService.deleteProduct(this.selectedProductForDelete.id).subscribe({
      next: () => {
        
        // 1. Establecer el mensaje de éxito y cerrar el modal.
        this.successMessage = 'Producto eliminado correctamente.';
        this.showDeleteModal = false;
        
        // 2. Forzar la detección de cambios para cerrar el modal.
        this.cdr.detectChanges(); 
        
        // 3. Mover la recarga y la limpieza de estado al siguiente tick (soluciona NG0100)
        setTimeout(() => {
             this.loadProducts(); 
             this.selectedProductForDelete = null;
        }, 0); 
        
        this.autoHideMessage();
      },
      error: (error: HttpErrorResponse) => {
        // ERROR 
        this.showDeleteModal = false;
        this.cdr.detectChanges(); 
        this.errorMessage = this.parseError(error);
        this.autoHideMessage();
        this.selectedProductForDelete = null;
      }
    });
  }

  // --- Helpers ---

  private filterAndPaginate(products: FinancialProduct[], searchTerm: string | null, limit: number | null): FinancialProduct[] {
    let filtered = products;

    // F2. Búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(term) || 
        p.description.toLowerCase().includes(term)
      );
    }

    // F3. Cantidad de registros
    const effectiveLimit = limit || 5;
    return filtered.slice(0, effectiveLimit);
  }

  goToAddProduct(): void {
    this.router.navigate(['/products/add']);
  }

  editProduct(product: FinancialProduct): void {
    this.router.navigate(['/products/edit', product.id]);
  }

  openDeleteModal(product: FinancialProduct): void {
    this.errorMessage = ''; 
    this.successMessage = '';
    this.selectedProductForDelete = product;
    this.showDeleteModal = true;
  }

  private parseError(error: HttpErrorResponse): string {
    if (error.error && typeof error.error === 'object' && error.error.message) {
      return error.error.message;
    } else if (error.message) {
      return error.message;
    }
    return 'Ocurrió un error inesperado. Intente nuevamente.';
  }

  private autoHideMessage(): void {
    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 4000); // Ocultar a los 4 segundos
  }
}