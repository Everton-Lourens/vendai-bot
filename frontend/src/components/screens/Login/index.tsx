import style from './Login.module.scss'
import Link from 'next/link'

export function Login() {
  return (
    <div className={style.loginContainer}>
      <h2>Entrar com uma conta existente</h2>

      <Link href="/createAccount" className={style.createAccountLink}>
        Criar nova conta
      </Link>
    </div>
  )
}
