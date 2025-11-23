import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router'; // 🔑 Importar Router
import { CommonModule } from '@angular/common'; // Asegurar que CommonModule esté importado si usas directivas básicas

@Component({
  selector: 'app-root',
  // Añadimos CommonModule a imports
  imports: [RouterOutlet, CommonModule], 
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true // Asumo que es un componente standalone
})
export class App {
  protected readonly title = signal('bank-products-management');

  // Inyectamos Router en el constructor
  constructor(private router: Router) {} 

  /**
   * Navega a la ruta principal (asumimos que es /products)
   */
  goToHome(): void {
    this.router.navigate(['/products']);
    // O si la ruta de inicio es la raíz:
    // this.router.navigate(['/']); 
  }
}