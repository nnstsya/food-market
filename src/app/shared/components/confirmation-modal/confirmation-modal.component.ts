import {
  Component,
  inject,
  OutputEmitterRef,
  output
} from '@angular/core';
import { ModalService } from '@shared/components/modal/modal.service';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrl: '../modal/modal.component.scss',
  standalone: false
})
export class ConfirmationModalComponent {
  confirm: OutputEmitterRef<boolean> = output();

  private modalService = inject(ModalService);

  onConfirm(): void {
    this.confirm.emit(true);
    this.modalService.hideModal();
  }

  onCancel(): void {
    this.confirm.emit(false);
    this.modalService.hideModal();
  }
}
