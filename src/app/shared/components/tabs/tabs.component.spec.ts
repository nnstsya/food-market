import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabsComponent } from './tabs.component';
import { SharedModule } from "@shared/shared.module";

describe('TabsComponent', () => {
  let component: TabsComponent;
  let fixture: ComponentFixture<TabsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [TabsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TabsComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('tabTitles', ['Tab 1', 'Tab 2']);
    fixture.componentRef.setInput('tabTags', [1, null]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set activeTab correctly', () => {
    component.selectTab(1);
    expect(component.activeTab).toBe(1);

    component.selectTab(0);
    expect(component.activeTab).toBe(0);
  });
});
