import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BannerComponent } from './banner.component';
import { NgOptimizedImage } from '@angular/common';

describe('BannerComponent', () => {
  let component: BannerComponent;
  let fixture: ComponentFixture<BannerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BannerComponent],
      imports: [NgOptimizedImage]
    }).compileComponents();

    fixture = TestBed.createComponent(BannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return correct background style when imageUrl is set', () => {
    fixture.componentRef.setInput('imageUrl', 'https://example.com/image.jpg');
    fixture.componentRef.setInput('gradientPosition', 'top');
    fixture.detectChanges();
    expect(component.backgroundStyle).toContain('linear-gradient(to bottom');

    fixture.componentRef.setInput('gradientPosition', 'bottom');
    fixture.detectChanges();
    expect(component.backgroundStyle).toContain('linear-gradient(to top');

    fixture.componentRef.setInput('gradientPosition', 'none');
    fixture.detectChanges();
    expect(component.backgroundStyle).toEqual(`url(${component.imageUrl()}) no-repeat`);
    expect(component.backgroundStyle).toContain('https://example.com/image.jpg');
  });

  it('should return correct background style when no imageUrl is set', () => {
    fixture.componentRef.setInput('imageUrl', '');
    fixture.componentRef.setInput('gradientPosition', 'top');
    fixture.detectChanges();
    expect(component.backgroundStyle).toContain('linear-gradient(to bottom');

    fixture.componentRef.setInput('gradientPosition', 'bottom');
    fixture.detectChanges();
    expect(component.backgroundStyle).toContain('linear-gradient(to top');
    expect(component.backgroundStyle).toContain('assets/background-placeholder.svg');
  });

  it('should return correct text color based on gradient position', () => {
    fixture.componentRef.setInput('gradientPosition', 'none');
    fixture.detectChanges();
    expect(component.textColor).toBe('#000');

    fixture.componentRef.setInput('gradientPosition', 'top');
    fixture.detectChanges();
    expect(component.textColor).toBe('#fff');
  });
});
