import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { Tooltip } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { ethers } from 'ethers'
import './Card.css'

function Card() {
  const [currentAccount, setCurrentAccount] = useState('')
  const [currentChainId, setCurrentChainId] = useState('')
  const [ENSAddress, setENSAddress] = useState('')
  const [ENSAvatar, setENSAvatar] = useState('')
  const [accountBalance, setAccountBalance] = useState('')
  const [publicKey, setPublicKey] = useState('')
  const [hash, setHash] = useState('')
  const NULL_ADDRESS = 0x0000000000000000000000000000000000000000

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window

      if (!ethereum) {
        console.log('Make sure you have metamask!')
        return
      } else {
        console.log('We have the ethereum object', ethereum)
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' })

      if (accounts.length !== 0) {
        const account = accounts[0]
        console.log('Found an authorized account:', account)
        setCurrentAccount(account)
        getAccountData(account)
      } else {
        console.log('No authorized account found')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const connectWallet = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const accounts = await provider.send('eth_requestAccounts', [])
    setCurrentAccount(accounts[0])
  }

  const disconnectWallet = async () => {
    setCurrentAccount('')
    console.log('Disconnected')
  }

  const getAccountData = async (account) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const network = await provider.getNetwork()
    const ENS = await provider.lookupAddress(account)
    const avatar = await provider.getAvatar(ENSAddress)
    const balance = await provider.getBalance(account)

    setCurrentChainId(network.chainId)
    ENS ? setENSAddress(ENS) : setENSAddress(NULL_ADDRESS)
    avatar ? setENSAvatar(avatar) : setENSAvatar('')
    setAccountBalance(ethers.utils.formatEther(balance))
  }

  const signMessage = async (message) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()

    const rawSig = await signer.signMessage(message)
  }

  useEffect(() => {
    checkIfWalletIsConnected()
  }, [])

  return (
    <div className="d-flex">
      <div className="center">
        {!currentAccount && (
          <Box display="flex" alignItems="center">
            <Button
              variant="contained"
              sx={{ borderRadius: 28, border: 1, borderColor: '#A7A5C6' }}
              onClick={connectWallet}
            >
              Connect Wallet
            </Button>
          </Box>
        )}
        {currentAccount && (
          <Box>
            <Box>
              <Typography variant="body1">
                Connected Chain ID: <>{currentChainId}</>
              </Typography>
              {ENSAddress != NULL_ADDRESS && (
                <Box>
                  <Avatar src={ENSAvatar} />
                  <Typography variant="body1">
                    <>{ENSAddress}</>
                  </Typography>
                </Box>
              )}
              <Typography variant="body1">
                <>{currentAccount}</>
              </Typography>
              <Typography variant="body1">
                <>{accountBalance}</> ETH
              </Typography>
            </Box>
            <Tooltip title="Disconnect" arrow>
              <Button
                variant="contained"
                sx={{ borderRadius: 28, border: 1, borderColor: '#A7A5C6' }}
                onClick={disconnectWallet}
              >
                Disconnect
              </Button>
            </Tooltip>
          </Box>
        )}
      </div>
    </div>
  )
}

export default Card
