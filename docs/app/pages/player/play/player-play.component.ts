import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CardSquare } from '../../../models/card.models';
import { GamePack } from '../../../models/game-pack.models';
import { GamePackService } from '../../../services/game-pack.service';
import { PlayerCardService } from '../../../services/player-card.service';

@Component({
  selector: 'app-player-play',
  templateUrl: './player-play.component.html',
  styleUrls: ['./player-play.component.scss'],
})
export class PlayerPlayComponent implements OnInit {
  pack: GamePack | null = null;
  card: CardSquare[] = [];

  constructor(
    private readonly gamePackService: GamePackService,
    private readonly playerCardService: PlayerCardService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.pack = this.gamePackService.getPack();
    if (!this.pack) {
      return;
    }
    this.gamePackService.applyPlayerBackground(this.pack.backgroundImageUrl);

    if (this.gamePackService.consumeLoadedFromUrl()) {
      this.card = this.playerCardService.resetCard(this.pack);
    } else {
      this.card = this.playerCardService.getCard(this.pack);
    }
  }

  onCardChange(card: CardSquare[]): void {
    if (!this.pack) {
      return;
    }
    this.card = card;
    this.playerCardService.saveCard(this.pack.id, card);
  }

  newCard(): void {
    if (!this.pack) {
      return;
    }
    this.card = this.playerCardService.resetCard(this.pack);
  }

  goToAdmin(): void {
    this.router.navigate(['/admin/setup']);
  }
}
