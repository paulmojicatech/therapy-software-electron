import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';

describe('AppComponent', () => {
  let fixture:ComponentFixture<AppComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
      ],
      imports: [
        AppModule
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
  }));
  it('should container the router-outlet', () => {
    const outlet = fixture.nativeElement.querySelectorAll('router-outlet');
    expect(outlet.length).toBe(1, 'router-outlet exists');
  });
});
