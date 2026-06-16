import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardBlockComponent } from './card-block.component';
import { mockCardSquare } from '../../testing/card-square.mock';

describe('CardBlockComponent', () => {
  let component: CardBlockComponent;
  let fixture: ComponentFixture<CardBlockComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardBlockComponent],
    });
    fixture = TestBed.createComponent(CardBlockComponent);
    component = fixture.componentInstance;
    component.square = mockCardSquare;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
