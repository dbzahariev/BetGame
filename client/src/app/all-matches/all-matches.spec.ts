import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllMatches } from './all-matches';

describe('AllMatches', () => {
  let component: AllMatches;
  let fixture: ComponentFixture<AllMatches>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllMatches]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllMatches);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
