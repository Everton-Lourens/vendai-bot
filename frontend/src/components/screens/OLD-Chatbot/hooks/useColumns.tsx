import dayjs from 'dayjs'
import {
  IColumn,
  CellFunctionParams,
} from '../../../../models/interfaces/IColumn'
import { format } from '../../../../utils/format'
import { IMessage } from '../../../../models/interfaces/IMessage'
import style from '../Chatbot.module.scss'
import { faCancel, faPen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface UseColumnsParams {
  handleCancelMessage: (message: IMessage) => void
  handleEditMessage: (message: IMessage) => void
}

export function useColumns({
  handleEditMessage,
  handleCancelMessage,
}: UseColumnsParams): IColumn[] {
  const actions = [
    {
      icon: <FontAwesomeIcon className={style.icon} icon={faPen} />,
      title: 'Editar venda',
      onClickFunction: handleEditMessage,
      className: style.editButton,
    },
    {
      icon: <FontAwesomeIcon className={style.icon} icon={faCancel} />,
      title: 'Cancelar venda',
      onClickFunction: handleCancelMessage,
      className: style.cancelButton,
    },
  ]

  return [
    {
      headerName: 'Nº da venda',
      field: 'code',
      valueFormatter: (params: CellFunctionParams<IMessage>) => params.value,
      cellClass: ({ data: { status } }) => {
        if (status === 'canceled') return style.canceledText
      },
    },
    {
      headerName: 'Cliente',
      field: 'client',
      valueFormatter: ({ data: { client } }: CellFunctionParams<IMessage>) =>
        client?.name || '--',
      cellClass: ({ data: { status } }) => {
        if (status === 'canceled') return style.canceledText
      },
    },
    {
      headerName: 'Data da venda',
      field: 'date',
      valueFormatter: (params: CellFunctionParams<IMessage>) =>
        dayjs(params.value).format('DD/MM/YYYY - HH:mm'),
      cellClass: ({ data: { status } }) => {
        if (status === 'canceled') return style.canceledText
      },
    },
    {
      headerName: 'Forma de pagamento',
      field: 'paymentType',
      valueFormatter: (params: CellFunctionParams<IMessage>) =>
        format.formatPaymentType(params.value),
      cellClass: ({ data: { status } }) => {
        if (status === 'canceled') return style.canceledText
      },
    },
    {
      headerName: 'Valor total',
      field: 'totalValue',
      valueFormatter: (params: CellFunctionParams<IMessage>) =>
        format.formatToReal(params.value),
      cellClass: ({ data: { status } }) => {
        if (status === 'canceled') return style.canceledText
      },
    },
    {
      headerName: '',
      field: 'acoes',
      type: 'actions',
      cellRenderer: (params: CellFunctionParams<IMessage>) => {
        return (
          <div className={style.actionsContainer}>
            {actions.map(({ icon, ...action }) => {
              return (
                <button
                  className={action.className}
                  key={action.title}
                  type="button"
                  disabled={params?.data?.status === 'canceled'}
                  onClick={() => {
                    action?.onClickFunction?.(params.data)
                  }}
                >
                  {icon && icon}
                </button>
              )
            })}
          </div>
        )
      },
    },
  ]
}
