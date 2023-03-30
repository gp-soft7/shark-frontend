import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserApiService } from '../../services/user-api/user-api.service';
import { MyAccountComponent } from './my-account.component';
import { By } from '@angular/platform-browser';

describe('MyAccountComponent', () => {
  let component: MyAccountComponent;
  let fixture: ComponentFixture<MyAccountComponent>;
  let userApiService: UserApiService;

  beforeEach(() => {
    const testBed = TestBed.configureTestingModule({
      declarations: [MyAccountComponent],
      imports: [HttpClientTestingModule],
    });

    userApiService = testBed.inject<UserApiService>(UserApiService);

    testBed.compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAccountComponent);
    component = fixture.componentInstance;
  });

  it('should fetch user and subscription information and render', async () => {
    const userData = {
      birthDate: '1999-01-01',
      cellphone: '(11) 9999-9999',
      cpf: '111.111.111-11',
      createdAt: '2000-01-01T00:00:00',
      email: 'email@email.com',
      firstName: 'First',
      id: 'id',
      lastLoginAt: '2000-01-01T00:00:00',
      lastName: 'Last',
    };

    const subscriptionData = {
      createdAt: new Date(),
      status: 'ACTIVE',
      updatedAt: new Date('2000-01-01T00:00:00'),
    };

    spyOn(userApiService, 'getUserProfile').and.returnValue(
      Promise.resolve(userData)
    );

    spyOn(userApiService, 'getUserSubscription').and.returnValue(
      Promise.resolve(subscriptionData)
    );

    await component.ngOnInit();

    fixture.detectChanges();

    const userDataElement = fixture.debugElement.query(
      By.css('.data-item-list:first-of-type')
    );

    const subscriptionDataElement = fixture.debugElement.query(
      By.css('.data-item-list:nth-of-type(2)')
    );

    function getUserDataItem(child: number) {
      return userDataElement.query(
        By.css(`.data-item:nth-child(${child}) > span:nth-child(2)`)
      ).nativeElement.textContent;
    }

    function getSubscriptionDataItem(child: number) {
      return subscriptionDataElement.query(
        By.css(`.data-item:nth-child(${child}) > span:nth-child(2)`)
      ).nativeElement.textContent;
    }

    expect(getUserDataItem(1)).toBe(
      `${userData.firstName} ${userData.lastName}`
    );
    expect(getUserDataItem(2)).toBe(userData.email);
    expect(getUserDataItem(3)).toBe(userData.cpf);
    expect(getUserDataItem(4)).toBe(userData.cellphone);
    expect(getUserDataItem(5)).toBe('01/01/2000 00:00');

    expect(getSubscriptionDataItem(1)).toBe('Ativa');
    expect(getSubscriptionDataItem(2)).toBe('01/01/2000 00:00');
  });
});
