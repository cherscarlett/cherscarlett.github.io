import classnames from 'classnames'
import type { NextPage } from 'next'
import type { Content } from './api/content'
import { cv } from './api/content'
import roles from './api/roles'
import Head from 'next/head'
import Nav from '../components/Nav'
import Stars from '../components/Stars'
import Loader from '../components/Loader'
import HorizontalRule from '../components/HorizontalRule'
import styles from './cv.module.scss'

export async function getStaticProps() {

  return { props: { cv } }
}

interface Props {
    cv: Content
}

const Cv: NextPage<Props> = (props) => {
  const {cv: content} = props

  return (
    <>
      <Head>
        <title>Cher Scarlett - Curriculum Vitae</title>
      </Head>
      <Nav />
    { content && roles ? 
        (<div className={classnames('content', styles.content__resume)}>
        <h1>{content.heading}</h1>
        <a className={styles.social__link} href="https://www.linkedin.com/in/cherscarlett">LinkedIn</a> | <a href="/documents/cher_scarlett_cv_2024.pdf" target="_blank">PDF</a>
        <Stars />
    </div>) : (<Loader />)}
    </>
  )
}

export default Cv
