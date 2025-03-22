'use client'

import { CustomTextField } from '@/components/_ui/CustomTextField'
import { useLogin } from './hooks/useLogin'
import style from './Login.module.scss'
import Link from 'next/link'
import { Loading } from '@/components/_ui/Loading'

export function LoginComponent() {
  const { onLogin, handleSubmit, register, isSubmitting } = useLogin()

  return (
    <section className={style.loginContainer}>
      <form className={style.formContainer} onSubmit={handleSubmit(onLogin)}>
        <h3 className={style.title}>Entre com sua conta</h3>

        <div className={style.fieldsContainer}>
          <CustomTextField
            label="E-mail"
            placeholder="Digite o seu e-mail"
            type="email"
            {...register('email')}
          />

          <CustomTextField
            label="Senha"
            placeholder="Digite a sua senha"
            type="password"
            {...register('password')}
          />

          <button
            disabled={isSubmitting}
            type="submit"
            className={style.submitButton}
          >
            {isSubmitting ? <Loading /> : 'Confirmar'}
          </button>

          <p>
            É novo aqui?{'  '}
            <Link className={style.goToLoginAnchor} href="/register">
              Criar conta
            </Link>
          </p>
        </div>
      </form>
    </section>
  )
}
