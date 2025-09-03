import React from 'react'
import ReactDOM from 'react-dom/client'
import Wrapper from './pages/Wrapper'

// Hydrate the server-rendered HTML
const container = document.getElementById('root')!
ReactDOM.hydrateRoot(container, <Wrapper />)
