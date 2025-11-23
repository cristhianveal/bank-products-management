import { Component, HostListener, ElementRef } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  standalone: false,
  templateUrl: './dropdown.component.html',  
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent {
  isOpen = false;

  constructor(private el: ElementRef) {}

  toggle() {
    this.isOpen = !this.isOpen;
  }

  // Cierra el menú si se hace clic fuera de él
  @HostListener('document:click', ['$event'])
  closeOnClickOutside(event: Event) {
    // Verificamos si el clic ocurrió fuera del elemento nativo de este componente
    if (!this.el.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }
}