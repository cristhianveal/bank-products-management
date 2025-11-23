import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared-module';
import { ProductsRoutingModule } from './products-routing-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { ProductFormComponent } from './pages/product-form/product-form.component';


@NgModule({
  declarations: [
    ProductListComponent,
    ProductFormComponent,
  ]
  ,
  imports: [
    CommonModule,
    ProductsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ProductsModule { }
