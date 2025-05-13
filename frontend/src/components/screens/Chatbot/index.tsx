import { HeaderPage } from '../../_ui/HeaderPage'
import { ModalCreateNewMessages } from './ModalCreateNewMessage'
import { TableComponent } from '../../_ui/TableComponent'
import { IColumn } from '../../../models/interfaces/IColumn'
import { useColumns } from './hooks/useColumns'
import { FilterDate } from '../../_ui/FilterDate'
import style from './Chatbot.module.scss'
import { ListMobile } from '../../_ui/ListMobile'
import { useFieldsMobile } from './hooks/useFieldsMobile'
import { useMessageList } from '../../../hooks/useMessageList'
import { useCancelMessage } from './hooks/useCancelMessage'
import { useEditmessage } from './hooks/useEditMessage'

export function Message() {
  const { handleCancelMessage } = useCancelMessage()
  const { messages, loadingMessages } = useMessageList({ otherFilters: null })
  const {
    formModalOpened,
    handleEditmessage,
    messageToEditData,
    setFormModalOpened,
    setMessageToEditData,
  } = useEditMessage()

  const columns: IColumn[] = useColumns({
    handleEditMessage,
    handleCancelMessage,
  })

  const fieldsMobile = useFieldsMobile()

  return (
    <>
      <HeaderPage
        onClickFunction={() => {
          setFormModalOpened(true)
        }}
        buttonText="Nova Mensagem"
        InputFilter={<FilterDate />}
      />

      <div className={style.viewDesktop}>
        <TableComponent
          emptyText="Nenhuma mensagem encontrada"
          loading={loadingMessages}
          columns={columns}
          rows={messages}
        />
      </div>

      <div className={style.viewMobile}>
        <ListMobile
          emptyText="Nenhuma mensagem encontrada"
          loading={loadingMessages}
          collapseItems={columns}
          itemFields={fieldsMobile}
          items={messages}
        />
      </div>

      {formModalOpened && (
        <ModalCreateNewMessage
          open={formModalOpened}
          messageToEditData={messageToEditData}
          handleClose={() => {
            setFormModalOpened(false)
            setmessageToEditData(null)
          }}
        />
      )}
    </>
  )
}
