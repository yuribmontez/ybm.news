/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { ActiveLink } from '../ActiveLink'
import { SignInButton } from '../SignInButton'
import styles from './styles.module.scss'

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href='/'>
          <a>
            <img src="/images/logo-ybm.svg" alt="ybm.news" />
          </a>
        </Link>
        <nav>
          <ActiveLink activeClassName={styles.active} href='/'>
            <a className={styles.active}>Home</a>
          </ActiveLink>
          <ActiveLink activeClassName={styles.active} href='/posts'>
            <a>Posts</a>
          </ActiveLink>
        </nav>

        <SignInButton />
      </div>
    </header>
  )
}
