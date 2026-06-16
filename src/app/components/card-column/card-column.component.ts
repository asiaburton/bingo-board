import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardSquare } from '../../models/card.models';
import { BlockCategory } from '../../models/block-category';

@Component({
  selector: 'app-card-column',
  templateUrl: './card-column.component.html',
  styleUrls: ['./card-column.component.scss'],
})
export class CardColumnComponent {
  @Input() category!: BlockCategory;
  @Input() squares: CardSquare[] = [];
  @Input() startIndex = 0;
  @Output() markChange = new EventEmitter<{ index: number; marked: boolean }>();

  onMarkChange(event: { index: number; marked: boolean }): void {
    this.markChange.emit(event);
  }
}
