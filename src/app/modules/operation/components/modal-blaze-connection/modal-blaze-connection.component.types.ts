import jwtDecode from 'jwt-decode'
import { Platform } from '../../../../core/blaze/types/platform'

export type ModalPlatformConnectionParams = { platform: Platform }

export const ModalPlatformConnectionDefinitions = {
  [Platform.BLAZE]: {
    name: 'Blaze',
    helpVideoUrl: 'https://vimeo.com/819672827',
    validate: (input: string) => {
      const rawAccessTokenParts = input.split(';')

      if (rawAccessTokenParts.length !== 2) {
        return false
      }

      const [accessToken, walletId] = rawAccessTokenParts

      if (isNaN(walletId as any)) {
        return false
      }

      try {
        jwtDecode(accessToken)
      } catch {
        return false
      }

      return true
    },
  },
  [Platform.SMASH]: {
    name: 'Smash',
    helpVideoUrl: 'https://t.me/tutoriaisrobo/12',
    validate: (input: string) => {
      if (input.trim() === '') return false

      return true
    },
  },
}
