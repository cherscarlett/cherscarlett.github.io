import React, { FunctionComponent } from 'react'
import Link from 'next/link'
import styles from './Nav.module.scss'

const Nav: FunctionComponent = () => (
    <nav className={styles.nav}>
      <Link href="/" className={styles.nav__home}>
        Home
      </Link>
      <Link className={styles.nav__link} href="/biography">
        Biography
      </Link>
    </nav> 
)

export default Nav
