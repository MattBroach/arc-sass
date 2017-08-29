import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Helmet from 'react-helmet'

import { HomePage, NotFoundPage } from 'components'

const App = () => {
  return (
    <div>
      <Helmet titleTemplate="ARc - %s">
        <title>ARc Starter Kit</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Facebook meta tags */}
        <meta property="og:site_name" content="" />
        <meta property="og:image" content="" />
        <meta property="og:image:type" content="" />
        <meta property="og:image:width" content="" />
        <meta property="og:image:height" content="" />

        {/* Twitter meta tags */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="" />
        <meta name="twitter:title" content="" />
        <meta name="twitter:description" content="" />
        <meta name="twitter:image" content="" />

        <link rel="icon" href="images/favicon.png" />
      </Helmet>
      <Switch>
        <Route path="/" component={HomePage} exact />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  )
}

export default App
