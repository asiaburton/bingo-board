import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  CallableItemDefinition,
  CallableItemGroup,
} from '../../models/game-pack.models';

@Component({
  selector: 'app-bingo-board',
  templateUrl: './bingo-board.component.html',
  styleUrls: ['./bingo-board.component.scss'],
})
export class BingoBoardComponent {
  @Input() itemGroups: CallableItemGroup[] = [];
  @Input() calledIds = new Set<string>();
  @Input() lastCalledId: string | null = null;
  /** Vertical columns (player-style) or horizontal rows per letter (caller board). */
  @Input() layout: 'vertical' | 'horizontal' = 'vertical';
  @Output() itemToggle = new EventEmitter<CallableItemDefinition>();
  @Output() clearBoard = new EventEmitter<void>();

  onItemClick(item: CallableItemDefinition): void {
    this.itemToggle.emit(item);
  }

  onClearBoardClick(): void {
    this.clearBoard.emit();
  }
}
