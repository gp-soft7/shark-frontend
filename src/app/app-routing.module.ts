import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAuthGuard } from './core/guards/admin.auth-guard';
import { GuestAuthGuard } from './core/guards/guest.auth-guard';
import { UserAuthGuard } from './core/guards/user.auth-guard';
import { BlankLayoutComponent } from './shared/layouts/blank/blank.component';
import { HeaderBreadcrumbsLayoutComponent } from './shared/layouts/header-breadcrumbs/header-breadcrumbs.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'strategies',
        component: HeaderBreadcrumbsLayoutComponent,
        loadChildren: () =>
          import('./modules/strategy/strategy.module').then(
            (m) => m.StrategyModule
          ),
        canActivate: [UserAuthGuard],
      },
      {
        path: '',
        component: HeaderBreadcrumbsLayoutComponent,
        loadChildren: () =>
          import('./modules/operation/operation.module').then(
            (m) => m.OperationModule
          ),
        canActivate: [UserAuthGuard],
      },
      {
        path: '',
        component: BlankLayoutComponent,
        loadChildren: () =>
          import('./modules/guest/guest.module').then((m) => m.GuestModule),
        canActivate: [GuestAuthGuard],
      },
      {
        path: 'admin',
        component: HeaderBreadcrumbsLayoutComponent,
        loadChildren: () =>
          import('./modules/admin/admin.module').then((m) => m.AdminModule),
        canActivate: [AdminAuthGuard],
      },
      {
        path: 'user',
        component: HeaderBreadcrumbsLayoutComponent,
        loadChildren: () =>
          import('./modules/user/user.module').then((m) => m.UserModule),
        canActivate: [UserAuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
