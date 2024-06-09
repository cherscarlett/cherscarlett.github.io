import React, { FunctionComponent } from 'react'
import Link from 'next/link'
import styles from './Nav.module.scss'

const Nav: FunctionComponent = () => (
    <nav className={styles.nav}>
      <Link className={styles.nav__link} href="/cv">
        resume
      </Link>
      <Link href="/" className={styles.nav__home}>
        Home
      </Link>
      <Link className={styles.nav__link} href="/biography">
        biography
      </Link>
    </nav> 
)

export default Nav
