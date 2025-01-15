import { Component, inject} from '@angular/core';
import { Observable } from "rxjs";
import { ModalService } from "@shared/components/modal/modal.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  modalOpened$: Observable<boolean>;
  modalType$: Observable<string>;

  private modalService: ModalService = inject(ModalService);

  constructor() {
    this.modalType$ = this.modalService.modalType$;
    this.modalOpened$ = this.modalService.modalVisible$;
  }
}
