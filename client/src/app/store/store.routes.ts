import {Routes} from "@angular/router";
import {StoreComponent} from "./store.component";
import {BookDetailsComponent} from "./book-details/book-details.component";

export const STORE_ROUTES: Routes = [
  { path: '', component: StoreComponent},
  { path: ':id', component: BookDetailsComponent}
];
