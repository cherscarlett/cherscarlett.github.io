import Link from 'next/link'
import { FunctionComponent } from 'react'
import styles from './Nav.module.scss'

const Nav: FunctionComponent = () => (
  <header className={styles.header}>
    <div className={styles.kicker}>
      <span>Astrophysics · Space Physics · Atmospheric Physics</span>
      <Link href="/" className={styles.domain}>cher.dev</Link>
      <span className={styles.archive}>Software · Human Rights · est. 1985</span>
    </div>

    <div className={styles.brand}>
      <span className={styles.swanMark} aria-label="Cher Scarlett">
        <img
          src="/images/swan.png"
          alt=""
          width="1254"
          height="1254"
          decoding="async"
        />
      </span>

      <span className={styles.wordmark} aria-label="Cher Swan Scarlett">
        <img
          src="/images/masthead.png"
          alt="Cher Swan Scarlett"
          width="2048"
          height="335"
          decoding="async"
        />
      </span>
    </div>

    <nav className={styles.nav} aria-label="Primary navigation">
      <Link className={styles.nav__link} href="/biography">Biography</Link>
      <Link className={styles.nav__home} href="/">Front Page</Link>
      <Link className={styles.nav__link} href="/cv">CV</Link>
      <a className={styles.nav__link} href="https://orcid.org/0009-0007-8532-9874">ORCiD</a>
    </nav>
  </header>
)

export default Nav
