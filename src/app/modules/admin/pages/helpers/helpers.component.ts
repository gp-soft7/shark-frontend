import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from './../../../../shared/helpers/functions/api-url.helper';
import { firstValueFrom } from 'rxjs';
import { UserApiService } from './../../../user/services/user-api/user-api.service';
import { GetUserProfileResponse } from '../../../user/services/user-api/user-api.service.types';

@Component({
  selector: 'app-helpers',
  templateUrl: './helpers.component.html',
  styleUrls: ['./helpers.component.sass'],
})
export class HelpersComponent implements OnInit {
  form: FormGroup;
  getUserIdByEmailResult: GetUserProfileResponse | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private userApiService: UserApiService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      userEmail: ['', Validators.email],
    });
  }

  getUserIdByEmail() {
    this.getUserIdByEmailResult = null;

    if (this.form.invalid) return;

    const { userEmail } = this.form.getRawValue();

    this.userApiService.getUserProfileByEmail(userEmail).then((res: any) => {
      this.getUserIdByEmailResult = res;
    });
  }
}
