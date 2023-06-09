import { Validators } from '@angular/forms'
import { AppValidators } from '../../../../core/validators/index.validators'

export type CreateStrategyTabs = Array<{
  topic: string
  items: Array<{
    name: string
    text: string
    filter?: () => boolean
    icon: string
  }>
}>

export type PlatformValidationPlan = {
  common?: { [key: string]: Array<any> }
  CRASH?: { [key: string]: Array<any> }
  DOUBLE?: { [key: string]: Array<any> }
}

export const BlazeValidationPlan: PlatformValidationPlan = {
  common: {
    betAmount: [Validators.required, Validators.min(0.1)],
  },
  DOUBLE: {
    whiteProtectionBetAmount: [AppValidators.number, Validators.min(0.1)],
  },
}

export const SmashValidationPlan: PlatformValidationPlan = {
  common: {
    betAmount: [Validators.required, Validators.min(1)],
  },
  CRASH: {
    betAmount: [Validators.required, Validators.min(1), Validators.max(2000)],
  },
  DOUBLE: {
    whiteProtectionBetAmount: [AppValidators.number, Validators.min(1)],
  },
}
