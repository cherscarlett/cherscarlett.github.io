import React, { FunctionComponent } from 'react'
import Link from 'next/link'
import styles from './Nav.module.scss'

const Nav: FunctionComponent = () => (
    <nav className={styles.nav}>
      <Link href="/">
        <a className={styles.nav__link}>Biography</a>
      </Link>
    </nav> 
)

export default Nav
