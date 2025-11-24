import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DropdownComponent } from './dropdown.component';

describe('DropdownComponent', () => {
  let component: DropdownComponent;
  let fixture: ComponentFixture<DropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DropdownComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start closed', () => {
    expect(component.isOpen).toBe(false);
  });

  it('should toggle open/close state', () => {
    component.toggle();
    expect(component.isOpen).toBe(true);

    component.toggle();
    expect(component.isOpen).toBe(false);
  });

  it('should close when clicking outside', () => {
    component.isOpen = true;
    
    const mockEvent = new Event('click');
    jest.spyOn(component['el'].nativeElement, 'contains').mockReturnValue(false);
    
    component.closeOnClickOutside(mockEvent);
    
    expect(component.isOpen).toBe(false);
  });

  it('should not close when clicking inside', () => {
    component.isOpen = true;
    
    const mockEvent = new Event('click');
    jest.spyOn(component['el'].nativeElement, 'contains').mockReturnValue(true);
    
    component.closeOnClickOutside(mockEvent);
    
    expect(component.isOpen).toBe(true);
  });

  // Pruebas corregidas para evitar el error de detección de cambios
  describe('Template rendering', () => {
    it('should render menu when open', () => {
      component.isOpen = true;
      fixture.detectChanges();
      
      const menuElement = fixture.nativeElement.querySelector('.dropdown-menu');
      expect(menuElement).toBeTruthy();
    });

    it('should not render menu when closed', () => {
      component.isOpen = false;
      fixture.detectChanges();
      
      const menuElement = fixture.nativeElement.querySelector('.dropdown-menu');
      expect(menuElement).toBeNull();
    });
  });

  // Pruebas separadas para evitar múltiples detectChanges en la misma prueba
  it('should show menu after opening', () => {
    component.isOpen = true;
    fixture.detectChanges();
    
    expect(fixture.nativeElement.querySelector('.dropdown-menu')).toBeTruthy();
  });

  it('should hide menu after closing', () => {
    component.isOpen = false;
    fixture.detectChanges();
    
    expect(fixture.nativeElement.querySelector('.dropdown-menu')).toBeNull();
  });

  it('should call toggle when trigger button is clicked', () => {
    fixture.detectChanges(); // Solo un detectChanges por prueba
    
    const toggleSpy = jest.spyOn(component, 'toggle');
    const triggerButton = fixture.nativeElement.querySelector('.dropdown-trigger');
    
    triggerButton.click();
    
    expect(toggleSpy).toHaveBeenCalled();
  });
});