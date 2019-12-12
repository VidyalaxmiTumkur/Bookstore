import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Book } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  // books = [
  //   {title: 'bbhb', author: 'jhvjh', genre: 'khjyufyu', description: 'bibiugi'},
  //   {title: 'bkjbkj', author: 'nbnb', genre: 'nkjbjb', description: 'uhiuyu'},
  //   {title: 'rtrty', author: 'seser', genre: 'trtyt', description: 'esers'}
  // ];

  books: Book[] = [];
  private postsSubsc: Subscription;

  constructor(public postsService: PostsService) {}

  ngOnInit() {
    this.postsService.getPosts();
    this.postsService.getPostUpdateListener()
    .subscribe((books: Book[]) => {
      this.books = books;
    });
  }

  ngOnDestroy() {
    // this.postsSubsc.unsubscribe();
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

}
