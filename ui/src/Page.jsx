import React from 'react'

import Contents from './Contents.jsx'

const NavBar = () => (
  <nav>
    <a href="/">Home</a>
    {' | '}
    <a href="/#/issues">Issue List</a>
    {' | '}
    <a href="/#/report">Report</a>
  </nav>
)

const Page = () => (
  <div>
    <NavBar />
    <Contents />
  </div>
)

export default Page
