import Link from 'next/link'
import style from './Home.module.scss'
import Image from 'next/image'
import chatBotImagePath from '../../../../public/assets/icons/chat-bot.svg'

export function HomeComponent() {
  return (
    <div className={style.homeContainer}>
      <section className={style.infosContainer}>
        <h2>Quer experimentar?</h2>

        <h3>É bem simples</h3>

        <p>
          <Link className={style.goToLoginAnchor} href="/login">
            Clique aqui
          </Link>{' '}
          para realizar o cadastro
        </p>

        <p>
          Após preencher todos os dados, você será redirecionado para a página
          de início da sessão.
        </p>
      </section>

      <section className={style.imageContainer}>
        <Image
          src={chatBotImagePath}
          alt="chat image"
          className={style.image}
        />
      </section>
    </div>
  )
}
