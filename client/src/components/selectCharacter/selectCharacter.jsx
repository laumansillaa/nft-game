import React, {useState, useEffect} from 'react';
import { Container, Box, Typography, Button } from '@mui/material'
import {ethers} from 'ethers';
import {CONTRACT_ADDRESS, transformCharacterData} from '../../utils/constants'
import MyEpicGame from '../../utils/MyEpicGame.json'

const SelectCharacter = ({setCharacterNFT}) => {
    
    const [characters, setCharacters] = useState([])
    const [gameContract, setGameContract] = useState(null)

    console.log( 'GameCONTRCAT' ,gameContract)

    useEffect(() => {

        const {ethereum} = window;

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum)
            const signer = provider.getSigner()
            const gameContract = new ethers.Contract(
                CONTRACT_ADDRESS,
                MyEpicGame.abi,
                signer
            )
            setGameContract(gameContract);
        } else {
            console.log('Ethereum object not found')
        }

    }, [])


    useEffect(() => {
        const getCharacters = async () => {
          try {
            console.log('Getting contract characters to mint');
      
            const charactersTxn = await gameContract.getAllDefaultCharacters();
            console.log('charactersTxn:', charactersTxn);
      
            const characters = charactersTxn.map((characterData) =>
              transformCharacterData(characterData)
            );
      
            setCharacters(characters);
          } catch (error) {
            console.error('Something went wrong fetching characters:', error);
          }
        };
      
        /*
         * Add a callback method that will fire when this event is received
         */
        const onCharacterMint = async (sender, tokenId, characterIndex) => {
            console.log('ENTRE')
          console.log(
            `CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`
          );
      
          /*
           * Once our character NFT is minted we can fetch the metadata from our contract
           * and set it in state to move onto the Arena
           */
          if (gameContract) {
            const characterNFT = await gameContract.checkIfUserHasNFT();
            console.log('CharacterNFT: ', characterNFT);
            setCharacterNFT(transformCharacterData(characterNFT));
          }
        };
      
        if (gameContract) {
          getCharacters();
      
          /*
           * Setup NFT Minted Listener
           */
          gameContract.on('CharacterNFTMinted', onCharacterMint);
        }
      
        return () => {
          /*
           * When your component unmounts, let;s make sure to clean up this listener
           */
          if (gameContract) {
            gameContract.off('CharacterNFTMinted', onCharacterMint);
          }
        };
      }, [gameContract]);

    // console.log('GAME CONTRACT', gameContract)
    const mintCharacterNFTAction = async (characterId) => {
        try {
            if (gameContract) {
                console.log('Minting character in progress...');
                const mintTxn = await gameContract.minCharacterNFT(characterId)
                await mintTxn.wait();
                console.log('mintTxn: ', mintTxn)
            }
        } catch (error) {
            console.error('MintCharacterAction Error: ', error)
        }
    }

    return (
        <Container sx={{
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          justifyContent: 'flex-start',
          alignItems: 'center',
          mt: 5

        }}>
            <Box sx={{
              mb: 3
            }}>
                <Typography sx={{
                  fontFamily: 'Silkscreen',
                  fontSize: 30
                }}>Mint Your Hero. Choose wisely</Typography>
            </Box>  
            {

                characters.map((character, index) => (
                    <Box key={index}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        flexWrap: 'nowrap',
                        justifyContent: 'center',
                        mt: 2,
                        mb: 2,
                        width: '50%'
                      }}
                    >
                        <Box>
                            <Typography
                            sx={{
                              fontSize: 24,
                              background: '#03418C',
                              borderRadius: '30px 30px 0px 0px'
                            }}>{character.name}</Typography>
                        </Box>
                        <img src={character.imageURI} 
                          alt={character.name}
                          />
                        <Button
                            onClick={() => mintCharacterNFTAction(index)}
                            sx={{
                              background: '#03418C',
                              color: '#fff',
                              borderRadius: '0px 0px 30px 30px'
                        }}>{`Mint ${character.name} 🛠️​`}
                        </Button>
                    </Box>
                ))
            }

        </Container>

    )
}

export default SelectCharacter;