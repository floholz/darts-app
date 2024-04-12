import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewGamePageComponent } from './new-game-page.component';

describe('NewGamePageComponent', () => {
  let component: NewGamePageComponent;
  let fixture: ComponentFixture<NewGamePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewGamePageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewGamePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
