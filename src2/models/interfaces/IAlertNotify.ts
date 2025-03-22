import { AlertNotifyType } from '../enums/AlertNotifyType'

export interface IAlertNotify {
  open: boolean
  type: AlertNotifyType
  text: string
  handleClose: () => void
}
