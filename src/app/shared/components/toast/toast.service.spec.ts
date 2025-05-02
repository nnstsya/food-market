import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ToastService } from './toast.service';
import { firstValueFrom } from 'rxjs';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToastService]
    });
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show toast message', async () => {
    service.show('Test message', 'error');
    const toast = await firstValueFrom(service.toast$);
    expect(toast).toEqual({ message: 'Test message', type: 'error' });
  });

  it('should hide toast after 3 seconds', fakeAsync(() => {
    service.show('Test message', 'error');
    tick(3000);
    service.toast$.subscribe(toast => {
      expect(toast).toBeNull();
    });
  }));

  it('should use default error type if not specified', async () => {
    service.show('Test message');
    const toast = await firstValueFrom(service.toast$);
    expect(toast).toEqual({ message: 'Test message', type: 'error' });
  });
});
