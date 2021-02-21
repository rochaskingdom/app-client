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

  bLoading = false;
  productsIds: Product[];
  productsLoading: Product[];
  newlyProducts: Product[] = [];
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

  getProductsLoading(): void {
    this.bLoading = true;
    this.productsService.getProductsDelay().subscribe(prods => {
        this.productsLoading = prods;
        this.bLoading = false;
      },
      error => {
        console.log(error);
        this.bLoading = false;
      }
    );
  }

  getProductsIds(): void {
    this.productsService.getProductsIds().subscribe(ids => {
      this.productsIds = ids.map(id => ({ _id: id, name: '', department: '', price: 0 }));
    });
  }

  loadName(id: string): void {
    this.productsService.getProducName(id).subscribe(name => {
      const index = this.productsIds.findIndex(p => p._id === id);
      if (index >= 0) {
        this.productsIds[index].name = name;
      }
    });
  }

  saveProduct(name: string, department: string, price: number): void {
    let p = { name, department, price };
    this.productsService.saveProduct(p).subscribe((p: Product) => {
      console.log(p);
      this.newlyProducts.push(p);
    }, (error) => {
      console.log(error);
      let config = new MatSnackBarConfig();
      config.duration = 2000;
      config.panelClass = ['snack_err'];
      if (error.status === 0) {
        this.snackBar.open('Coud not connect to the server', '', config);
      } else {
        this.snackBar.open(error.error.msg, '', config);

      }
    });
  }
}
