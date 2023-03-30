import { Component, OnInit } from '@angular/core';
import {
  fadeInOnEnterAnimation,
  fadeOutOnLeaveAnimation,
} from 'angular-animations';
import { ModalComponent } from '../modal.component';
import { ModalArticleParams } from './modal-article.component.types';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-modal-article',
  templateUrl: './modal-article.component.html',
  styleUrls: ['./modal-article.component.sass'],
  animations: [
    fadeInOnEnterAnimation({ duration: 400 }),
    fadeOutOnLeaveAnimation({ duration: 400 }),
  ],
})
export class ModalArticleComponent
  extends ModalComponent<ModalArticleParams>
  implements OnInit
{
  constructor(private httpClient: HttpClient) {
    super();
  }

  text = '';

  ngOnInit(): void {
    // this.openWithParams({
    //   articleSlug: 'sexo',
    // });
  }

  override onOpen(): void {
    console.log(this.params);

    firstValueFrom(
      this.httpClient.get('../../assets/articles/blaze-connection-ios.md', {
        responseType: 'text',
      })
    ).then((data) => {
      this.text = data;
      console.log(this.text)
    });
  }
}
