import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CallableItemDefinition } from '../../models/game-pack.models';

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss'],
})
export class BlockComponent {
  @Input() item?: CallableItemDefinition;
  @Input() isCalled = false;
  @Input() isLastCalled = false;
  @Output() itemClick = new EventEmitter<CallableItemDefinition>();

  onBlockClick(): void {
    if (this.item) {
      this.itemClick.emit(this.item);
    }
  }
}
