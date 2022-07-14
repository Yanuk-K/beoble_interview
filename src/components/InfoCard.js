import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { Tooltip } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import Paper from '@mui/material/Paper'
import { ethers } from 'ethers'
import './Card.css'

function InfoCard() {
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

  const signMessage = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()

    const rawSig = await signer.signMessage('Hi')
    const signerPublicKey = await signer.getAddress()

    setHash(rawSig)
    setPublicKey(signerPublicKey)
    console.log('Hash:', rawSig)
  }

  useEffect(() => {
    checkIfWalletIsConnected()
  }, [])

  return (
    <div className="d-flex">
      <Card
        sx={{ display: 'flex', width: '70%', height: '70%' }}
        className="center"
      >
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
              <Box display="flex" alignItems="center" flexDirection="column">
                <Grid
                  container
                  spacing={2}
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Grid item xs>
                    <Paper elevation={2}>
                      <Typography variant="body1">
                        Connected Chain ID: <>{currentChainId}</>
                      </Typography>
                    </Paper>
                  </Grid>
                  {ENSAddress != NULL_ADDRESS && (
                    <Box>
                      <Grid item xs>
                        <Paper elevation={2}>
                          <Avatar src={ENSAvatar} />
                        </Paper>
                      </Grid>
                      <Grid item xs>
                        <Paper elevation={2}>
                          <Typography variant="body1">
                            <>{ENSAddress}</>
                          </Typography>
                        </Paper>
                      </Grid>
                    </Box>
                  )}
                  <Grid item xs>
                    <Paper elevation={2}>
                      <Typography variant="body1">
                        <>{currentAccount}</>
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs>
                    <Paper elevation={2}>
                      <Typography variant="body1">
                        Balance: <>{accountBalance}</> ETH
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>

                <Box display="flex" alignItems="center" flexDirection="row">
                  <Grid
                    container
                    spacing={2}
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Grid item xs>
                      <Tooltip title="Disconnect" arrow>
                        <Button
                          variant="contained"
                          sx={{
                            borderRadius: 28,
                            border: 1,
                            borderColor: '#A7A5C6',
                          }}
                          onClick={disconnectWallet}
                        >
                          Disconnect
                        </Button>
                      </Tooltip>
                    </Grid>
                    <Grid item xs>
                      <Button
                        variant="contained"
                        sx={{
                          borderRadius: 28,
                          border: 1,
                          borderColor: '#A7A5C6',
                        }}
                        onClick={signMessage}
                      >
                        Sign Message
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
                {hash && (
                  <Grid
                    container
                    spacing={2}
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Grid item xs>
                      <Paper elevation={2}>
                        <Typography
                          style={{
                            width: '300px',
                            wordWrap: 'break-word',
                            display: 'inline-block',
                          }}
                        >
                          Signed Hash: {hash}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs>
                      <Paper elevation={2}>
                        <Typography
                          style={{
                            width: '300px',
                            wordWrap: 'break-word',
                            display: 'inline-block',
                          }}
                        >
                          Public Key of Signer: {publicKey}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                )}
              </Box>
            </Box>
          )}
        </div>
      </Card>
    </div>
  )
}

export default InfoCard
