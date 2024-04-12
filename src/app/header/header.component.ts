import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {product, signUp, signUpSeller} from '../data-type';
import { ProductService } from '../services/product.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  menuType: string = 'default';
  sellerName:string="";
  userName:string="";
  searchResult:undefined|product[];
  cartItems=0;
  showSearch: boolean = false;
  constructor(private route: Router, private product:ProductService) {}
  ngOnInit(): void {
    this.route.events.subscribe((val: any) => {
      if (val.url) {
        if (localStorage.getItem('seller') && val.url.includes('seller')) {
          let sellerStore = localStorage.getItem('seller');
          if (sellerStore) {
            const seller: signUpSeller[] = JSON.parse(sellerStore);
            this.sellerName = seller[0].name;
          }

          this.menuType = 'seller';
        } else if (localStorage.getItem('user')) {

          let userStore = localStorage.getItem('user');
          let userData = userStore && JSON.parse(userStore);

          if (userStore) {
            const user: signUp = JSON.parse(userStore);
            this.userName = user.username;
          }

          this.menuType = 'user';
          this.product.getCartList(userData.id);
        } else {
          this.menuType = 'default';
        }
      }
    });
    let cartData = localStorage.getItem('localCart');
    if (cartData) {
      this.cartItems = JSON.parse(cartData).length;
    }
    this.product.cartData.subscribe((items) => {
      this.cartItems = items.length;
    })
  }

  logout(){
    localStorage.removeItem('seller');
    this.route.navigate(['/']);
    this.product.cartData.emit([]);
    this.cartItems=0;
  }

  userLogout(){
    localStorage.removeItem('user');
    this.route.navigate(['/register_login']);
    this.product.cartData.emit([]);
    this.cartItems=0;
  }

  searchProduct(query:KeyboardEvent){
    if(query){
      const element = query.target as HTMLInputElement;
      this.product.searchProduct(element.value).subscribe((result)=>{

        if(result.length>5){
          result.length=length;
        }
        this.searchResult=result;
      })
    }
  }

  toggleSearch() {
    this.showSearch = !this.showSearch;
  }

  hideSearch(){
    this.searchResult=undefined;
  }
  redirectToDetails(id:number){
    this.route.navigate(['/details/' + id]);
  }
  submitSearch(val:string){
    console.warn(val)
    this.route.navigate([`/search/${val}`]);
  }

  clear(){
    this.cartItems=0;
  }
}

