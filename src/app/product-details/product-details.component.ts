import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { cart, product } from '../data-type';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  productData:undefined | product;
  productQuantity:number=1;
  removeCart=false;
  cartData:product|undefined;
  constructor(private activeRoute:ActivatedRoute, private product:ProductService) { }

  ngOnInit(): void {
    let productId= this.activeRoute.snapshot.paramMap.get('productId');
    console.warn(productId);
    productId && this.product.getProduct(productId).subscribe((result)=>{
      this.productData= result;
      let cartData= localStorage.getItem('localCart');
      if(productId && cartData){
        console.warn(productId);
        let items = JSON.parse(cartData);
        items = items.filter((item:product)=>productId=== item.id.toString());
        this.removeCart = !!items.length; //
      }

      let user = localStorage.getItem('user');
      if(user){
        let userId= user && JSON.parse(user).id;
        this.product.getCartList(userId);

        this.product.cartData.subscribe((result)=>{
          let item = result.filter((item:product)=>productId?.toString()===item.product_id?.toString())
          if(item.length){
            this.cartData=item[0];
            this.removeCart=true;
          }
        })
      }
    })

  }
  handleQuantity(val:string){
    if(this.productQuantity<20 && val==='plus'){
      this.productQuantity+=1;
    }else if(this.productQuantity>1 && val==='min'){
      this.productQuantity-=1;
    }
  }

  addToCart(){
    if(this.productData){
      this.productData.quantity = this.productQuantity;
      if(!localStorage.getItem('user')){
        this.product.localAddToCart(this.productData);
        this.removeCart=true
      }else{
        let user= localStorage.getItem('user');
        let user_id = user && JSON.parse(user);
        let cartData:cart={
          ...this.productData,
          product_id: JSON.parse('{"id": '+this.productData.id+'}'), user_id: user_id
        }
       delete cartData.id;
        this.product.addToCart(cartData).subscribe((result)=>{
          if(result){
            this.product.getCartList(user_id.id);
            this.removeCart=true
          }
        })
      }
    }
  }
  removeToCart(productId:number){
    if(!localStorage.getItem('user')){
      this.product.removeItemFromCart(productId)
    }else{
      console.warn("cartData", this.cartData);

      this.cartData && this.product.removeToCart(this.cartData.id)
        .subscribe((result)=>{
          let user = localStorage.getItem('user');
          let userId= user && JSON.parse(user).id;
          this.product.getCartList(userId)
        })
    }
    this.removeCart=false
  }
}
