import { ProductInSale, Sale } from '../../entities/sale'

export interface INewSaleDTO {
  clientId: string
  products: ProductInSale[]
  paymentType: string
  totalValue: number
  userId: string
  code?: string
}

export interface ICompletedSaleDTO {
  client: null
  products: {
    _id: string
    name: string
    value: number
    amount: number
  }[]
  paymentType: string
  totalValue: number
  status: null
  user: string
  code: string
  _id: string
  date: Date
  __v: number
}

export interface FiltersGetSales {
  startDate: any
  endDate: any
  userId: string
  status: string
}

export interface UpdateParams {
  filters: any
  updateFields: any
}

export interface ISalesRepository {
  list: (filters: FiltersGetSales) => Promise<Sale[]>
  getEntries: (userId: string) => Promise<number>
  create: (SaleData: INewSaleDTO) => Promise<Sale>
  update: (updateParams: UpdateParams) => Promise<void>
  findById: (saleId: string) => Promise<Sale>
}
