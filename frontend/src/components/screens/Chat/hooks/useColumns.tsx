import {
  IColumn,
  CellFunctionParams,
} from '../../../../models/interfaces/IColumn'
import style from '../Chat.module.scss'
import { IMessage } from '../../../../models/interfaces/IMessage'
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface UseColumnsParams {
  handleEditMessage: (message: IMessage) => void
  handleDeleteMessage: (message: IMessage) => void
}

export function useColumns({
  handleEditMessage,
  handleDeleteMessage,
}: UseColumnsParams): IColumn[] {
  const actions = [
    {
      icon: <FontAwesomeIcon className={style.icon} icon={faPen} />,
      title: 'Editar',
      onClickFunction: handleEditMessage,
      className: style.editButton,
      disabled: false,
    },
    {
      icon: <FontAwesomeIcon className={style.icon} icon={faTrash} />,
      title: 'Excluir',
      onClickFunction: handleDeleteMessage,
      className: style.deleteButton,
      disabled: true,
    },
  ]

  return [
    {
      headerName: 'Estágio',
      field: 'stage',
      valueFormatter: (params: CellFunctionParams<IMessage>) =>
        params.value || '--',
    },
    {
      headerName: 'Texto da mensagem',
      field: 'text',
      valueFormatter: (params: CellFunctionParams<IMessage>) =>
        params.value || '--',
    },
    {
      headerName: 'Posição da mensagem',
      field: 'position',
      valueFormatter: (params: CellFunctionParams<IMessage>) =>
        params.value || '--',
    },
    {
      headerName: '',
      field: 'acoes',
      type: 'actions',
      cellRenderer: (params: CellFunctionParams<IMessage>) => {
        return (
          <div className={style.actionsContainer}>
            {actions.map((action) => {
              return (
                <button
                  key={action.title}
                  type="button"
                  className={action.className}
                  disabled={action.disabled}
                  onClick={() => {
                    action?.onClickFunction?.(params.data)
                  }}
                >
                  {action.icon && action.icon}
                </button>
              )
            })}
          </div>
        )
      },
    },
  ]
}
