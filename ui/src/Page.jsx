import React from 'react'
import { NavLink } from 'react-router-dom'

import Contents from './Contents.jsx'

const NavBar = () => (
  <nav>
    <NavLink exact to="/">
      Home
    </NavLink>
    {' | '}
    <NavLink to="/issues">Issue List</NavLink>
    {' | '}
    <NavLink to="/report">Report</NavLink>
  </nav>
)

const Page = () => (
  <div>
    <NavBar />
    <Contents />
  </div>
)

export default Page
