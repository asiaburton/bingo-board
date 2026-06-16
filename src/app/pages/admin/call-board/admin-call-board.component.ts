import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CallableItemDefinition } from '../../../models/game-pack.models';
import { CallStateService } from '../../../services/call-state.service';
import { GamePackService } from '../../../services/game-pack.service';
import { buildCallableItemGroups } from '../../../utils/callable-items';

@Component({
  selector: 'app-admin-call-board',
  templateUrl: './admin-call-board.component.html',
  styleUrls: ['./admin-call-board.component.scss'],
})
export class AdminCallBoardComponent implements OnInit, OnDestroy {
  gameName = '';
  itemGroups: ReturnType<typeof buildCallableItemGroups> = [];
  calledIds = new Set<string>();
  lastCalledId: string | null = null;
  noPack = false;
  private sub?: Subscription;

  constructor(
    private readonly gamePackService: GamePackService,
    private readonly callStateService: CallStateService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    const pack = this.gamePackService.getPack();
    if (!pack) {
      this.noPack = true;
      return;
    }

    this.gameName = pack.name;
    this.gamePackService.applyPlayerBackground(pack.backgroundImageUrl);
    this.callStateService.init(pack.id);
    this.itemGroups = buildCallableItemGroups(pack.mode, pack.squares);

    this.sub = this.callStateService.state$.subscribe(state => {
      this.calledIds = new Set(state.calledIds);
      this.lastCalledId = state.lastCalledId;
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  onItemClick(item: CallableItemDefinition): void {
    this.callStateService.toggleItem(item.id);
  }

  clearBoard(): void {
    this.callStateService.clear();
  }

  goToSetup(): void {
    this.router.navigate(['/admin/setup']);
  }
}
