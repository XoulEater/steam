import { Routes } from '@angular/router';
import { HomePageComponent } from './games/pages/home-page/home-page.component';
import { GamePageComponent } from './games/pages/game-page/game-page.component';
import { BrowsePageComponent } from './games/pages/browse-page/browse-page.component';
import { WishlistPageComponent } from './games/pages/wishlist-page/wishlist-page.component';
import { ProfilePageComponent } from './user/pages/profile-page/profile-page.component';

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
  {
    path: 'wishlist',
    component: WishlistPageComponent,
  },
  //   {
  //     path: 'cart',
  //     // TODO:
  //   },
  //   {
  //     path: 'wishlist',
  //   },
  {
    path: 'profile',
    component: ProfilePageComponent,
  },
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
