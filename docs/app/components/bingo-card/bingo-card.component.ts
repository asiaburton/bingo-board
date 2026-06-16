import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardSquare } from '../../models/card.models';
import { BLOCK_CATEGORIES } from '../../models/block-category';
import { groupSquaresByColumn } from '../../utils/card-generator';

@Component({
  selector: 'app-bingo-card',
  templateUrl: './bingo-card.component.html',
  styleUrls: ['./bingo-card.component.scss'],
})
export class BingoCardComponent {
  @Input() card: CardSquare[] = [];
  @Output() cardChange = new EventEmitter<CardSquare[]>();

  readonly categories = BLOCK_CATEGORIES;

  get columnGroups(): CardSquare[][] {
    return groupSquaresByColumn(this.card);
  }

  getColumnStartIndex(columnIndex: number): number {
    return columnIndex * 5;
  }

  onMarkChange(event: { index: number; marked: boolean }): void {
    const updated = this.card.map((square, i) =>
      i === event.index ? { ...square, marked: event.marked } : square
    );
    this.cardChange.emit(updated);
  }
}
