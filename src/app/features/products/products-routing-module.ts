import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { ProductFormComponent } from './pages/product-form/product-form.component';

const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'add', component: ProductFormComponent },      // F4
  { path: 'edit/:id', component: ProductFormComponent }  // F5
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
