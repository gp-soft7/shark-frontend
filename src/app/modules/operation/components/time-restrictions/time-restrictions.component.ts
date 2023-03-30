import { Component, OnInit } from '@angular/core';
import { TimeRestrictionList } from './time-restrictions.component.types';

@Component({
  selector: 'app-time-restrictions',
  templateUrl: './time-restrictions.component.html',
  styleUrls: ['./time-restrictions.component.sass'],
})
export class TimeRestrictionsComponent implements OnInit {
  whiteList: TimeRestrictionList = [];
  blackList: TimeRestrictionList = [];

  isWhiteListEnabled = false;
  isBlackListEnabled = false;

  constructor() {}

  ngOnInit(): void {}

  get invalid() {
    return (
      (this.isWhiteListEnabled &&
        this.whiteList.some((item) => item.hasError)) ||
      (this.isBlackListEnabled && this.whiteList.some((item) => item.hasError))
    );
  }

  get isFilled() {
    return this.isWhiteListEnabled || this.isBlackListEnabled;
  }

  addToWhiteList() {
    this.whiteList.push({
      from: '',
      to: '',
    });
  }

  addToBlackList() {
    this.blackList.push({
      from: '',
      to: '',
    });
  }

  deleteFromWhiteList(index: number) {
    this.whiteList.splice(index, 1);
  }

  deleteFromBlackList(index: number) {
    this.blackList.splice(index, 1);
  }

  validateItem(index: number, listName: 'white' | 'black') {
    const list = listName === 'white' ? this.whiteList : this.blackList;

    let hasError = false;

    const item = list[index];

    if (item.from.trim() === '' || item.to.trim() === '') {
      hasError = true;
    }

    if (this.isDateGreater(item.from, item.to)) {
      hasError = true;
    }

    item.hasError = hasError;
  }

  isDateGreater(date1: string, date2: string) {
    const [date1Hours, date1Minutes] = date1
      .split(':')
      .map((part) => Number(part));
    const [date2Hours, date2Minutes] = date2
      .split(':')
      .map((part) => Number(part));

    if (date1Hours > date2Hours) return true;

    if (date1Hours === date2Hours && date1Minutes >= date2Minutes) return true;

    return false;
  }

  getDataForSubmit() {
    const data: any = {};

    if (this.isWhiteListEnabled) {
      data['whiteList'] = this.whiteList;
    }

    if (this.isBlackListEnabled) {
      data['blackList'] = this.blackList;
    }

    return data;
  }

  loadData(data: any) {
    if (data.whiteList) {
      this.whiteList = data.whiteList;
      this.isWhiteListEnabled = true;
    }

    if (data.blackList) {
      this.blackList = data.blackList;
      this.isBlackListEnabled = true;
    }
  }
}
