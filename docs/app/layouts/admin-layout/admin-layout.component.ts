import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { GamePackService } from '../../services/game-pack.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
  host: {
    '[class.c-admin-layout--call-board]': 'isCallBoard',
  },
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  isCallBoard = false;
  private routerSub?: Subscription;

  constructor(
    private readonly gamePackService: GamePackService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.checkRoute(this.router.url);
    this.routerSub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => this.checkRoute(e.urlAfterRedirects));
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  private checkRoute(url: string): void {
    this.isCallBoard = url.startsWith('/admin/call');
    if (!this.isCallBoard) {
      this.gamePackService.applyAdminBackground();
    }
  }
}
