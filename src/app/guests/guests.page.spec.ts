import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestsPage } from './guests.page';

describe('GuestsPage', () => {
  let component: GuestsPage;
  let fixture: ComponentFixture<GuestsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuestsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
