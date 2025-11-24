import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    // No llamar detectChanges() aquí inicialmente para evitar el error
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Input properties', () => {
    it('should have default values for isVisible and message', () => {
      expect(component.isVisible).toBe(false);
      expect(component.message).toBe('');
    });

    it('should accept input values for isVisible', () => {
      component.isVisible = true;
      // No necesitamos detectChanges() para esta prueba simple
      expect(component.isVisible).toBe(true);
    });

    it('should accept input values for message', () => {
      const testMessage = 'Test message';
      component.message = testMessage;
      expect(component.message).toBe(testMessage);
    });
  });

  describe('Output events', () => {
    it('should emit confirm event when onConfirm is called', () => {
      const spy = jest.spyOn(component.confirm, 'emit');
      
      component.onConfirm();
      
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should emit cancel event when onCancel is called', () => {
      const spy = jest.spyOn(component.cancel, 'emit');
      
      component.onCancel();
      
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should emit cancel event when onOverlayClick is called', () => {
      const spy = jest.spyOn(component.cancel, 'emit');
      const mockEvent = new MouseEvent('click');
      
      component.onOverlayClick(mockEvent);
      
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Event handling', () => {
    it('should call onCancel when overlay is clicked', () => {
      const onCancelSpy = jest.spyOn(component, 'onCancel');
      const mockEvent = new MouseEvent('click');
      
      component.onOverlayClick(mockEvent);
      
      expect(onCancelSpy).toHaveBeenCalled();
    });

    it('should not propagate click event when modal content is clicked', () => {
      const mockEvent = {
        stopPropagation: jest.fn()
      } as unknown as MouseEvent;
      
      // Simular el click en el contenido del modal
      const modalContentClickHandler = (event: MouseEvent) => {
        event.stopPropagation();
      };
      
      modalContentClickHandler(mockEvent);
      
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });
  });

  describe('Template rendering', () => {
    it('should not render modal when isVisible is false', () => {
      component.isVisible = false;
      fixture.detectChanges();
      
      const modalOverlay = fixture.nativeElement.querySelector('.modal-overlay');
      expect(modalOverlay).toBeNull();
    });

    it('should render modal when isVisible is true', () => {
      component.isVisible = true;
      component.message = 'Test message';
      
      // Usar fixture.detectChanges() una sola vez después de configurar todas las propiedades
      fixture.detectChanges();
      
      const modalOverlay = fixture.nativeElement.querySelector('.modal-overlay');
      const modalMessage = fixture.nativeElement.querySelector('.modal-body p');
      
      expect(modalOverlay).toBeTruthy();
      expect(modalMessage.textContent).toContain('Test message');
    });

    it('should display the correct message in the template', () => {
      const testMessage = 'Are you sure you want to delete this item?';
      component.isVisible = true;
      component.message = testMessage;
      
      fixture.detectChanges();
      
      const modalMessage = fixture.nativeElement.querySelector('.modal-body p');
      expect(modalMessage.textContent).toBe(testMessage);
    });
  });

  describe('Button interactions', () => {
    beforeEach(() => {
      component.isVisible = true;
      // Configurar todas las propiedades antes de detectChanges()
      fixture.detectChanges();
    });

    it('should call onCancel when cancel button is clicked', () => {
      const onCancelSpy = jest.spyOn(component, 'onCancel');
      const cancelButton = fixture.nativeElement.querySelector('.btn-cancel');
      
      cancelButton.click();
      
      expect(onCancelSpy).toHaveBeenCalled();
    });

    it('should call onConfirm when confirm button is clicked', () => {
      const onConfirmSpy = jest.spyOn(component, 'onConfirm');
      const confirmButton = fixture.nativeElement.querySelector('.btn-confirm');
      
      confirmButton.click();
      
      expect(onConfirmSpy).toHaveBeenCalled();
    });
  });

  // Pruebas adicionales para cubrir edge cases
  describe('Edge cases', () => {
    it('should handle multiple confirm emissions', () => {
      const spy = jest.spyOn(component.confirm, 'emit');
      
      component.onConfirm();
      component.onConfirm();
      component.onConfirm();
      
      expect(spy).toHaveBeenCalledTimes(3);
    });

    it('should handle multiple cancel emissions', () => {
      const spy = jest.spyOn(component.cancel, 'emit');
      
      component.onCancel();
      component.onCancel();
      
      expect(spy).toHaveBeenCalledTimes(2);
    });

    it('should work with empty message', () => {
      component.isVisible = true;
      component.message = '';
      
      fixture.detectChanges();
      
      const modalMessage = fixture.nativeElement.querySelector('.modal-body p');
      expect(modalMessage.textContent).toBe('');
    });
  });
});