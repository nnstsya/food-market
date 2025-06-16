import { Component, InputSignal, input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from "@auth/models/user.model";
import { Blog } from "@core/models/blog.model";
import { Comment } from "@core/models/comment.model";

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent {
  item: InputSignal<Blog> = input.required<Blog>();
  user: User | null = JSON.parse(localStorage.getItem('user') || 'null');
  isAuthorized: boolean = this.user !== null;
  commentForm: FormGroup<{ body: FormControl<string | null> }>;

  constructor(private fb: FormBuilder) {
    this.commentForm = this.fb.group({
      body: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  onSubmit(): void {
    if (this.commentForm.invalid) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      author: this.user?.firstName + ' ' + this.user?.lastName,
      date: new Date().toLocaleDateString(),
      body: this.commentForm.value.body!
    };

    this.item().comments.push(newComment);

    this.commentForm.reset();
  }
}
