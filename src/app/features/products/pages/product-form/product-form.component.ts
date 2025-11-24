import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CustomValidators } from '../../../../shared/utils/custom-validators';
import { FinancialProduct } from '../../../../core/models/financial-product.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
  standalone: false
})
export class ProductFormComponent implements OnInit {
  productForm!: FormGroup;
  isEditMode: boolean | null = false;
  productId: string | null = null;
  loading = false;
  
  errorMessage: string = ''; 

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  private initForm(): void {
    this.productForm = this.fb.group({
      id: [
        '', 
        [Validators.required, Validators.minLength(3), Validators.maxLength(10)], 
        [CustomValidators.idUnique(this.productService)] // Async Validator
      ],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', [Validators.required, CustomValidators.isImageURLValid]],
      date_release: ['', [Validators.required, CustomValidators.dateMustBeFutureOrPresent]],
      date_revision: ['', [Validators.required]] // Será calculado
    });

    this.productForm.get('date_release')?.valueChanges.subscribe(value => {
      if (value && !this.productForm.get('date_release')?.errors) {
        this.calculateRevisionDate(value);
      }
    });
  }

  /**
   * Regla de Negocio: Fecha Revisión = Fecha Liberación + 1 Año
  */
  public calculateRevisionDate(releaseDate: string): void {
    const date = new Date(releaseDate + 'T00:00:00');
    date.setFullYear(date.getFullYear() + 1);
    
    // Formatear a YYYY-MM-DD
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    
    const revisionDate = `${year}-${month}-${day}`;
    
    this.productForm.get('date_revision')?.setValue(revisionDate);
    this.productForm.get('date_revision')?.disable(); 
  }

  private checkEditMode(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.productId = params['id'];
        this.loadProductData(params['id']);
        
        const idControl = this.productForm.get('id');
        idControl?.disable();
        idControl?.clearAsyncValidators();
      }
    });
  }

  private loadProductData(id: string): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: products => {
        const product = products.find(p => p.id === id);
        if (product) {
          // Formatear fechas para el input date
          const release = product.date_release.toString().split('T')[0];
          const revision = product.date_revision.toString().split('T')[0];
  
          this.productForm.patchValue({
            ...product,
            date_release: release,
            date_revision: revision
          });
        }
        this.loading = false;
      },
      error: (err) => {
        this.handleApiError(err);
        this.loading = false;
      }
    });
  }

  /**
   * Acción de Reiniciar (F4)
   */
  resetForm(): void {
    this.productForm.reset();
    if (this.isEditMode && this.productId) {
       this.productForm.get('id')?.setValue(this.productId);
    }
  }

  /**
   * Envío del formulario con redirección y mensaje de éxito
   */
  submit(): void {
    this.errorMessage = ''; 
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched(); 
      return;
    }

    const formValue = this.productForm.getRawValue() as FinancialProduct;
    
    if (this.isEditMode) {
      // ACTUALIZAR
      this.productService.updateProduct(formValue).subscribe({
        next: () => {
          // 🔑 CORRECCIÓN: Usar la clave 'message'
          this.router.navigate(['/products'], { 
            state: { message: 'Producto editado correctamente.' } 
          });
        },
        error: (err: HttpErrorResponse) => {
          this.handleApiError(err);
        }
      });
    } else {
      // CREAR
      this.productService.createProduct(formValue).subscribe({
        next: () => {
          // Usar la clave 'message'
          this.router.navigate(['/products'], { 
            state: { message: 'Producto agregado correctamente.' } 
          });
        },
        error: (err: HttpErrorResponse) => {
          this.handleApiError(err);
        }
      });
    }
  }

  /**
   * Helper para manejar y mostrar errores de la API
   */
  private handleApiError(error: HttpErrorResponse): void {
    this.errorMessage = this.parseError(error);
    console.error('Error de API:', error);
    
    this.cdr.detectChanges(); 

    setTimeout(() => {
        this.errorMessage = '';
        this.cdr.detectChanges(); 
    }, 7000); 
  }

  /**
   * Helper para parsear un error HTTP en un mensaje legible
   */
  private parseError(error: HttpErrorResponse): string {
    if (error.error && typeof error.error === 'object' && error.error.message) {
      return error.error.message;
    } 
    else if (error.status === 404) {
      return `Error 404: Recurso no encontrado. La URL de la API para la operación parece incorrecta (${error.url}).`;
    }
    else if (error.message) {
      return `Error ${error.status}: ${error.message}.`;
    }
    return 'Ocurrió un error inesperado al procesar la solicitud. Intente nuevamente.';
  }
  
  // Helper para validaciones en HTML
  isFieldInvalid(field: string): boolean {
    const control = this.productForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  // Helper para volver a la lista
  goBack(): void {
    this.router.navigate(['/products']);
  }
}