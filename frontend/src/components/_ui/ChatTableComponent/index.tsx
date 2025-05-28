import { useState } from 'react'
import style from './ChatTableComponent.module.scss'
import { Column } from './interfaces'
import { Skeleton } from '@mui/material'

interface Props {
  columns: Column[]
  rows: any[]
  loading: boolean
  emptyText?: string
  heightSkeleton?: number
}

export function ChatTableComponent({
  columns,
  rows,
  loading,
  emptyText,
  heightSkeleton = 30,
}: Props) {
  const handleSendMessage = (message: string) => {
    const newMessage = {
      _id: (rows.length + 1).toString(),
      clientMessage: message,
    }
    rows.push([...rows, newMessage])
    console.log(message)
  }

  return (
    <table style={loading ? { opacity: 0.5 } : {}} className={style.table}>
      <thead>
        <tr>
          {columns?.map((column) => {
            return (
              <th key={column.field}>
                <p>{column?.headerName || ''}</p>
              </th>
            )
          })}
        </tr>
      </thead>
      <tbody>
        {rows.length > 0 &&
          !loading &&
          rows?.map((row) => {
            return (
              <tr key={row._id}>
                {columns.map((column) => {
                  return (
                    <td
                      className={column?.cellClass?.({
                        value: row[column.field],
                        data: row,
                      })}
                      key={column.field}
                      style={{ flex: 1 }}
                    >
                      {column?.valueFormatter?.({
                        value: row[column.field],
                        data: row,
                      }) && row[column.field]}
                    </td>
                  )
                })}
              </tr>
            )
          })}

        {rows.length === 0 && !loading && (
          <tr className={style.emptyRow}>
            <td className={style.emptyCell} colSpan={columns.length}>
              <p>{emptyText || 'Nenhum item encontrado'}</p>
            </td>
          </tr>
        )}

        {loading &&
          [1, 2, 3, 4, 5].map((item) => {
            return (
              <tr key={item}>
                {columns.map((column) => {
                  return (
                    <td
                      className={style.skeleton}
                      key={column.field}
                      style={{ flex: 1 }}
                    >
                      <Skeleton
                        variant="rounded"
                        height={heightSkeleton}
                        sx={{ fontSize: '1rem', borderRadius: 15 }}
                      />
                    </td>
                  )
                })}
              </tr>
            )
          })}

        {!loading && (
          <div className={style.chatInputContainer}>
            <input
              type="text"
              className={style.chatInput}
              placeholder="Digite uma mensagem..."
              autoFocus
            />
            <button
              className={style.sendButton}
              onClick={(e) => {
                handleSendMessage(
                  console.log((e.currentTarget.parentNode?.firstChild as HTMLInputElement).value))
              }}
            >
              Enviar
            </button>
          </div>
        )}
      </tbody>
    </table>
  )
}
