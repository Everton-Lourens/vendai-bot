import { useState } from 'react'
import { IMessage } from '../../../../models/interfaces/IMessage'

export function useEditMessage() {
  const [formModalOpened, setFormModalOpened] = useState<boolean>(false)
  const [messageToEditData, setMessageToEditData] = useState<IMessage | null>(
    null,
  )

  function handleEditMessage(message: IMessage) {
    setMessageToEditData(message)
    setFormModalOpened(true)
  }

  return {
    handleEditMessage,
    formModalOpened,
    messageToEditData,
    setFormModalOpened,
    setMessageToEditData,
  }
}
