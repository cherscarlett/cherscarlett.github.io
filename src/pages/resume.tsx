import classnames from 'classnames'
import type { NextPage } from 'next'
import type { Content } from './api/content'
import { resume } from './api/content'
import roles from './api/roles'
import Head from 'next/head'
import Nav from '../components/Nav'
import Stars from '../components/Stars'
import Loader from '../components/Loader'
import type { Role } from '../components/ResumeItem'
import ResumeItem from '../components/ResumeItem'
import styles from './resume.module.scss'

export async function getServerSideProps() {

  return { props: { resume, roles } }
}

interface Props {
  resume: Content,
  roles: Role[]
}

const Resume: NextPage<Props> = (props) => {
  const {resume: content, roles} = props

  return (
    <>
      <Head>
        <title>Cher Scarlett - Software Engineer & Memoirist - Resume</title>
      </Head>
      <Nav />
    { content && roles ? 
        (<div className={classnames('content', styles.content__resume)}>
        <h1>{content.heading}</h1>
        {roles.map((role, index: number) => (<ResumeItem role={role} key={index} />))}
        <Stars />
    </div>) : (<Loader />)}
    </>
  )
}

export default Resume
