import { Platform } from '../../../../core/blaze/types/platform'

export type GetUserProfileResponse = {
  birthDate: string
  cellphone: string
  cpf: string
  createdAt: string
  email: string
  firstName: string
  id: string
  lastLoginAt: string
  lastName: string
  subscription?: {
    status: string
    createdAt: Date
    updatedAt: Date
  }
  vinculations: {
    id: string
    platform: Platform
    nickname: string
  }[]
}
