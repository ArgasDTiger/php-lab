import { v4 as uuidv4 } from 'uuid';
import {IGenre} from "./genre";
import {IAuthor} from "./author";

export interface IBasket {
  id: string;
  items: IBasketItem[];
}

export interface IBasketItem {
  id: number;
  isbn: string;
  title: string;
  imageUrl: string;
  quantity: number;
  price: number;
  publisher?: string;
  genres: IGenre[];
  authors: IAuthor[];
}

export class Basket implements IBasket {
  id = uuidv4();
  items: IBasketItem[] = [];
}

export interface IBasketTotals {
  shipping: number;
  subtotal: number;
  total: number;
}
