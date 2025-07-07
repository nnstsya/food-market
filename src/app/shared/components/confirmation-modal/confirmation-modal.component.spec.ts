import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationModalComponent } from './confirmation-modal.component';
import { ModalService } from '@shared/components/modal/modal.service';
import { SharedModule } from "@shared/shared.module";

describe('ConfirmationModalComponent', () => {
  let component: ConfirmationModalComponent;
  let fixture: ComponentFixture<ConfirmationModalComponent>;
  let modalService: jest.Mocked<ModalService>;

  beforeEach(async () => {
    modalService = {
      hideModal: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      declarations: [ConfirmationModalComponent],
      imports: [SharedModule],
      providers: [
        { provide: ModalService, useValue: modalService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onConfirm', () => {
    it('should emit true and hide modal', () => {
      const emitSpy = jest.spyOn(component.confirm, 'emit');

      component.onConfirm();

      expect(emitSpy).toHaveBeenCalledWith(true);
      expect(modalService.hideModal).toHaveBeenCalled();
    });
  });

  describe('onCancel', () => {
    it('should emit false and hide modal', () => {
      const emitSpy = jest.spyOn(component.confirm, 'emit');

      component.onCancel();

      expect(emitSpy).toHaveBeenCalledWith(false);
      expect(modalService.hideModal).toHaveBeenCalled();
    });
  });
});
