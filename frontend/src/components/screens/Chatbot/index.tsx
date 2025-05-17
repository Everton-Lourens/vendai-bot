import { HeaderPage } from '../../_ui/HeaderPage'
import { ModalCreateNewMessage } from './ModalCreateNewMessage'
import { TableComponent } from '../../_ui/TableComponent'
import { IColumn } from '../../../models/interfaces/IColumn'
import { useColumns } from './hooks/useColumns'
import { FilterByName } from '../../_ui/FilterByName'
import style from './Chatbot.module.scss'
import { ListMobile } from '../../_ui/ListMobile'
import { useFieldsMobile } from './hooks/useFieldsMobile'
import { useMessageList } from '../../../hooks/useMessageList'
import { useDeleteMessage } from './hooks/useDeleteMessage'
import { useEditMessage } from './hooks/useEditMessage'

export function Chatbot() {
  const { loadingMessages, messages } = useMessageList({ otherFilters: null })
  const { handleDeleteMessage } = useDeleteMessage()
  const {
    formModalOpened,
    handleEditMessage,
    messageDataToEdit,
    setFormModalOpened,
    setMessageDataToEdit,
  } = useEditMessage()

  const columns: IColumn[] = useColumns({
    handleEditMessage,
    handleDeleteMessage,
  })

  const fieldsMobile = useFieldsMobile()

  return (
    <>
      <HeaderPage
        onClickFunction={() => {
          setFormModalOpened(true)
        }}
        buttonText="Nova mensagem"
        disabled={true}
        InputFilter={<FilterByName />}
      />

      <div className={style.viewDesktop}>
        <TableComponent
          loading={loadingMessages}
          columns={columns}
          rows={messages}
          emptyText="Nenhuma mensagem cadastrada"
        />
      </div>

      <div className={style.viewMobile}>
        <ListMobile
          collapseItems={columns}
          itemFields={fieldsMobile}
          items={messages}
          loading={loadingMessages}
          emptyText="Nenhuma mensagem cadastrada"
        />
      </div>

      {formModalOpened && (
        <ModalCreateNewMessage
          messageDataToEdit={messageDataToEdit}
          open={formModalOpened}
          handleClose={() => {
            setFormModalOpened(false)
            setMessageDataToEdit(null)
          }}
        />
      )}
    </>
  )
}
