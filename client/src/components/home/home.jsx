import React, {useEffect, useState} from 'react';
import TwitterIcon from '@mui/icons-material/Twitter';
import { Typography, Container, Box, Button, ThemeProvider} from '@mui/material';
import SelectCharacter from '../selectCharacter/selectCharacter';
import MyEpicGame from '../../utils/MyEpicGame.json';
import {CONTRACT_ADDRESS, transformCharacterData} from '../../utils/constants'
import {ethers} from 'ethers';
import Arena from '../arena/arena'
import './styles/index.css'

// const CONTRACT_ADDRESS = '0x5fd8d19876E3DB6fb14c7f848d659be6496cdb9F'


const Home = () => {

    const [currentAccount, setCurrentAccount] = useState(null);
    const [characterNFT, setCharacterNFT] = useState(null);
    const [isLoading, setIsLoading] = useState(null)
    // console.log('CHARACTER', characterNFT)

    const checkIfWalletIsConnected = async () => {
        const {ethereum} = window;
        
        if (!ethereum) {
            console.log('Make sure you have MetaMask')
            return;
        } else {
            console.log('We have the ehereum object', ethereum)
        }

        const accounts = await ethereum.request({ method: 'eth_accounts' });

        if (accounts.length !== 0) {
            const account = accounts[0]
            console.log('Found an authorized account: ', account)
            setCurrentAccount(account)

        } else {
            console.log('No authorized account found')
        }
    }

    const connectWalletAction = async () => {
        try {
            
            const { ethereum } = window;
            
            if(!ethereum) {
                alert ('Get MetaMask')
                return;
            }

            const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

            // console.log('Connected', accounts[0])
            setCurrentAccount(accounts[0])

        } catch (error) {
            console.log(error)
        }
    }

    const renderContent = () => {
        // console.log('PASE')
        if (!currentAccount) {
            return (
                <Container 
                    sx={{
                    pt:1, 
                    pb: 1,
                    mb: 5,
                    display:'flex',
                    flexDirection:'column',
                    flexWrap:'nowrap',
                    justifyContent:'center',
                    alignItems:'center'
                }}>
                    <img 
                        src="https://64.media.tumblr.com/tumblr_mbia5vdmRd1r1mkubo1_500.gifv"
                        alt="Monty Python Gif"
                        className='img-gift'
                    />
                    <Button
                        variant='outlined'
                        onClick={connectWalletAction}
                    >Connect Wallet To Get Started</Button>
                </Container>
            )
        } else if (currentAccount && !characterNFT) {
            return <SelectCharacter setCharacterNFT={setCharacterNFT} />
        } else if (currentAccount && characterNFT ) {
            return <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} />
        }
    }

    useEffect(() => {
        setIsLoading(true)
        checkIfWalletIsConnected()
        const checkNetwork = async () => {
            try {
                if(window.ethereum.networkVersion !== '4') {
                    // console.log('NETWORK VERSION', window.ethereum.networkVersion)
                    alert ("Please connect to Rinkeby")
                }
            } catch (error) {
                console.log(error)
            }
        }
        checkNetwork()


    }, [])


    useEffect(() => {
        const fetchNFTMetadata = async () => {
            // console.log('Checking for Character NFT on Address: ', currentAccount);

            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const gameContract = new ethers.Contract(
                CONTRACT_ADDRESS,
                MyEpicGame.abi,
                signer
            );
            const txn = await gameContract.checkIfUserHasNFT()
            // console.log('SOY TXN', txn)
            if(txn.name) {
                console.log('User has character NFT')
                setCharacterNFT(transformCharacterData(txn))
            } else {
                console.log('No character NFT found')
            }

            setIsLoading(false)
        }

        if (currentAccount) {
            // console.log('CurrentAccount: ', currentAccount)
            fetchNFTMetadata()
        }
    }, [currentAccount])



    return (
        <Container
            sx={{
                mt:5
            }}

        >
            <Box>
                <Box>
                    <Typography sx={{
                        color:'#fff',
                        fontSize: 28,
                        width: '100%',
                        heigth: '100%'

                        }}>⚔️ Metaverse Slayer ⚔️</Typography>
                    <Typography sx={{color:'#fff'}}>Team up to connect the Metaverse!</Typography>
                </Box>
                    {
                        <Box>
                            {renderContent()}
                        </Box>

                    }

            </Box>
        </Container>

    )
}


export default Home;