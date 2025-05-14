import { IProduct } from '../../../../models/interfaces/IProduct'
import { CellFunctionParams } from '../../../../models/interfaces/IColumn'
import { format } from '../../../../utils/format'

export function useFieldsMobile() {
  return [
    {
      headerName: 'Nome do produto',
      field: 'name',
      valueFormatter: (params: CellFunctionParams<IProduct>) =>
        params.value || '--',
    },
    {
      headerName: 'Valor',
      field: 'value',
      valueFormatter: (params: CellFunctionParams<IProduct>) =>
        format.formatToReal(params.value || 0),
    },
  ]
}
