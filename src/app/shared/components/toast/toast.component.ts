import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { Toast, ToastService } from "@shared/components/toast/toast.service";

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
  standalone: false
})
export class ToastComponent implements OnInit {
  private toastService: ToastService = inject(ToastService);
  toast: WritableSignal<Toast | null> = signal<Toast | null>(null);
  visible: WritableSignal<boolean> = signal(false);

  ngOnInit() {
    this.toastService.toast$.subscribe(toast => {
      this.toast.set(toast);
      this.visible.set(!!toast);
    });
  }
}
