import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelliStampa } from './modelli-stampa';

describe('ModelliStampa', () => {
  let component: ModelliStampa;
  let fixture: ComponentFixture<ModelliStampa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModelliStampa]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelliStampa);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
