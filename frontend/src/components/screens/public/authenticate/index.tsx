'use client'

import style from './authenticate.module.scss'

export function Authenticate() {
  return (
    <form className={style.form} onSubmit={() => {}}>
      <input />
      <input />
      <input />
      <input />
      <button>Enviar</button>
    </form>
  )
}
