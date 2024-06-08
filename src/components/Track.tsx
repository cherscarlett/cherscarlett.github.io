import React, { FunctionComponent } from 'react'
import Stars from './Stars'
import styles from './Track.module.scss'

interface Image {
    url: string
}

interface Artist {
    name: string
}

interface Album {
    images: Image[]
}

export type TrackType = {
    name: string,
    id: string,
    artists: Artist[],
    album: Album
}

interface Props {
    track: TrackType
}

const Tracks: FunctionComponent<Props> = ({track}) => {
  const {name, id} = track
  const artists = track.artists.map(artist => artist.name).join(', ')
  const image = track.album.images[1]

  return (
    <div className={styles.track}>
        <a className={styles.track__link} href={`https://open.spotify.com/track/${id}`}>
            <img src={image.url} width='100%' alt={`Album artwork for ${name} from Spotiy`} />
            <div className={styles.track__metadata}>
                <span className={styles.track__metadata__text}>{ artists }</span>
                <span className={styles.track__metadata__text}>{ name }</span>
            </div>
       </a>
       <Stars />
    </div>
  )
}

export default Tracks

export const config = {
    runtime: 'experimental-edge',
}
