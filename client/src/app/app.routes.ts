import { Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";

export const routes: Routes = [
  { path: '', component: HomeComponent},
  {
    path: 'store',
    loadChildren: () => import('./store/store.routes')
      .then(r => r.STORE_ROUTES)},
  {
    path: 'basket',
    loadChildren: () => import('./basket/basket.routes')
      .then(r => r.BASKET_ROUTES)
  }
];
