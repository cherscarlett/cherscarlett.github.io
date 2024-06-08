import React, { FunctionComponent } from 'react'
import styles from './Loader.module.scss'

const Loader: FunctionComponent = () => (
  <div className={styles.loader__container}>
    <div className={styles.loader} />
  </div>
)

export default Loader
