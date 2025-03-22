import { IConnection } from '@/models/interfaces/IConnection'
import { getLocalUser } from '@/utils/functions/storage/getLocalUser'
import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

export function useConnectionWa() {
  const [connection, setConnection] = useState<IConnection | null>(null)

  async function getInstance(socket: Socket) {
    const user = await getLocalUser()

    socket.emit('getInstance', user._id)

    socket.on('connectionWa', ({ connection }) => {
      console.log('connection', connection)
      setConnection(connection)
    })
  }

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_END_POINT || '', {
      forceNew: true,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    })

    socket.on('connect', () => {
      console.log('Conexão com o backend estabelecida com sucesso')
    })

    socket.on('disconnect', () => {
      console.log('Conexão com o backend perdida')
    })

    getInstance(socket)

    return () => {
      socket.close()
    }
  }, [])

  return {
    connection,
  }
}
