import {HttpClient, HttpHeaders} from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { cart, order, product } from '../data-type';

@Injectable({
  providedIn: 'root',
})


export class ProductService {
  cartData = new EventEmitter<product[] | []>();

  constructor(private http: HttpClient) {
  }

  addProduct(data: product) {
    return this.http.post('http://localhost:8080/products', data);
  }

  productList() {
    return this.http.get<product[]>('http://localhost:8080/products');
  }

  deleteProduct(id: number) {
    return this.http.delete(`http://localhost:8080/products/${id}`);
  }

  getProduct(id: string) {
    return this.http.get<product>(`http://localhost:8080/products/${id}`);
  }

  updateProduct(product: product) {
    return this.http.put<product>(
      `http://localhost:8080/products/${product.id}`,
      product
    );
  }

  popularProducts() {
    return this.http.get<product[]>('http://localhost:8080/products?_limit=3');
  }

  trendyProducts() {
    return this.http.get<product[]>('http://localhost:8080/products?_limit=8');
  }

  searchProduct(query: string) {
    return this.http.get<product[]>(
      `http://localhost:8080/products?q=${query}`
    );
  }

  localAddToCart(data: product) {
    let cartData = [];
    let localCart = localStorage.getItem('localCart');
    if (!localCart) {
      localStorage.setItem('localCart', JSON.stringify([data]));
      this.cartData.emit([data]);
    } else {
      cartData = JSON.parse(localCart);
      cartData.push(data);
      localStorage.setItem('localCart', JSON.stringify(cartData));
      this.cartData.emit(cartData);
    }
  }

  removeItemFromCart(product_id: number) {
    let cartData = localStorage.getItem('localCart');
    if (cartData) {
      let items: product[] = JSON.parse(cartData);
      items = items.filter((item: product) => product_id !== item.id);
      localStorage.setItem('localCart', JSON.stringify(items));
      this.cartData.emit(items);
    }
  }

  addToCart(cartData: cart) {
    return this.http.post('http://localhost:8080/cart', cartData);
  }

  getCartList(user_id: number) {
    return this.http
      .get<product[]>('http://localhost:8080/cart?user_id=' + user_id, {
        observe: 'response',
      })
      .subscribe((result) => {
        if (result && result.body) {
          this.cartData.emit(result.body);
        }
      });
  }

  removeToCart(cartId: number) {
    return this.http.delete('http://localhost:8080/cart/' + cartId);
  }

  currentCart() {
    let userStore = localStorage.getItem('user');
    let userData = userStore && JSON.parse(userStore);
    return this.http.get<cart[]>('http://localhost:8080/cart?user_id=' + userData.id);
  }

  orderNow(data: order) {
    return this.http.post('http://localhost:8080/orders', data);
  }

  orderList() {
    let userStore = localStorage.getItem('user');
    let userData = userStore && JSON.parse(userStore);
    return this.http.get<order[]>('http://localhost:8080/orders?user_id=' + userData.id);
  }

  deleteCartItems(cartId: number) {
    return this.http.delete('http://localhost:8080/cart/' + cartId).subscribe((result) => {
      this.cartData.emit([]);
    })
  }

  cancelOrder(orderId: number) {
    return this.http.delete('http://localhost:8080/orders/' + orderId)

  }
}
