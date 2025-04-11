import { Component, inject } from '@angular/core';
import { ModalService } from "@shared/components/modal/modal.service";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  standalone: false
})
export class ModalComponent {
  private modalService: ModalService = inject(ModalService);

  closeModal(): void {
    this.modalService.hideModal();
  }
}
