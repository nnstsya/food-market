import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Toast {
  message: string;
  type: 'error' | 'success';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toast: BehaviorSubject<Toast | null> = new BehaviorSubject<Toast | null>(null);
  toast$: Observable<Toast | null> = this.toast.asObservable();

  show(message: string, type: Toast['type'] = 'error'): void {
    this.toast.next({ message, type });

    setTimeout(() => {
      this.hide();
    }, 3000);
  }

  private hide(): void {
    this.toast.next(null);
  }
}
