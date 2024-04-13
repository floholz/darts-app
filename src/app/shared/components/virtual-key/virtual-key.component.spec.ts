import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualKeyComponent } from './virtual-key.component';

describe('VirtualKeyComponent', () => {
  let component: VirtualKeyComponent;
  let fixture: ComponentFixture<VirtualKeyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VirtualKeyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VirtualKeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
