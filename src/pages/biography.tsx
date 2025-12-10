import classnames from 'classnames'
import type { NextPage } from 'next'
import type { Content } from '../api/content'
import { biography } from '../api/content'
import roles from '../api/roles'
import Head from 'next/head'
import Nav from '../components/Nav'
import Stars from '../components/Stars'
import Loader from '../components/Loader'
import HorizontalRule from '../components/HorizontalRule'
import styles from './biography.module.scss'

export async function getStaticProps() {

  return { props: { biography } }
}

interface Props {
    biography: Content
}

const Biography: NextPage<Props> = (props) => {
  const {biography: content} = props

  return (
    <>
      <Head>
        <title>Cher Scarlett - Biography</title>
      </Head>
      <Nav />
    { content && roles ? 
        (<div className={classnames('content', styles.content__biography)}>
        <h1>{content.heading}</h1>
        { content.paragraphs?.map((paragraph: string, index) => (<p key={index}>{ paragraph }</p>)) }
        <HorizontalRule />
        <h2>{content.heading_2}</h2>
        { content.paragraphs_2?.map((paragraph: string, index) => (<p key={index}>{ paragraph }</p>)) }
        <HorizontalRule />
        <h2>{content.heading_3}</h2>
        { content.paragraphs_3?.map((paragraph: string, index) => (<p key={index}>{ paragraph }</p>)) }
        {/* <HorizontalRule /> */}
        {/* <h2>{content.heading_4}</h2>
        { content.paragraphs_4?.map((paragraph: string, index) => (<p key={index}>{ paragraph }</p>)) } */}
        <Stars />
    </div>) : (<Loader />)}
    </>
  )
}

export default Biography
