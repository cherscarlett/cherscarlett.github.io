import classnames from 'classnames'
import type { NextPage } from 'next'
import type {Content} from './api/content'
import { home } from './api/content'
import Head from 'next/head'
import Nav from '../components/Nav'
import Stars from '../components/Stars'
import HorizontalRule from '../components/HorizontalRule'
import Loader from '../components/Loader'
import styles from './index.module.scss'


export async function getServerSideProps() {

  return { props: { home } }
}

interface Props {
  home: Content
}


const Home: NextPage<Props> = (props) => {
  const {home: content} = props

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
              <a className={styles.social__link} href="https://twitter.com/cherthedev">Twitter</a>,
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
          <Stars />
        </div>) : (<Loader />) }
    </>
  )
}

export default Home

// export const config = {
//   runtime: 'experimental-edge',
// }
