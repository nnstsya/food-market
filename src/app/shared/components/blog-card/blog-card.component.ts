import { Component, input, InputSignal } from '@angular/core';
import { Blog } from '@core/models/blog.model';

@Component({
  selector: 'app-blog-card',
  templateUrl: './blog-card.component.html',
  styleUrl: './blog-card.component.scss'
})
export class BlogCardComponent {
  blog: InputSignal<Blog> = input.required<Blog>();
  type: InputSignal<'vertical' | 'horizontal'> = input<'vertical' | 'horizontal'>('vertical');
}
