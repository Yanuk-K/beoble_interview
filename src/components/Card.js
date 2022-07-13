import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import ConnectButton from './Walletconnect'
import './Card.css'

function Card() {
  return (
    <div className="d-flex">
      <div className="center">
        <Box>
          <ConnectButton />
        </Box>
      </div>
    </div>
  )
}

export default Card
