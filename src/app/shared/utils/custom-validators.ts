import { AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { Observable, map, catchError, of } from 'rxjs';
import { ProductService } from '../../features/products/services/product.service';

export class CustomValidators {

  /**
   * Valida que la fecha sea igual o mayor a la fecha actual
   */
  static dateMustBeFutureOrPresent(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const inputDate = new Date(control.value + 'T00:00:00'); // Forzar zona horaria local simple
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return inputDate >= today ? null : { dateInvalid: true };
  }

  /**
   * Validador Asíncrono: Verifica si el ID ya existe en la API
   */
 static idUnique(productService: ProductService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }
      return productService.verifyId(control.value).pipe(
        map(exists => (exists ? { idExists: true } : null)),
        // Manejo de error de conexión en el validador
        catchError((error) => {
             console.error('ID Verification Service Error:', error); 
             // Retornamos un error específico. Esto marca el control como inválido
             // y deshabilitará el botón a través de `productForm.invalid`.
             return of({ idVerificationFailed: true }); 
        }) 
      );
    };
  }

  /**
   * Validador de URL de Imagen: Verifica que el string sea un URL válido
   * y que termine en una extensión de imagen común (jpg, jpeg, png, gif, svg).
   */
  static isImageURLValid(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null; // Permitimos que el validador 'required' maneje si está vacío
    }

    // Expresión regular robusta para validar URL y extensión de imagen
    const urlRegex = new RegExp(
      '^(https?:\\/\\/)?' + // protocolo (opcional)
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,})' + // nombre de dominio
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // puerto y path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string (opcional)
      '(\\#[-a-z\\d_]*)?' + // fragmento (opcional)
      '\\.(jpe?g|png|gif|svg)$', // extensión de imagen
      'i' // Case-insensitive
    );

    const isValid = urlRegex.test(control.value);

    return isValid ? null : { invalidImageURL: true };
  }
}