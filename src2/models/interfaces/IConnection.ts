import { WaConnectionStatus } from '../enums/WaConnectionStatus'

export interface IConnection {
  status: WaConnectionStatus
  qrcode?: string
  user?: {
    name: string
    phone: string
  }
}
