import { HeaderPage } from '../../_ui/HeaderPage'
import { ModalCreateNewMessage } from './ModalCreateNewMessage'
import { TableComponent } from '../../_ui/TableComponent'
import { FilterByName } from '../../_ui/FilterByName'
import style from './Chat.module.scss'
import { ListMobile } from '../../_ui/ListMobile'
import { useFieldsMobile } from './hooks/useFieldsMobile'
import { useMessageList } from '../../../hooks/useMessageList'
import { useEditMessage } from './hooks/useEditMessage'

export function Chat() {
  const { loadingMessages } = useMessageList({ otherFilters: null })
  const {
    formModalOpened,
    messageDataToEdit,
    setFormModalOpened,
    setMessageDataToEdit,
  } = useEditMessage()

  /*
  const columns: IColumn[] = useColumns({
    handleEditMessage,
    handleDeleteMessage,
  })
  */

  const fieldsMobile = useFieldsMobile()

  const columns = [
    {
      headerName: "Converse com o Chatbot",
      field: "chatMessage",
      valueFormatter: ({ value }) => `(${'chatMessage'}): ${value}`,
      cellClass: () => "light-blue"
    },
  ];
  const messages = [
    {
      _id: "1",
      chatMessage: "Olá! Como posso te ajudar?"
    },
  ];

  return (
    <>
      <HeaderPage
        onClickFunction={() => {
          setFormModalOpened(true)
        }}
        buttonText="Criar Mensagem"
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
