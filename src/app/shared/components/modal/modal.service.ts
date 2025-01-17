import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  modalVisible$: Observable<boolean>;
  modalType$: Observable<string>;
  private modalVisible: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private modalType: BehaviorSubject<string> = new BehaviorSubject<string>('login');

  constructor() {
    this.modalVisible$ = this.modalVisible.asObservable();
    this.modalType$ = this.modalType.asObservable();
  }

  showModal(type: string): void {
    this.hideModal();

    this.modalType.next(type);

    this.modalVisible.next(true);
  }

  hideModal(): void {
    this.modalVisible.next(false);
  }
}
