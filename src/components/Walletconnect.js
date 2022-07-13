import React, { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

function ConnectButton() {
    const [currentAccount, setCurrentAccount] = useState("");

    const checkIfWalletIsConnected = async () => {
        try {
        const { ethereum } = window;

        if (!ethereum) {
            console.log("Make sure you have metamask!");
        return;
        } else {
            console.log("We have the ethereum object", ethereum);
        }

        const accounts = await ethereum.request({ method: "eth_accounts" });

        if (accounts.length !== 0) {
            const account = accounts[0];
            console.log("Found an authorized account:", account);
            setCurrentAccount(account);
        } else {
            console.log("No authorized account found")
        }
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Implement your connectWallet method here
     */
    const connectWallet = async () => {
        try {
        const { ethereum } = window;

        if (!ethereum) {
            alert("Get MetaMask!");
            return;
        }

        const accounts = await ethereum.request({ method: "eth_requestAccounts" });

        console.log("Connected", accounts[0]);
        setCurrentAccount(accounts[0]);
        } catch (error) {
        console.log(error)
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected();
    }, [])

    return (
        <Box display="flex" alignItems="center" borderRadius="xl" py="0">
            {!currentAccount && (
                <Button variant="contained" sx={ { borderRadius: 28, border: 1, borderColor: '#A7A5C6' } } onClick={connectWallet}>
                    Connect Wallet
                </Button>
            )}
            {currentAccount && (
                <Button variant="contained" sx={ { borderRadius: 28, border: 1, borderColor: '#A7A5C6' } }>
                    {currentAccount &&
                        `${currentAccount.slice(0, 6)}...${currentAccount.slice(
                        currentAccount.length - 4,
                        currentAccount.length
                    )}`}
                </Button>
            )}
        </Box>
    );
}

export default ConnectButton;