import { Routes } from '@angular/router';
import { HomePageComponent } from './games/pages/home-page/home-page.component';
import { GamePageComponent } from './games/pages/game-page/game-page.component';
import { BrowsePageComponent } from './games/pages/browse-page/browse-page.component';

export const routes: Routes = [
  {
    path: 'home',
    component: HomePageComponent,
  },
  {
    path: 'browse',
    children: [
      {
        path: ':id',
        component: GamePageComponent,
      },
      {
        path: '',
        component: BrowsePageComponent,
      },
    ],
  },
  //   {
  //     path: 'cart',
  //     // TODO:
  //   },
  //   {
  //     path: 'wishlist',
  //   },
  //   {
  //     path: 'profile',
  //   },
  //   {
  //     path: 'login',
  //   },
  //   {
  //     path: 'register',
  //   },
  //   {
  //     path: 'checkout',
  //   },
  //   {
  //     path: 'administrate',
  //   },
  {
    path: '**',
    redirectTo: 'home',
  },
];
