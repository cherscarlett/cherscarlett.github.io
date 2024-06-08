import classnames from "classnames";
import React, { FunctionComponent } from 'react'
import styles from './HorizontalRule.module.scss'

const HorizontalRule: FunctionComponent = () => (
    <div className={styles.hr__container}>
        <div className={classnames(
            styles.hr,
            styles.hr1
        )} 
        />
        <div className={classnames(
            styles.hr,
            styles.hr2
        )} 
        />
    </div>
)

export default HorizontalRule
