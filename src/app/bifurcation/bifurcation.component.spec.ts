import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BifurcationComponent } from './bifurcation.component';

describe('BifurcationComponent', () => {
  let component: BifurcationComponent;
  let fixture: ComponentFixture<BifurcationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BifurcationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BifurcationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
