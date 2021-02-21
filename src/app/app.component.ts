import { Component, OnInit } from '@angular/core';
import { ProductsService } from './products.service';
import { Observable } from 'rxjs';
import { Product } from './product.model';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  productsErrorHandling: Product[];
  simpleReqProductsObs$: Observable<Product[]>;

  constructor(
    private productsService: ProductsService,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
  }

  getSimpleHttpRequest(): void {
    this.simpleReqProductsObs$ = this.productsService.getProducts();
  }

  getProductsWithErrorHandling(): void {
    this.productsService.getProductsError().subscribe(prods => {
        this.productsErrorHandling = prods;
      },
      error => {
        console.log(error);
        console.log('Message:', error.error.msg);
        console.log('Message:', error.status);
        const config = new MatSnackBarConfig();
        config.duration = 2000;
        config.panelClass = ['snack_err'];

        if (error.status === 0) {
          this.snackBar.open('Coud not connect to the server', '', config);
        } else {
          this.snackBar.open(error.error.msg, '', config);

        }
      }
    );
  }

  getProductsWithErrorHandlingOk(): void {
    this.productsService.getProductsDelay().subscribe(prods => {
        this.productsErrorHandling = prods;
        const config = new MatSnackBarConfig();
        config.duration = 2000;
        config.panelClass = ['snack_ok'];
        this.snackBar.open('Products successfuly loaded!', '', config);
      },
      error => {
        console.log(error);
      }
    );
  }
}
