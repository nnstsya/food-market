import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TagComponent } from './tag.component';

describe('TagComponent', () => {
  let component: TagComponent;
  let fixture: ComponentFixture<TagComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TagComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TagComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('text', 'Tag A');
    fixture.componentRef.setInput('removable', true);
    fixture.componentRef.setInput('color', 'green');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit tagRemoved and hide tag when removed', () => {
    const spy: jest.SpyInstance = jest.spyOn(component.tagRemoved, 'emit');

    component.remove();

    expect(spy).toHaveBeenCalled();
    expect(component.visible).toBe(false);
  });
});
