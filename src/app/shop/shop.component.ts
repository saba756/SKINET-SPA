import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IBrand } from '../shared/models/brand';
import { IProduct } from '../shared/models/product';
import { IType } from '../shared/models/productType';
import { ShopService } from './shop.service';
import { ShopParams } from './../shared/models/shopParams';
@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  @ViewChild('search', {static: false}) searchTerm: ElementRef;
products: IProduct[];
brands: IBrand[];
types: IType[];
totalCount: number;
shopParams : ShopParams;
sortOptions =[
  {name: 'Alphabetical', value:'name'},
  {name: 'Price: Low to High', value:'priceAsc'},
  {name: 'Price: High to Low', value:'priceDesc'},
];
  constructor(private shopService: ShopService) {
    this.shopParams = this.shopService.getshopParams();
   }
  ngOnInit() {
  this.getProducts(true);
  this.getBrands();
  this.getTypes();
  console.log("hey")
  }
  getProducts(useCache = false){
    this.shopService.getProducts(useCache).subscribe(response =>{
      this.products = response.data ;
      this.totalCount = response.count;
    },
     error => {
      console.log(error);
    });
  }

  getBrands(){
    this.shopService.getBrand().subscribe( response =>{
        this.brands = [{id: 0, name: 'All'}, ... response];
    },
    error => {
     console.log(error);
   });
  }
  getTypes(){
    this.shopService.getTypes().subscribe( response =>{
        this.types = [{id: 0, name: 'All'}, ... response];
    },
    error => {
     console.log(error);
   });
  }
  onBrandSelected(brandId: number){
    const params = this.shopService.getshopParams();
    params.brandId = brandId;
    params.pageNumber = 1;
    this.shopService.setShopParams(params);
    this.getProducts();
  }
  onTypeSelected(typeId: number){
    const params = this.shopService.getshopParams();
    params.typeId = typeId;
    params.pageNumber = 1;
    this.shopService.setShopParams(params);
    this.getProducts();
  }

  onSortSelected(sort: string){
    const params = this.shopService.getshopParams();
    params.sort = sort;
    this.shopService.setShopParams(params);
    this.getProducts();
  }
  onPageChanged(event: any){
    const params = this.shopService.getshopParams();
    if(params.pageNumber !== event) {
      params.pageNumber = event;
      this.shopService.setShopParams(params);
      this.getProducts(true);
    }

  }
  onSearch(){
    const params = this.shopService.getshopParams();
    params.search = this.searchTerm.nativeElement.value;
    params.pageNumber = 1;
    this.shopService.setShopParams(params);
    this.getProducts();
  }

  onReset(){
    this.searchTerm.nativeElement.value= '';
    this.shopParams = new ShopParams();
    this.shopService.setShopParams(this.shopParams);
    this.getProducts();
  }
}
