import { Component, OnInit } from '@angular/core';
import { GamePackService } from './services/game-pack.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private readonly gamePackService: GamePackService) {}

  ngOnInit(): void {
    this.gamePackService.loadFromUrlParam();
  }
}
