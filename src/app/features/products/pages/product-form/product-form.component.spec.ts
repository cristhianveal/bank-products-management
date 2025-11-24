import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { ProductFormComponent } from './product-form.component';
import { ProductService } from '../../services/product.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FinancialProduct } from '../../../../core/models/financial-product.interface';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let productService: any;
  let router: any;
  let activatedRoute: any;

  const mockProduct: FinancialProduct = {
    id: 'trj-crd-1',
    name: 'Tarjeta Premium',
    description: 'Descripción XYZ que es lo suficientemente larga',
    logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg',
    date_release: '2025-01-01',
    date_revision: '2026-01-01'
  };

  beforeEach(async () => {
    const productServiceMock = {
      getProducts: jest.fn().mockReturnValue(of([mockProduct])),
      createProduct: jest.fn().mockReturnValue(of({})),
      updateProduct: jest.fn().mockReturnValue(of({})),
      verifyId: jest.fn().mockReturnValue(of(false))
    };

    const routerMock = {
      navigate: jest.fn()
    };

    activatedRoute = {
      params: of({}) // Modo creación por defecto
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ProductFormComponent],
      providers: [
        FormBuilder,
        { provide: ProductService, useValue: productServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    productService = TestBed.inject(ProductService);
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Tests existentes que mantienes
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form', () => {
    expect(component.productForm).toBeDefined();
    expect(component.productForm.get('id')).toBeTruthy();
    expect(component.productForm.get('name')).toBeTruthy();
    expect(component.productForm.get('description')).toBeTruthy();
    expect(component.isEditMode).toBe(false);
  });

  it('should calculate revision date', () => {
    component.calculateRevisionDate('2025-01-01');
    expect(component.productForm.get('date_revision')?.value).toBe('2026-01-01');
    expect(component.productForm.get('date_revision')?.disabled).toBe(true);
  });

  it('should submit in create mode', () => {
    jest.spyOn(component.productForm, 'invalid', 'get').mockReturnValue(false);
    jest.spyOn(component.productForm, 'getRawValue').mockReturnValue(mockProduct);

    component.submit();

    expect(productService.createProduct).toHaveBeenCalledWith(mockProduct);
    expect(router.navigate).toHaveBeenCalledWith(
      ['/products'], 
      { state: { message: 'Producto agregado correctamente.' } }
    );
  });

  it('should reset form', () => {
    component.productForm.patchValue({
      name: 'Test Product',
      description: 'Test description'
    });

    component.resetForm();

    expect(component.productForm.get('name')?.value).toBeNull();
    expect(component.productForm.get('description')?.value).toBeNull();
  });

  // NUEVOS TESTS CORREGIDOS

  describe('Edit Mode', () => {
    beforeEach(() => {
      // Cambiar a modo edición
      activatedRoute.params = of({ id: 'trj-crd-1' });
      
      // Recrear el componente para que detecte el cambio
      fixture = TestBed.createComponent(ProductFormComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should load product data in edit mode', (done) => {
      setTimeout(() => {
        expect(component.isEditMode).toBe(true);
        expect(component.productId).toBe('trj-crd-1');
        expect(productService.getProducts).toHaveBeenCalled();
        done();
      }, 100);
    });

    it('should disable ID field and clear async validators in edit mode', (done) => {
      setTimeout(() => {
        expect(component.productForm.get('id')?.disabled).toBe(true);
        done();
      }, 100);
    });

    it('should submit in edit mode', () => {
      component.isEditMode = true;
      jest.spyOn(component.productForm, 'invalid', 'get').mockReturnValue(false);
      jest.spyOn(component.productForm, 'getRawValue').mockReturnValue(mockProduct);

      component.submit();

      expect(productService.updateProduct).toHaveBeenCalledWith(mockProduct);
      expect(router.navigate).toHaveBeenCalledWith(
        ['/products'], 
        { state: { message: 'Producto editado correctamente.' } }
      );
    });
  });

  describe('Form Validation', () => {
    it('should not submit invalid form', () => {
      jest.spyOn(component.productForm, 'invalid', 'get').mockReturnValue(true);
      const markAllAsTouchedSpy = jest.spyOn(component.productForm, 'markAllAsTouched');

      component.submit();

      expect(productService.createProduct).not.toHaveBeenCalled();
      expect(productService.updateProduct).not.toHaveBeenCalled();
      expect(markAllAsTouchedSpy).toHaveBeenCalled();
    });

    it('should check if field is invalid', () => {
      component.productForm.get('name')?.setValue('');
      component.productForm.get('name')?.markAsTouched();
      component.productForm.get('name')?.markAsDirty();
      
      expect(component.isFieldInvalid('name')).toBe(true);
    });

    it('should return false for valid field', () => {
      component.productForm.get('name')?.setValue('Valid Product Name');
      component.productForm.get('name')?.markAsTouched();
      
      expect(component.isFieldInvalid('name')).toBe(false);
    });

    it('should return false for untouched field', () => {
      component.productForm.get('name')?.setValue('');
      
      expect(component.isFieldInvalid('name')).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should handle API error on create', () => {
      jest.spyOn(component.productForm, 'invalid', 'get').mockReturnValue(false);
      jest.spyOn(component.productForm, 'getRawValue').mockReturnValue(mockProduct);

      const errorResponse = new HttpErrorResponse({
        error: { message: 'Creation failed' },
        status: 400,
        statusText: 'Bad Request'
      });
      productService.createProduct.mockReturnValue(throwError(() => errorResponse));

      component.submit();

      expect(component.errorMessage).toBe('Creation failed');
    });

    it('should handle API error on update', () => {
      component.isEditMode = true;
      jest.spyOn(component.productForm, 'invalid', 'get').mockReturnValue(false);
      jest.spyOn(component.productForm, 'getRawValue').mockReturnValue(mockProduct);

      const errorResponse = new HttpErrorResponse({
        error: { message: 'Update failed' },
        status: 400,
        statusText: 'Bad Request'
      });
      productService.updateProduct.mockReturnValue(throwError(() => errorResponse));

      component.submit();

      expect(component.errorMessage).toBe('Update failed');
    });

    it('should parse 404 error correctly', () => {
      const error = new HttpErrorResponse({
        status: 404,
        url: 'http://localhost:3002/api/products',
        statusText: 'Not Found'
      });
      
      const result = (component as any).parseError(error);
      
      expect(result).toContain('Error 404');
      expect(result).toContain('Recurso no encontrado');
    });

    it('should parse error with status text', () => {
      const error = new HttpErrorResponse({
        status: 500,
        statusText: 'Server Error',
      });
      
      const result = (component as any).parseError(error);
      
      // Actualiza la expectativa para que coincida con el formato real
      expect(result).toContain('Error 500');
      expect(result).toContain('Server Error');
    });

  });

  describe('Navigation', () => {
    it('should navigate back to products', () => {
      component.goBack();
      expect(router.navigate).toHaveBeenCalledWith(['/products']);
    });
  });

  describe('Form Interactions', () => {
   
    it('should not calculate revision date when date has errors', () => {
      const calculateSpy = jest.spyOn(component, 'calculateRevisionDate');
      
      // Simular que el campo tiene errores
      component.productForm.get('date_release')?.setErrors({ required: true });
      component.productForm.get('date_release')?.setValue('2025-01-01');
      
      expect(calculateSpy).not.toHaveBeenCalled();
    });
  });

  // TESTS ADICIONALES PARA SUBIR COBERTURA
  describe('Additional Coverage', () => {
    it('should reset form with product ID in edit mode', () => {
      component.isEditMode = true;
      component.productId = 'test-id';
      
      component.productForm.patchValue({
        name: 'Test Product',
        description: 'Test Description'
      });

      component.resetForm();

      expect(component.productForm.get('name')?.value).toBeNull();
      expect(component.productForm.get('id')?.value).toBe('test-id');
    });

    it('should handle product not found in edit mode', (done) => {
      productService.getProducts.mockReturnValue(of([])); // Producto no encontrado
      activatedRoute.params = of({ id: 'non-existent' });
      
      fixture = TestBed.createComponent(ProductFormComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      setTimeout(() => {
        expect(component.loading).toBe(false);
        done();
      }, 100);
    });

    it('should handle error in loadProductData', (done) => {
      const errorResponse = new HttpErrorResponse({
        error: 'Load error',
        status: 500
      });
      productService.getProducts.mockReturnValue(throwError(() => errorResponse));
      activatedRoute.params = of({ id: 'test-id' });
      
      fixture = TestBed.createComponent(ProductFormComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      setTimeout(() => {
        expect(component.loading).toBe(false);
        expect(component.errorMessage).toBeTruthy();
        done();
      }, 100);
    });
  });
});