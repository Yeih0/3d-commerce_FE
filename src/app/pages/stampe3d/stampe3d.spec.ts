import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Stampe3d } from './stampe3d';

describe('Stampe3d', () => {
  let component: Stampe3d;
  let fixture: ComponentFixture<Stampe3d>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Stampe3d]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Stampe3d);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
