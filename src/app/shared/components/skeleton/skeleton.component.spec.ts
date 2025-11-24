import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkeletonComponent } from './skeleton.component';

describe('SkeletonComponent', () => {
  let component: SkeletonComponent;
  let fixture: ComponentFixture<SkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkeletonComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkeletonComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.height).toBe('20px');
    expect(component.width).toBe('100%');
  });

  it('should apply custom styles to template', () => {
    component.height = '50px';
    component.width = '200px';
    fixture.detectChanges();

    const skeletonElement = fixture.nativeElement.querySelector('.skeleton-loader');
    expect(skeletonElement.style.height).toBe('50px');
    expect(skeletonElement.style.width).toBe('200px');
  });

  it('should handle different unit types', () => {
    component.height = '2rem';
    component.width = '50%';
    fixture.detectChanges();

    const skeletonElement = fixture.nativeElement.querySelector('.skeleton-loader');
    expect(skeletonElement.style.height).toBe('2rem');
    expect(skeletonElement.style.width).toBe('50%');
  });

  it('should handle empty values', () => {
    component.height = '';
    component.width = '';
    fixture.detectChanges();

    const skeletonElement = fixture.nativeElement.querySelector('.skeleton-loader');
    expect(skeletonElement.style.height).toBe('');
    expect(skeletonElement.style.width).toBe('');
  });

  it('should handle zero values', () => {
    component.height = '0';
    component.width = '0';
    fixture.detectChanges();

    const skeletonElement = fixture.nativeElement.querySelector('.skeleton-loader');
    expect(skeletonElement.style.height).toBe('0px');
    expect(skeletonElement.style.width).toBe('0px');
  });
});