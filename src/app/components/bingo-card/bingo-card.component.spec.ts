import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BingoCardComponent } from './bingo-card.component';
import { CardColumnComponent } from '../card-column/card-column.component';
import { CardBlockComponent } from '../card-block/card-block.component';

describe('BingoCardComponent', () => {
  let component: BingoCardComponent;
  let fixture: ComponentFixture<BingoCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BingoCardComponent, CardColumnComponent, CardBlockComponent],
    });
    fixture = TestBed.createComponent(BingoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
