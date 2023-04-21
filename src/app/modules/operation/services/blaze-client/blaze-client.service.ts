import { Injectable } from '@angular/core'
import { PlatformConnectionService } from './../platform-connection/platform-connection.service'
import { Platform } from '../../../../core/blaze/types/platform'

@Injectable({ providedIn: 'root' })
export class BlazeClient {
  private ws: WebSocket
  private pingInterval: any

  serverData = {
    balance: -1,
  }

  constructor(private platformConnectionService: PlatformConnectionService) {}

  connect() {
    const ws = new WebSocket(
      'wss://api-v2.blaze.com/replication/?EIO=3&transport=websocket'
    )

    this.ws = ws

    ws.onopen = this.onOpen.bind(this)
    ws.onmessage = this.onMessage.bind(this)
    ws.onclose = this.onClose.bind(this)
  }

  disconnect() {
    if (this.ws && this.ws.OPEN) this.ws.close()
  }

  private onOpen() {
    this.pingInterval = setInterval(() => {
      this.sendRawMessage(3)
    }, 25e3)
  }

  private onMessage(event: any) {
    const data = event.data.toString()

    this.handleInitialMessages(data)
    this.handleRawMessage(data)
  }

  private onClose() {
    clearInterval(this.pingInterval)

    setTimeout(() => {
      this.connect()
    }, 3e3)
  }

  private sendRawMessage(message: any) {
    this.ws.send(message)
  }

  private sendMessage(header: number, opcode: string, data: object) {
    this.ws.send(`${header}["${opcode}",${JSON.stringify(data)}]`)
  }

  private handleInitialMessages(rawMessage: string) {
    const [token] = this.platformConnectionService
      .read(Platform.BLAZE)
      .split(';')

    if (rawMessage.startsWith('40')) {
      this.sendMessage(420, 'cmd', {
        id: 'authenticate',
        payload: {
          token,
        },
      })
    }
  }

  private handleRawMessage(rawMessage: string) {
    const firstBracketIndex = rawMessage.indexOf('[')
    if (firstBracketIndex > 2 || firstBracketIndex < 0) return

    const header = Number(rawMessage.substring(0, firstBracketIndex))
    const message = JSON.parse(rawMessage.substring(firstBracketIndex))

    switch (header) {
      case 42:
        const [, data] = message

        switch (data.id) {
          case 'wallet.balance-changed': {
            const { balance } = data.payload

            this.serverData.balance = balance
          }
        }
        break
    }
  }
}
