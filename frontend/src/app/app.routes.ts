import { Routes } from '@angular/router';
import { HomePageComponent } from './games/pages/home-page/home-page.component';
import { GamePageComponent } from './games/pages/game-page/game-page.component';
import { BrowsePageComponent } from './games/pages/browse-page/browse-page.component';
import { WishlistPageComponent } from './games/pages/wishlist-page/wishlist-page.component';
import { ProfilePageComponent } from './user/pages/profile-page/profile-page.component';
import { ProfileSettingsPageComponent } from './user/pages/profile-settings-page/profile-settings-page.component';
import { AdminPageComponent } from './admin/pages/admin-page/admin-page.component';
import { DashboardComponent } from './admin/components/dashboard/dashboard.component';
import { UsersComponent } from './admin/components/users/users.component';
import { GamesComponent } from './admin/components/games/games.component';
import { OrdersComponent } from './admin/components/orders/orders.component';

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
    children: [
      {
        path: 'settings',
        component: ProfileSettingsPageComponent,
      },
      {
        path: '',
        component: ProfilePageComponent,
      },
    ],
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
  {
    path: 'administration',
    component: AdminPageComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'games',
        component: GamesComponent,
      },
      {
        path: 'users',
        component: UsersComponent,
      },
      {
        path: 'orders',
        component: OrdersComponent,
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
  // {
  //   path: '**',
  //   redirectTo: 'home',
  // },
];
