import { Component, OnInit } from '@angular/core';

import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Book } from '../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  titleEntry = '';
  authorEntry = '';
  genreEntry = '';
  descriptionEntry = '';
  private mode = 'create';
  private postId: string;
  book: Book;

  constructor(public postsService: PostsService, public route: ActivatedRoute) {}

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.book = {id: postData._id, title: postData.title, author: postData.author, genre: postData.genre, description: postData.description};
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    if (this.mode === 'create') {
      this.postsService.addPost(form.value.title, form.value.author, form.value.genre, form.value.description);
    } else {
      this.postsService.updatePost(this.postId, form.value.title, form.value.author, form.value.genre, form.value.description);
    }
    form.resetForm();
  }
}
