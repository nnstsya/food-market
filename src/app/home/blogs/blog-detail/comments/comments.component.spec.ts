import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommentsComponent } from './comments.component';
import { User } from '@auth/models/user.model';
import { blogData } from '@core/mocks/blogs';
import { InputComponent } from '@shared/components/input/input.component';
import { ButtonComponent } from '@shared/components/button/button.component';

describe('CommentsComponent', () => {
  let component: CommentsComponent;
  let fixture: ComponentFixture<CommentsComponent>;
  let mockUser: User;

  beforeEach(async () => {
    mockUser = {
      email: "john.doe@example.com",
      firstName: "John",
      id: "abc123",
      lastName: "Doe",
      newsletterConsent: true,
      phoneNumber: "+1234567890",
      role: "user",
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
      username: "johndoe123"
    };

    await TestBed.configureTestingModule({
      declarations: [CommentsComponent, InputComponent, ButtonComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1'
              }
            }
          }
        }
      ]
    }).compileComponents();

    localStorage.setItem('user', JSON.stringify(mockUser));
    fixture = TestBed.createComponent(CommentsComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('item', blogData[0]);
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with user data from localStorage', () => {
    expect(component.isAuthorized).toBeTruthy();
    expect(component.user).toEqual(mockUser);
  });

  it('should have invalid form when empty', () => {
    expect(component.commentForm.valid).toBeFalsy();
  });

  it('should have valid form when comment body is provided', () => {
    component.commentForm.controls.body.setValue('Test comment');
    expect(component.commentForm.valid).toBeTruthy();
  });

  it('should be invalid when comment exceeds 500 characters', () => {
    const longComment = 'a'.repeat(501);
    component.commentForm.controls.body.setValue(longComment);
    expect(component.commentForm.valid).toBeFalsy();
  });

  it('should add new comment when form is submitted', () => {
    const commentText = 'Test comment';
    component.commentForm.controls.body.setValue(commentText);

    const initialCommentsLength = component.item().comments?.length || 0;
    component.onSubmit();

    expect(component.item().comments?.length).toBe(initialCommentsLength + 1);

    const lastComment = component.item().comments![component.item().comments!.length - 1];

    expect(lastComment.body).toBe(commentText);
    expect(lastComment.author).toBe('John Doe');
  });

  it('should not submit when form is invalid', () => {
    component.commentForm.controls.body.setValue('');
    const initialCommentsLength = component.item().comments?.length || 0;

    component.onSubmit();

    expect(component.item().comments?.length).toBe(initialCommentsLength);
  });

  it('should reset form after successful submission', () => {
    component.commentForm.controls.body.setValue('Test comment');
    component.onSubmit();

    expect(component.commentForm.value.body).toBeNull();
  });
});
