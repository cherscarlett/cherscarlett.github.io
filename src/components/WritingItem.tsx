import React, { FunctionComponent } from 'react'
import styles from './WritingItem.module.scss'

export type Prose = {
    title: string,
    subtitle: string,
    publisher: string,
    url: string,
    image: string,
    year: string
}

interface Props {
    prose: Prose
}

const WritingItem: FunctionComponent<Props> = ({prose}) => {
  return (
    <div className={styles.writing__item}>
        <h2><a href={prose.url}>{prose.title}</a></h2>
        <h3>{prose.subtitle}</h3>
        <div className={styles.writing__item__metadata}>
            <span>{prose.publisher}</span>
            <span>{prose.year}</span>
        </div>
    </div>
  )
}

export default WritingItem
