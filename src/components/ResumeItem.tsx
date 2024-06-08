import React, { FunctionComponent } from 'react'
import styles from './ResumeItem.module.scss'

export type Role = {
    title: string,
    subtitle: string,
    dates: string
}

interface Props {
    role: Role
}

const ResumeItem: FunctionComponent<Props> = ({role}) => {
  return (
    <div className={styles.resume__item}>
        <h2>{role.title}</h2>
        <div className={styles.resume__item__metadata}>
            <span>{role.subtitle}</span>
            <span>{role.dates}</span>
        </div>
    </div>
  )
}

export default ResumeItem
