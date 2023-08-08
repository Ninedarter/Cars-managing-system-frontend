import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplotationCostsComponent } from './explotation-costs.component';

describe('ExplotationCostsComponent', () => {
  let component: ExplotationCostsComponent;
  let fixture: ComponentFixture<ExplotationCostsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExplotationCostsComponent]
    });
    fixture = TestBed.createComponent(ExplotationCostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
