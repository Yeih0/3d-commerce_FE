import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Adesivi } from './adesivi';

describe('Adesivi', () => {
  let component: Adesivi;
  let fixture: ComponentFixture<Adesivi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Adesivi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Adesivi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
