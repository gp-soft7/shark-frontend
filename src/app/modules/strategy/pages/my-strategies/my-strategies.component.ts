import { Component, OnInit } from '@angular/core';
import { BreadcrumbsService } from './../../../../shared/services/breadcrumbs.service';
import { StrategyApiService } from '../../services/strategy-api/strategy-api.service';
import { GetUserStrategiesResponse } from '../../services/strategy-api/strategy-api.service.types';
import { DropdownItems } from '../../../../shared/components/dropdown/dropdown.component.types';
import { ModalService } from './../../../../shared/services/modal.service';
import { Router } from '@angular/router';
import { ShimmerLoaded } from './../../../../shared/misc/shimmer-loaded';
import { Title } from '@angular/platform-browser';
import { ResponsitivyService } from './../../../../shared/services/responsivity.service';
import { generateRandomWidths } from '../../../../shared/misc/random-widths';

type StrategyCardDropdownHandlerParams = {
  id: string;
};

@Component({
  selector: 'app-my-strategies',
  templateUrl: './my-strategies.component.html',
  styleUrls: ['./my-strategies.component.sass'],
})
export class MyStrategiesComponent implements OnInit, ShimmerLoaded {
  constructor(
    private breadcrumbsService: BreadcrumbsService,
    private strategyApiService: StrategyApiService,
    private modalService: ModalService,
    private router: Router,
    private title: Title,
    public responsitivy: ResponsitivyService
  ) {
    this.title.setTitle('Minhas estratégias - Shark');
  }

  strategies: GetUserStrategiesResponse = [];
  isStrategiesLoaded = false;
  visibleStrategies: boolean[] = [];

  private strategyCardDropdownItems: DropdownItems = [
    {
      text: 'Editar',
      icon: 'edit',
      handler: this.onStrategyEdit.bind(this),
    },
    {
      text: 'Excluir',
      icon: 'delete_forever',
      handler: this.onStrategyDelete.bind(this),
    },
  ];

  activatedCardDropdownItems: DropdownItems = [
    {
      text: 'Desativar',
      icon: 'close',
      handler: this.onStrategyDeactivate.bind(this),
    },
    ...this.strategyCardDropdownItems,
  ];

  deactivatedCardDropdownItems: DropdownItems = [
    {
      text: 'Ativar',
      icon: 'check',
      handler: this.onStrategyActivate.bind(this),
    },
    ...this.strategyCardDropdownItems,
  ];

  gameIcons = {
    CRASH: 'trending_up',
    DOUBLE: 'view_in_ar',
  };

  shimmerStrategyCardWidths = generateRandomWidths(5);

  ngOnInit(): void {
    this.breadcrumbsService.update('Início > Estratégias');

    this.getUserStrategies();
  }

  getUserStrategies() {
    this.isStrategiesLoaded = false;
    this.strategyApiService
      .getUserStrategies()
      .then((res) => {
        this.strategies = res;
        this.visibleStrategies = this.visibleStrategies.fill(
          false,
          0,
          res.length
        );
      })
      .finally(() => {
        this.isStrategiesLoaded = true;
      });
  }

  getStrategyGameIcon(game: string) {
    return this.gameIcons[game as keyof typeof this.gameIcons];
  }

  onStrategyEdit(params: StrategyCardDropdownHandlerParams) {
    this.router.navigate(['strategies', params.id]);
  }

  onStrategyDelete(params: StrategyCardDropdownHandlerParams) {
    this.modalService.open({
      name: 'confirmation',
      data: {
        title: 'Atenção',
        text: 'Tem certeza que deseja excluir essa estratégia? Essa ação não é reversível.',
        onConfirmation: () => {
          this.strategyApiService.deleteUserStrategy(params.id).then(() => {
            this.getUserStrategies();
          });
        },
      },
    });
  }

  onStrategyActivate(params: StrategyCardDropdownHandlerParams) {
    this.strategyApiService.patchActivateStrategy(params.id).then(() => {
      this.toggleStrategy(params.id, true);
    });
  }

  onStrategyDeactivate(params: StrategyCardDropdownHandlerParams) {
    this.strategyApiService.patchDeactivateStrategy(params.id).then(() => {
      this.toggleStrategy(params.id, false);
    });
  }

  findStrategy(id: string) {
    return this.strategies.find((strategy) => strategy.id === id);
  }

  toggleStrategy(id: string, toggle: boolean) {
    const strategy = this.findStrategy(id);

    strategy && (strategy.active = toggle);
  }

  canShowShimmer(): boolean {
    return !this.isStrategiesLoaded;
  }

  isLoaded(): boolean {
    return this.isStrategiesLoaded;
  }
}
