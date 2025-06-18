import { ModalService } from './modal.service';

describe('ModalService', () => {
  let service: ModalService;

  beforeEach(() => {
    service = new ModalService();
  });

  it('should initially hide modal', (done) => {
    service.modalVisible$.subscribe((value) => {
      expect(value).toBe(false);
      done();
    });
  });

  it('should show modal with correct type', (done) => {
    service.showModal('register');

    service.modalVisible$.subscribe((visible) => {
      expect(visible).toBe(true);
    });

    service.modalType$.subscribe((type) => {
      expect(type).toBe('register');
      done();
    });
  });

  it('should hide modal', (done) => {
    service.showModal('any');
    service.hideModal();

    service.modalVisible$.subscribe((visible) => {
      expect(visible).toBe(false);
      done();
    });
  });
});
