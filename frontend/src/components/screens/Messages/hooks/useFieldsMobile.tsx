import { IMessage } from '../../../../models/interfaces/IMessage'
import { CellFunctionParams } from '../../../../models/interfaces/IColumn'
import { format } from '../../../../utils/format'

export function useFieldsMobile() {
  return [
    {
      headerName: 'Nome da mensagem',
      field: 'name',
      valueFormatter: (params: CellFunctionParams<IMessage>) =>
        params.value || '--',
    },
    {
      headerName: 'Valor',
      field: 'value',
      valueFormatter: (params: CellFunctionParams<IMessage>) =>
        format.formatToReal(params.value || 0),
    },
  ]
}
