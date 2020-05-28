import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CobwebComponent } from './cobweb.component';

describe('CobwebComponent', () => {
  let component: CobwebComponent;
  let fixture: ComponentFixture<CobwebComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CobwebComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CobwebComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
