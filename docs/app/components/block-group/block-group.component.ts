import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BlockCategory } from '../../models/block-category';
import { CallableItemDefinition } from '../../models/game-pack.models';

@Component({
  selector: 'app-block-group',
  templateUrl: './block-group.component.html',
  styleUrls: ['./block-group.component.scss'],
})
export class BlockGroupComponent {
  @Input() category?: BlockCategory;
  @Input() items: CallableItemDefinition[] = [];
  @Input() calledIds = new Set<string>();
  @Input() lastCalledId: string | null = null;
  @Input() horizontal = false;
  @Output() itemToggle = new EventEmitter<CallableItemDefinition>();

  onItemClick(item: CallableItemDefinition): void {
    this.itemToggle.emit(item);
  }

  isCalled(itemId: string): boolean {
    return this.calledIds.has(itemId);
  }

  isLastCalled(itemId: string): boolean {
    return this.lastCalledId === itemId;
  }
}
