import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ResponsitivyService {
  public isPhone = false;
  public isTabletPortrait = false;
  public isTabletLandscape = false;
  public isDesktop = false;

  update() {
    this.isPhone = window.matchMedia(
      'only screen and (max-width: 599px)'
    ).matches;

    this.isTabletPortrait = window.matchMedia(
      'only screen and (min-width: 600px)' // and (max-width: 899px)
    ).matches;

    this.isTabletLandscape = window.matchMedia(
      'only screen and (min-width: 900px)' // and (max-width: 1199px)
    ).matches;

    this.isDesktop = window.matchMedia(
      'only screen and (min-width: 1200px)'
    ).matches;
  }
}
