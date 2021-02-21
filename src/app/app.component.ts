import { Component, OnInit } from '@angular/core';
import { ProductsService } from './products.service';
import { Observable } from 'rxjs';
import { Product } from './product.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  simpleReqProductsObs$: Observable<Product[]>;

  constructor(
    private productsService: ProductsService
  ) {
  }

  ngOnInit(): void {
  }

  getSimpleHttpRequest(): void {
    this.simpleReqProductsObs$ = this.productsService.getProducts();
  }
}
