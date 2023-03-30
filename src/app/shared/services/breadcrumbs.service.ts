import { Injectable } from '@angular/core';

const BREADCRUMB_ABSOLUTE_ROUTES = {
  Início: ['/'],
  Estratégias: ['/strategies'],
  'Criar Estratégia': ['/strategies/create'],
  'Painel de Controle': ['/'],
  'Gerenciamento de Risco': ['/risk-management'],
};

@Injectable({ providedIn: 'root' })
export class BreadcrumbsService {
  current: string[];

  update(route: string) {
    const routes = route.split('>').map((routePart) => routePart.trim());

    this.current = routes;
  }

  getAbsoluteRoute(route: string) {
    return BREADCRUMB_ABSOLUTE_ROUTES[
      route as keyof typeof BREADCRUMB_ABSOLUTE_ROUTES
    ];
  }
}
