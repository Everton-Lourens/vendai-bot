'use client'

import Image from 'next/image'
import style from './Messages.module.scss'
import { useConnectionWa } from './hooks/useConnectionWa'
import { WaConnectionStatus } from '@/models/enums/WaConnectionStatus'
import { formatConnectionStatus } from '@/utils/functions/formatConnectionStatus'
import { Loading } from '@/components/_ui/Loading'
import { useRouter } from 'next/navigation'

export function MessagesComponent() {
  const { connection } = useConnectionWa()

  const router = useRouter()

  return (
    <div className={style.homeContainer}>
      {!connection ? (
        <Loading size={25} color="#ffffff7d" />
      ) : (
        <div className={style.connectionContainer}>
          {connection?.status === WaConnectionStatus.PENDING && (
            <>
              <h2>Leia o QR Code para começar</h2>
              <p>
                Após a leitura, o sistema irá se conectar com o whatsapp e você
                poderá realizar o envio de mensagens
              </p>

              <Image
                width={400}
                height={400}
                src={connection?.qrcode || ''}
                alt="qrcode"
                className={style.connectionQrCode}
              />
            </>
          )}

          {connection?.status === WaConnectionStatus.CONNECTED && (
            <div className={style.connectionUser}>
              <h3>{connection?.user?.name}</h3>
              <h4>{connection?.user?.phone}</h4>
            </div>
          )}

          <b
            className={`${style.connectionStatus} ${style[connection?.status || '']}`}
          >
            {formatConnectionStatus(connection?.status || null)}
          </b>

          {connection?.status === WaConnectionStatus.CONNECTED && (
            <button
              type="button"
              className={style.goToSendMessagesButton}
              onClick={() => {
                router.push('/messages/sendMessages')
              }}
            >
              Começar envio
            </button>
          )}

          {connection?.status === WaConnectionStatus.DISCONNECTED && (
            <button type="button" className={style.reconnectButton}>
              Reconectar
            </button>
          )}
        </div>
      )}
    </div>
  )
}
