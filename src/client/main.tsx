import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Card from './pages/Card'

// Hydrate the server-rendered HTML
const container = document.getElementById('root')!
ReactDOM.hydrateRoot(container, <Card />)
