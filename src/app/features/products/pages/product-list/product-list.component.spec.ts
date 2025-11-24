import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { FinancialProduct } from '../../../../core/models/financial-product.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productService: any;
  let router: any;

  const mockProducts: FinancialProduct[] = [
    {
      id: 'trj-crd-1',
      name: 'Tarjeta Premium',
      description: 'Descripción XYZ',
      logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg',
      date_release: '2025-01-01',
      date_revision: '2026-01-01'
    }
  ];

  beforeEach(async () => {
    const productServiceMock = {
      getProducts: jest.fn(),
      deleteProduct: jest.fn()
    };

    const routerMock = {
      navigate: jest.fn(),
      getCurrentNavigation: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ProductListComponent],
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        { provide: Router, useValue: routerMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    productService = TestBed.inject(ProductService);
    router = TestBed.inject(Router);
    
    router.getCurrentNavigation.mockReturnValue({ extras: { state: null } });
  });

  // **TESTS ESENCIALES - TODOS FUNCIONAN**

  it('should create and load products', () => {
    productService.getProducts.mockReturnValue(of(mockProducts));
    
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(productService.getProducts).toHaveBeenCalled();
  });

  it('should handle loading error', () => {
    const error = new HttpErrorResponse({ error: 'Error', status: 500 });
    productService.getProducts.mockReturnValue(throwError(() => error));
    
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.errorMessage).toBeTruthy();
    expect(component.loading).toBe(false);
  });

  it('should search products', (done) => {
    productService.getProducts.mockReturnValue(of(mockProducts));
    
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.searchControl.setValue('Premium');
    
    setTimeout(() => {
      component.filteredProducts$.subscribe(products => {
        expect(products.length).toBe(1);
        done();
      });
    }, 100);
  });

  it('should navigate to add product', () => {
    productService.getProducts.mockReturnValue(of(mockProducts));
    
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.goToAddProduct();
    expect(router.navigate).toHaveBeenCalledWith(['/products/add']);
  });

  it('should open delete modal', () => {
    productService.getProducts.mockReturnValue(of(mockProducts));
    
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.openDeleteModal(mockProducts[0]);
    
    expect(component.showDeleteModal).toBe(true);
    expect(component.selectedProductForDelete).toBe(mockProducts[0]);
  });

  it('should delete product', () => {
    productService.getProducts.mockReturnValue(of(mockProducts));
    productService.deleteProduct.mockReturnValue(of(void 0));
    
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.selectedProductForDelete = mockProducts[0];
    component.confirmDelete();

    expect(productService.deleteProduct).toHaveBeenCalledWith('trj-crd-1');
  });

  describe('Additional Coverage - Tests que SÍ funcionan', () => {
    beforeEach(() => {
      productService.getProducts.mockReturnValue(of(mockProducts));
      fixture = TestBed.createComponent(ProductListComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should handle pagination with different limits', (done) => {
      component.itemsPerPageControl.setValue(10);
      
      setTimeout(() => {
        component.filteredProducts$.subscribe(products => {
          expect(products.length).toBe(1);
          done();
        });
      }, 100);
    });

    it('should handle null search term', (done) => {
      component.searchControl.setValue(null);
      
      setTimeout(() => {
        component.filteredProducts$.subscribe(products => {
          expect(products.length).toBe(1);
          done();
        });
      }, 100);
    });

    it('should handle null pagination limit', (done) => {
      component.itemsPerPageControl.setValue(null);
      
      setTimeout(() => {
        component.filteredProducts$.subscribe(products => {
          expect(products.length).toBe(1);
          done();
        });
      }, 100);
    });

    it('should navigate to edit product', () => {
      component.editProduct(mockProducts[0]);
      expect(router.navigate).toHaveBeenCalledWith(['/products/edit', 'trj-crd-1']);
    });

    it('should set success message from navigation state', () => {
      const successMessage = 'Producto creado exitosamente';
      router.getCurrentNavigation.mockReturnValue({
        extras: {
          state: { message: successMessage }
        }
      });

      fixture = TestBed.createComponent(ProductListComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(component.successMessage).toBe(successMessage);
    });

    it('should handle delete error', () => {
      component.selectedProductForDelete = mockProducts[0];
      component.showDeleteModal = true;

      const errorResponse = new HttpErrorResponse({
        error: { message: 'Delete failed' },
        status: 500
      });
      productService.deleteProduct.mockReturnValue(throwError(() => errorResponse));

      component.confirmDelete();

      expect(productService.deleteProduct).toHaveBeenCalledWith('trj-crd-1');
      expect(component.showDeleteModal).toBe(false);
      expect(component.errorMessage).toBe('Delete failed');
    });

    it('should not delete if no product selected', () => {
      component.selectedProductForDelete = null;
      
      component.confirmDelete();

      expect(productService.deleteProduct).not.toHaveBeenCalled();
    });
  });

  describe('Filter and Paginate Logic - Tests DIRECTOS', () => {
    it('should filter products by description', () => {
      const products = [
        { id: '1', name: 'Product A', description: 'Special product', logo: '', date_release: '2025-01-01', date_revision: '2026-01-01' },
        { id: '2', name: 'Product B', description: 'Regular product', logo: '', date_release: '2025-01-01', date_revision: '2026-01-01' }
      ];
      
      const result = (component as any).filterAndPaginate(products, 'special', 10);
      
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('1');
    });

    it('should return empty array for non-matching search', () => {
      const products = [
        { id: '1', name: 'Product A', description: 'Special product', logo: '', date_release: '2025-01-01', date_revision: '2026-01-01' }
      ];
      
      const result = (component as any).filterAndPaginate(products, 'nonexistent', 10);
      
      expect(result.length).toBe(0);
    });

    it('should paginate correctly', () => {
      const products = [
        { id: '1', name: 'A', description: 'A', logo: '', date_release: '2025-01-01', date_revision: '2026-01-01' },
        { id: '2', name: 'B', description: 'B', logo: '', date_release: '2025-01-01', date_revision: '2026-01-01' },
        { id: '3', name: 'C', description: 'C', logo: '', date_release: '2025-01-01', date_revision: '2026-01-01' }
      ];
      
      const result = (component as any).filterAndPaginate(products, '', 2);
      
      expect(result.length).toBe(2);
      expect(result[0].id).toBe('1');
      expect(result[1].id).toBe('2');
    });

    it('should handle empty products array', () => {
      const result = (component as any).filterAndPaginate([], 'test', 5);
      
      expect(result.length).toBe(0);
    });

    it('should filter products by name', () => {
      const products = [
        { id: '1', name: 'Tarjeta Oro', description: 'Descripción 1', logo: '', date_release: '2025-01-01', date_revision: '2026-01-01' },
        { id: '2', name: 'Tarjeta Plata', description: 'Descripción 2', logo: '', date_release: '2025-01-01', date_revision: '2026-01-01' }
      ];
      
      const result = (component as any).filterAndPaginate(products, 'oro', 10);
      
      expect(result.length).toBe(1);
      expect(result[0].id).toBe('1');
    });

    it('should return all products when search term is empty', () => {
      const products = [
        { id: '1', name: 'A', description: 'A', logo: '', date_release: '2025-01-01', date_revision: '2026-01-01' },
        { id: '2', name: 'B', description: 'B', logo: '', date_release: '2025-01-01', date_revision: '2026-01-01' }
      ];
      
      const result = (component as any).filterAndPaginate(products, '', 10);
      
      expect(result.length).toBe(2);
    });
  });
});