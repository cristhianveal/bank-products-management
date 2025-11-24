import { CustomValidators } from './custom-validators';
import { ProductService } from '../../features/products/services/product.service';
import { of, throwError } from 'rxjs';
import { AbstractControl } from '@angular/forms';

describe('CustomValidators', () => {
  let productService: jest.Mocked<ProductService>;

  beforeEach(() => {
    productService = {
      verifyId: jest.fn()
    } as any;
  });

  describe('dateMustBeFutureOrPresent', () => {
    it('should return null for future date', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1); // Mañana
      const dateString = futureDate.toISOString().split('T')[0];
      
      const control = { value: dateString } as AbstractControl;
      const result = CustomValidators.dateMustBeFutureOrPresent(control);
      
      expect(result).toBeNull();
    });

    it('should return null for today date', () => {
      const today = new Date();
      const todayString = today.toISOString().split('T')[0];
      
      const control = { value: todayString } as AbstractControl;
      const result = CustomValidators.dateMustBeFutureOrPresent(control);
      
      expect(result).toBeNull();
    });

    it('should return error for past date', () => {
      const pastDate = '2020-01-01';
      
      const control = { value: pastDate } as AbstractControl;
      const result = CustomValidators.dateMustBeFutureOrPresent(control);
      
      expect(result).toEqual({ dateInvalid: true });
    });

    it('should return null for empty value', () => {
      const control = { value: '' } as AbstractControl;
      const result = CustomValidators.dateMustBeFutureOrPresent(control);
      
      expect(result).toBeNull();
    });

    it('should return null for null value', () => {
      const control = { value: null } as AbstractControl;
      const result = CustomValidators.dateMustBeFutureOrPresent(control);
      
      expect(result).toBeNull();
    });
  });

  describe('idUnique', () => {
    it('should return null when ID does not exist', (done) => {
      productService.verifyId.mockReturnValue(of(false));
      
      const validator = CustomValidators.idUnique(productService);
      const control = { value: 'new-id' } as AbstractControl;
      
      // Type assertion para decirle a TypeScript que es un Observable
      (validator(control) as any).subscribe((result: any) => {
        expect(result).toBeNull();
        expect(productService.verifyId).toHaveBeenCalledWith('new-id');
        done();
      });
    });

    it('should return error when ID exists', (done) => {
      productService.verifyId.mockReturnValue(of(true));
      
      const validator = CustomValidators.idUnique(productService);
      const control = { value: 'existing-id' } as AbstractControl;
      
      (validator(control) as any).subscribe((result: any) => {
        expect(result).toEqual({ idExists: true });
        expect(productService.verifyId).toHaveBeenCalledWith('existing-id');
        done();
      });
    });

    it('should return null for empty value', (done) => {
      const validator = CustomValidators.idUnique(productService);
      const control = { value: '' } as AbstractControl;
      
      (validator(control) as any).subscribe((result: any) => {
        expect(result).toBeNull();
        expect(productService.verifyId).not.toHaveBeenCalled();
        done();
      });
    });

    it('should return null for null value', (done) => {
      const validator = CustomValidators.idUnique(productService);
      const control = { value: null } as AbstractControl;
      
      (validator(control) as any).subscribe((result: any) => {
        expect(result).toBeNull();
        expect(productService.verifyId).not.toHaveBeenCalled();
        done();
      });
    });

    it('should handle service error', (done) => {
      const error = new Error('Service unavailable');
      productService.verifyId.mockReturnValue(throwError(() => error));
      
      const validator = CustomValidators.idUnique(productService);
      const control = { value: 'test-id' } as AbstractControl;
      
      (validator(control) as any).subscribe((result: any) => {
        expect(result).toEqual({ idVerificationFailed: true });
        expect(productService.verifyId).toHaveBeenCalledWith('test-id');
        done();
      });
    });
  });

  describe('isImageURLValid', () => {
    it('should return null for valid image URL with jpg', () => {
      const control = { value: 'https://example.com/image.jpg' } as AbstractControl;
      const result = CustomValidators.isImageURLValid(control);
      
      expect(result).toBeNull();
    });

    it('should return null for valid image URL with png', () => {
      const control = { value: 'https://example.com/image.png' } as AbstractControl;
      const result = CustomValidators.isImageURLValid(control);
      
      expect(result).toBeNull();
    });

    it('should return null for valid image URL with jpeg', () => {
      const control = { value: 'https://example.com/image.jpeg' } as AbstractControl;
      const result = CustomValidators.isImageURLValid(control);
      
      expect(result).toBeNull();
    });

    it('should return null for valid image URL with gif', () => {
      const control = { value: 'https://example.com/image.gif' } as AbstractControl;
      const result = CustomValidators.isImageURLValid(control);
      
      expect(result).toBeNull();
    });

    it('should return null for valid image URL with svg', () => {
      const control = { value: 'https://example.com/image.svg' } as AbstractControl;
      const result = CustomValidators.isImageURLValid(control);
      
      expect(result).toBeNull();
    });

    it('should return null for valid image URL without protocol', () => {
      const control = { value: 'www.example.com/image.jpg' } as AbstractControl;
      const result = CustomValidators.isImageURLValid(control);
      
      expect(result).toBeNull();
    });

    it('should return error for invalid URL', () => {
      const control = { value: 'not-a-url' } as AbstractControl;
      const result = CustomValidators.isImageURLValid(control);
      
      expect(result).toEqual({ invalidImageURL: true });
    });

    it('should return error for URL without image extension', () => {
      const control = { value: 'https://example.com/document.pdf' } as AbstractControl;
      const result = CustomValidators.isImageURLValid(control);
      
      expect(result).toEqual({ invalidImageURL: true });
    });

    it('should return error for URL with wrong extension', () => {
      const control = { value: 'https://example.com/image.txt' } as AbstractControl;
      const result = CustomValidators.isImageURLValid(control);
      
      expect(result).toEqual({ invalidImageURL: true });
    });

    it('should return null for empty value', () => {
      const control = { value: '' } as AbstractControl;
      const result = CustomValidators.isImageURLValid(control);
      
      expect(result).toBeNull();
    });

    it('should return null for null value', () => {
      const control = { value: null } as AbstractControl;
      const result = CustomValidators.isImageURLValid(control);
      
      expect(result).toBeNull();
    });
  });
});