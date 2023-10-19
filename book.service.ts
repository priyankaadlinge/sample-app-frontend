import { Injectable } from '@angular/core';
import { Book } from '../models/Book';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  // Node/Express API
  REST_API: string = 'http://localhost:8000/api';

  // Http Header
  httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private httpClient: HttpClient) { }
  // Add
  addBook(data: Book): Observable<any> {
    data._id = Math.random().toString(36).substr(2, 9);
    const books = localStorage.getItem('books') || '[]';
    const bookList = JSON.parse(books);
    bookList.push(data);
    localStorage.setItem('books', JSON.stringify(bookList));
    return new Observable((subscriber) => {
      subscriber.next(data);
      subscriber.complete();
    });

    // let API_URL = `${this.REST_API}/add-book`;
    // return this.httpClient
    //   .post(API_URL, data)
    //   .pipe(catchError(this.handleError));
  }

  // Get all objects
  getBooks() {
    const books = localStorage.getItem('books') || '[]';
    const bookList = JSON.parse(books);
    return new Observable((subscriber) => {
      subscriber.next(bookList);
      subscriber.complete();
    });
    // return this.httpClient.get(`${this.REST_API}`);
  }

  // Get single object
  getBook(id: any): Observable<any> {
    const books = localStorage.getItem('books') || '[]';
    const bookList = JSON.parse(books);
    const book = bookList.find((book: Book) => book._id === id);
    return new Observable((subscriber) => {
      subscriber.next(book);
      subscriber.complete();
    });

    // let API_URL = `${this.REST_API}/read-book/${id}`;
    // return this.httpClient.get(API_URL, { headers: this.httpHeaders }).pipe(
    //   map((res: any) => {
    //     return res || {};
    //   }),
    //   catchError(this.handleError)
    // );
  }

  // Update
  updateBook(id: any, data: any): Observable<any> {
    const books = localStorage.getItem('books') || '[]';
    const bookList = JSON.parse(books);
    let book = bookList.find((book: Book) => book._id === id);
    book = { ...book, ...data };
    return new Observable((subscriber) => {
      subscriber.next(book);
      subscriber.complete();
    });

    // let API_URL = `${this.REST_API}/update-book/${id}`;
    // return this.httpClient
    //   .put(API_URL, data, { headers: this.httpHeaders })
    //   .pipe(catchError(this.handleError));
  }

  // Delete
  deleteBook(id: any): Observable<any> {
    const books = localStorage.getItem('books') || '[]';
    const bookList = JSON.parse(books);
    const book = bookList.find((book: Book) => book._id === id);
    let filteredBooks = bookList.filter((book: Book) => book._id !== id);
    localStorage.setItem('books', JSON.stringify(filteredBooks));

    return new Observable((subscriber) => {
      subscriber.next(book);
      subscriber.complete();
    });

    // let API_URL = `${this.REST_API}/delete-book/${id}`;
    // return this.httpClient
    //   .delete(API_URL, { headers: this.httpHeaders })
    //   .pipe(catchError(this.handleError));
  }

  // Error
  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Handle client error
      errorMessage = error.error.message;
    } else {
      // Handle server error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => {
      return errorMessage;
    });
  }
}
