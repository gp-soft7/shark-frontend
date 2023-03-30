import { Component } from '@angular/core';
import { BreadcrumbsService } from './../../services/breadcrumbs.service';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.sass'],
})
export class BreadcrumbsComponent {
  constructor(private breadcrumbsService: BreadcrumbsService) {}

  get currentBreadcrumbs() {
    return this.breadcrumbsService.current;
  }

  isLastBreadcrumb(index: number) {
    return index === this.currentBreadcrumbs.length - 1;
  }

  getAbsoluteRoute(index: number) {
    return this.breadcrumbsService.getAbsoluteRoute(
      this.currentBreadcrumbs[index]
    );
  }
}
