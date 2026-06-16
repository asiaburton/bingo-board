import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardSquare } from '../../models/card.models';

@Component({
  selector: 'app-card-block',
  templateUrl: './card-block.component.html',
  styleUrls: ['./card-block.component.scss'],
})
export class CardBlockComponent {
  @Input() square!: CardSquare;
  @Input() index = 0;
  @Output() markChange = new EventEmitter<{ index: number; marked: boolean }>();

  get checkboxId(): string {
    return `${this.square.column}${this.square.label}-${this.index}`;
  }

  get displayText(): string {
    return this.square.isFree ? 'FREE' : this.square.label;
  }

  onCheckboxChange(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.markChange.emit({ index: this.index, marked: checked });
  }
}
