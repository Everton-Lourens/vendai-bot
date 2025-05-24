import { useState } from 'react'
import { IMessage } from '../../../../models/interfaces/IMessage'

export function useEditMessage() {
  const [formModalOpened, setFormModalOpened] = useState<boolean>(false)
  const [messageDataToEdit, setMessageDataToEdit] = useState<IMessage | null>(
    null,
  )

  function handleEditMessage(message: IMessage) {
    setMessageDataToEdit(message)
    setFormModalOpened(true)
  }

  return {
    handleEditMessage,
    formModalOpened,
    setFormModalOpened,
    messageDataToEdit,
    setMessageDataToEdit,
  }
}
