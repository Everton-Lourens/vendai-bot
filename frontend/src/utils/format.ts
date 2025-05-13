import { paymentTypeList } from '../models/constants/PaymentTypeList'

export const format = {
  formatToReal(value: number | string) {
    return Number(value).toLocaleString('pt-br', {
      style: 'currency',
      currency: 'BRL',
    })
  },
  formatPaymentType(paymentType: string) {
    const paymentFormated = paymentTypeList.find(
      (paymentItem) => paymentItem.value === paymentType,
    )
    return paymentFormated?.text
  },
}
