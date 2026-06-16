import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardColumnComponent } from './card-column.component';
import { CardBlockComponent } from '../card-block/card-block.component';
import { mockCardSquare } from '../../testing/card-square.mock';

describe('CardColumnComponent', () => {
  let component: CardColumnComponent;
  let fixture: ComponentFixture<CardColumnComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardColumnComponent, CardBlockComponent],
    });
    fixture = TestBed.createComponent(CardColumnComponent);
    component = fixture.componentInstance;
    component.category = 'B';
    component.squares = [mockCardSquare];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
