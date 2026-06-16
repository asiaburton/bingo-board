import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AdminSetupComponent } from './pages/admin/setup/admin-setup.component';
import { AdminCallBoardComponent } from './pages/admin/call-board/admin-call-board.component';
import { PlayerPlayComponent } from './pages/player/play/player-play.component';

const routes: Routes = [
  { path: '', redirectTo: '/play', pathMatch: 'full' },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'setup', pathMatch: 'full' },
      { path: 'setup', component: AdminSetupComponent },
      { path: 'call', component: AdminCallBoardComponent },
    ],
  },
  { path: 'play', component: PlayerPlayComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
