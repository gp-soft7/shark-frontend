import { Injectable } from '@angular/core'
import { CallCardStyle } from '../../components/call-card/call-card.component.types'

@Injectable({ providedIn: 'root' })
export class CallSettingsService {
  private KEY = '@gp/cs'

  current = {
    callCardStyle: CallCardStyle.SIMPLE,
    eventExhibitions: {
      STOP_GAIN: true,
      STOP_LOSS: true,
      BOT_START: true,
      BOT_STOP: true,
      BOT_ERROR: true,
    },
  }

  load() {
    const current = localStorage.getItem(this.KEY)

    if (current) this.current = JSON.parse(current)
  }

  save() {
    localStorage.setItem(this.KEY, JSON.stringify(this.current))
  }
}
