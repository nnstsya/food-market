import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DropdownComponent } from './dropdown.component';

describe('DropdownComponent', () => {
  let component: DropdownComponent;
  let fixture: ComponentFixture<DropdownComponent>;

  const mockOptions = [
    { id: 1, title: 'Option 1' },
    { id: 2, title: 'Option 2' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DropdownComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DropdownComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('options', mockOptions);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle dropdown', () => {
    expect(component.isDropdownOpen).toBeFalsy();

    component.toggleDropdown();
    expect(component.isDropdownOpen).toBeTruthy();

    component.toggleDropdown();
    expect(component.isDropdownOpen).toBeFalsy();
  });

  it('should select option and emit event', () => {
    const emitSpy = jest.spyOn(component.optionSelected, 'emit');
    const selectedOption = mockOptions[0];

    component.selectOption(selectedOption);

    expect(component.selectedOption).toBe(selectedOption.title);
    expect(component.isDropdownOpen).toBeFalsy();
    expect(emitSpy).toHaveBeenCalledWith(selectedOption);
  });

  it('should use default placeholder when not provided', () => {
    expect(component.placeholder()).toBe('Select an option');
  });

  it('should use custom placeholder when provided', () => {
    fixture.componentRef.setInput('placeholder', 'Custom placeholder');
    fixture.detectChanges();
    expect(component.placeholder()).toBe('Custom placeholder');
  });
});
