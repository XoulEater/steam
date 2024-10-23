import { Routes } from '@angular/router';
import { HomePageComponent } from './games/pages/home-page/home-page.component';

export const routes: Routes = [
  {
    path: 'home',
    component: HomePageComponent,
  },
  //   {
  //     path: 'browse',
  //     // TODO:
  //   },
  //   {
  //     path: 'game/:id',
  //     // TODO:
  //   },
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
