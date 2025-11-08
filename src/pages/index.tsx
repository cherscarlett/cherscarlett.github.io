import classnames from 'classnames'
import type { NextPage } from 'next'
import type {Content} from './api/content'
import { home } from './api/content'
import Head from 'next/head'
import Nav from '../components/Nav'
import Stars from '../components/Stars'
import Loader from '../components/Loader'
import styles from './index.module.scss'
import { useState } from 'react'


export async function getStaticProps() {

  return { props: { home } }
}

interface Props {
  home: Content
}


const Home: NextPage<Props> = (props) => {
  const {home: content} = props

  const [pbd, setPbd] = useState(false)

  return (
    <>
      <Head>
        <title>Cher Scarlett</title>
      </Head>
      <Nav />
      {content ? (
        <div className={classnames('content', styles.content__home)}>
          <h1>{ content.heading }</h1>
          <div>
            { content.paragraphs?.map((paragraph: string, index) => (<p key={index}>{ paragraph }</p>)) }
            <p>
              Follow me on&nbsp;
              <a className={styles.social__link} href="https://cher.blue">Bluesky</a>,
              &nbsp;
              <a className={styles.social__link} href="https://github.com/cherscarlett">Github</a>,
              or&nbsp;
              <a className={styles.social__link} href="https://www.linkedin.com/in/cherscarlett">LinkedIn</a>.
            </p>
            <p>
              Reach me at&nbsp;
              <a className={styles.social__link} href="mailto:hello@cher.dev">hello@cher.dev</a>.
            </p>
          </div>
          <div title="That's here. That's home. That's us." className={styles.content__pbd} onClick={() => setPbd(!pbd)} />
          {pbd ? 
            (<div className={styles.content__sagan}>
              <iframe width="100%" src="https://www.youtube.com/embed/GO5FwsblpT8?si=xkYXjbJfppNUekWB" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
              <div className={styles.content__close} onClick={() => setPbd(false)} />
            </div>) : ''}
          <Stars />
        </div>) : (<Loader />) }
    </>
  )
}

export default Home
