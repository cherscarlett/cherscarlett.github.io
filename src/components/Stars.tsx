import classnames from "classnames";
import React, { FunctionComponent } from 'react'
import styles from './Stars.module.scss'

const Stars: FunctionComponent = () => (
    <>
        <div className={classnames(
              styles.star,
              styles.star1
            )} />
        <div className={classnames(
              styles.star,
              styles.star2
            )} />
        <div className={classnames(
              styles.star,
              styles.star3
            )} />
        <div className={classnames(
              styles.star,
              styles.star4
            )} />
    </>
)

export default Stars