import { Book } from './post.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {  map } from 'rxjs/operators';




@Injectable({providedIn: 'root'})
export class PostsService {
  private books: Book[] = [];
  private postsUpdated = new Subject<Book[]>();

  constructor(private http: HttpClient) {}

  getPosts() {
    this.http
    .get<{message: string, books: any}>('http://localhost:3000/api/books')
    .pipe(map((postData) => {
      return postData.books.map(post => {
        return {
          title: post.title,
          author: post.author,
          genre: post.genre,
          description: post.description,
          id: post._id
        };
      });
    }))
    .subscribe((convertedPosts) => {
      this.books = convertedPosts;
      this.postsUpdated.next([...this.books]);
    });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{_id: string, title: string, author: string, genre: string, description: string}>
    ( 'http://localhost:3000/api/books/' + id );
  }

  addPost(title: string, author: string, genre: string, description: string) {
    const book: Book = { id: null, title: title, author: author, genre: genre, description: description};
    this.http
    .post<{message: string, postId: string }>('http://localhost:3000/api/books', book)
    .subscribe((responseData) => {
      // console.log(responseData.message);
      const id = responseData.postId;
      book.id = id;
      this.books.push(book);
      this.postsUpdated.next([...this.books]);
    });
  }

  updatePost(id: string, title: string, author: string, genre: string, description: string) {
    const book: Book = {id: id, title: title, author: author, genre: genre, description: description};
    this.http
    .put('http://localhost:3000/api/books/' + id, book)
    .subscribe(response => {
      const updatedPosts = [...this.books];
      const oldPostIndex = updatedPosts.findIndex(p => p.id === book.id);
      updatedPosts[oldPostIndex] = book;
      this.books = updatedPosts;
      this.postsUpdated.next([...this.books]);
    });
  }

  deletePost(postId: string) {
    this. http.delete('http://localhost:3000/api/books/' + postId)
    .subscribe(() => {
      // console.log('Deleted post');
      const updatedPosts = this.books.filter(post => post.id !== postId);
      this.books = updatedPosts;
      this.postsUpdated.next([...this.books]);
    });
  }
}
