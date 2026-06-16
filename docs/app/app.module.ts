import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BlockComponent } from './components/block/block.component';
import { BlockGroupComponent } from './components/block-group/block-group.component';
import { BingoBoardComponent } from './components/bingo-board/bingo-board.component';
import { BingoCardComponent } from './components/bingo-card/bingo-card.component';
import { CardColumnComponent } from './components/card-column/card-column.component';
import { CardBlockComponent } from './components/card-block/card-block.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AdminSetupComponent } from './pages/admin/setup/admin-setup.component';
import { AdminCallBoardComponent } from './pages/admin/call-board/admin-call-board.component';
import { PlayerPlayComponent } from './pages/player/play/player-play.component';

@NgModule({
  declarations: [
    AppComponent,
    BlockComponent,
    BlockGroupComponent,
    BingoBoardComponent,
    BingoCardComponent,
    CardColumnComponent,
    CardBlockComponent,
    AdminLayoutComponent,
    AdminSetupComponent,
    AdminCallBoardComponent,
    PlayerPlayComponent,
  ],
  imports: [BrowserModule, FormsModule, AppRoutingModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
