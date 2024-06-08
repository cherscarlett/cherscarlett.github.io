import './globals.scss'
import type { AppProps } from 'next/app'

import { store } from '../../app/store'
import { Provider } from 'react-redux'

function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
}

export default App
