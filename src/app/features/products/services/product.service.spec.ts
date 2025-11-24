import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { FinancialProduct } from '../../../core/models/financial-product.interface';
import { environment } from '../../../../environments/environment';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/products`;

  // Mock data
  const mockProducts: FinancialProduct[] = [
    {
      id: 'trj-crd-1',
      name: 'Tarjeta de Crédito Premium',
      description: 'Tarjeta con beneficios exclusivos y alto límite de crédito',
      logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg',
      date_release: '2024-01-01',
      date_revision: '2025-01-01'
    },
    {
      id: 'trj-dbt-1',
      name: 'Tarjeta de Débito Básica',
      description: 'Tarjeta para operaciones diarias sin costo de mantenimiento',
      logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg',
      date_release: '2024-02-15',
      date_revision: '2025-02-15'
    }
  ];

  const mockProduct: FinancialProduct = {
    id: 'trj-crd-2',
    name: 'Tarjeta de Crédito Gold',
    description: 'Tarjeta con beneficios para viajeros frecuentes',
    logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpgg',
    date_release: '2024-03-01',
    date_revision: '2025-03-01'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no hayan requests pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProducts', () => {
    it('should return products array when response has data property', () => {
      // Arrange & Act
      service.getProducts().subscribe(products => {
        expect(products).toEqual(mockProducts);
      });

      // Assert
      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush({ data: mockProducts }); // Simula respuesta exitosa con estructura {data: [...]}
    });

    it('should return products array directly when response has no data property', () => {
      // Arrange & Act
      service.getProducts().subscribe(products => {
        expect(products).toEqual(mockProducts);
      });

      // Assert
      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts); // Simula respuesta exitosa sin estructura {data: [...]}
    });

    it('should handle error when getProducts fails', () => {
      const errorResponse = { status: 500, statusText: 'Server Error' };

      // Arrange & Act
      service.getProducts().subscribe({
        next: () => fail('should have failed with 500 error'),
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      // Assert
      const req = httpMock.expectOne(apiUrl);
      req.flush('Server Error', errorResponse);
    });
  });

  describe('createProduct', () => {
    it('should create a product and return it when response has data property', () => {
      // Arrange & Act
      service.createProduct(mockProduct).subscribe(product => {
        expect(product).toEqual(mockProduct);
      });

      // Assert
      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockProduct);
      req.flush({ data: mockProduct });
    });

    it('should create a product and return it directly when response has no data property', () => {
      // Arrange & Act
      service.createProduct(mockProduct).subscribe(product => {
        expect(product).toEqual(mockProduct);
      });

      // Assert
      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      req.flush(mockProduct);
    });

    it('should handle error when createProduct fails', () => {
      const errorResponse = { 
        status: 400, 
        statusText: 'Bad Request',
        error: { message: 'Invalid body' }
      };

      // Arrange & Act
      service.createProduct(mockProduct).subscribe({
        next: () => fail('should have failed with 400 error'),
        error: (error) => {
          expect(error.status).toBe(400);
          expect(error.error.message).toBe('Invalid body');
        }
      });

      // Assert
      const req = httpMock.expectOne(apiUrl);
      req.flush(errorResponse.error, errorResponse);
    });
  });

  describe('updateProduct', () => {
    it('should update a product and return it when response has data property', () => {
      const updatedProduct: FinancialProduct = {
        ...mockProduct,
        name: 'Tarjeta de Crédito Platinum'
      };

      // Arrange & Act
      service.updateProduct(updatedProduct).subscribe(product => {
        expect(product).toEqual(updatedProduct);
      });

      // Assert
      const req = httpMock.expectOne(`${apiUrl}/${updatedProduct.id}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedProduct);
      req.flush({ data: updatedProduct });
    });

    it('should update a product and return it directly when response has no data property', () => {
      const updatedProduct: FinancialProduct = {
        ...mockProduct,
        description: 'Descripción actualizada'
      };

      // Arrange & Act
      service.updateProduct(updatedProduct).subscribe(product => {
        expect(product).toEqual(updatedProduct);
      });

      // Assert
      const req = httpMock.expectOne(`${apiUrl}/${updatedProduct.id}`);
      expect(req.request.method).toBe('PUT');
      req.flush(updatedProduct);
    });

    it('should handle error when updateProduct fails', () => {
      const errorResponse = { 
        status: 404, 
        statusText: 'Not Found',
        error: { message: 'Product not found' }
      };

      // Arrange & Act
      service.updateProduct(mockProduct).subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.error.message).toBe('Product not found');
        }
      });

      // Assert
      const req = httpMock.expectOne(`${apiUrl}/${mockProduct.id}`);
      req.flush(errorResponse.error, errorResponse);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product successfully', () => {
      const productId = 'trj-crd-1';

      // Arrange & Act
      service.deleteProduct(productId).subscribe(response => {
        expect(response).toBeUndefined(); // delete no retorna data
      });

      // Assert
      const req = httpMock.expectOne(`${apiUrl}/${productId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null); // DELETE normalmente retorna null o vacío
    });

    it('should handle error when deleteProduct fails', () => {
      const productId = 'invalid-id';
      const errorResponse = { 
        status: 404, 
        statusText: 'Not Found',
        error: { message: 'Product not found' }
      };

      // Arrange & Act
      service.deleteProduct(productId).subscribe({
        next: () => fail('should have failed with 404 error'),
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.error.message).toBe('Product not found');
        }
      });

      // Assert
      const req = httpMock.expectOne(`${apiUrl}/${productId}`);
      req.flush(errorResponse.error, errorResponse);
    });
  });

  describe('verifyId', () => {
    it('should verify if ID exists and return true', () => {
      const productId = 'trj-crd-1';

      // Arrange & Act
      service.verifyId(productId).subscribe(exists => {
        expect(exists).toBe(true);
      });

      // Assert
      const req = httpMock.expectOne(`${apiUrl}/verification/${productId}`);
      expect(req.request.method).toBe('GET');
      req.flush(true);
    });

    it('should verify if ID exists and return false', () => {
      const productId = 'non-existent-id';

      // Arrange & Act
      service.verifyId(productId).subscribe(exists => {
        expect(exists).toBe(false);
      });

      // Assert
      const req = httpMock.expectOne(`${apiUrl}/verification/${productId}`);
      expect(req.request.method).toBe('GET');
      req.flush(false);
    });

    it('should handle error when verifyId fails', () => {
      const productId = 'error-id';
      const errorResponse = { status: 500, statusText: 'Server Error' };

      // Arrange & Act
      service.verifyId(productId).subscribe({
        next: () => fail('should have failed with 500 error'),
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      // Assert
      const req = httpMock.expectOne(`${apiUrl}/verification/${productId}`);
      req.flush('Server Error', errorResponse);
    });
  });

  describe('handleError', () => {
    it('should handle and rethrow errors', () => {
      const testError = new Error('Test error');

      // Test indirectamente handleError a través de getProducts
      service.getProducts().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush('Error', { status: 500, statusText: 'Server Error' });
    });
  });
});