import React, {useEffect, useState} from 'react';
import {ethers} from 'ethers';
import {Container, Box, Typography, Button} from '@mui/material'
import {CONTRACT_ADDRESS, transformCharacterData} from '../../utils/constants';
import MyEpicGame from '../../utils/MyEpicGame.json'

//We pass in our characterNFT metadata so we can show a cool card in pur IU

const Arena = ({characterNFT}) => {
    const [gameContract, setGameContract] = useState(null);
    const [boss, setBoss] = useState(null);
    const [attackState, setAttackState] = useState('')

    useEffect(() => {
        const {ethereum} = window;

        if(ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner()
            const gameContract = new ethers.Contract(
                CONTRACT_ADDRESS,
                MyEpicGame.abi,
                signer
            )

            setGameContract(gameContract)
        } else {
            console.log('Ehtereum object noy found')
        }
    }, [])

    useEffect(() => {
        const fetchBoss = async () => {
            const bossTxn = await gameContract.getBigBoss();
            console.log('Boss: ', bossTxn)
            setBoss(transformCharacterData(bossTxn))
        }

        const onAttackComplete = (from, newBossHp, newPlayerHp) => {
            const bossHp = newBossHp.toNumber()
            const playerHp = newPlayerHp.toNumber()
            const sender = from.toString()

            console.log(`AttackComplete: Boss Hp: ${bossHp} Player Hp: ${playerHp} `)

            //If player is our own, update both player and boss Hp

            if (currentAccount === sender.toLowerCase()) {
                setBoss((prevState) => {
                    return {...prevState, hp: bossHp}
                })
                setCharacterNFT((prevState) => {
                    return {...prevState, hp: playerHp}
                })
            }

            else {
                setBoss((prevState) => {
                    return {...prevState, hp: bossHp}
                })
            }


        }

        if (gameContract) {
            fetchBoss()
            gameContract.on('AttackComplete', onAttackComplete)
        }

        return () => {
            if (gameContract) {
                gameContract.off('AttackComplete', onAttackComplete)
            }
        }

    }, [gameContract, boss])


    const runAttackAction = async () => {
        try {
            if (gameContract) {
                setAttackState('attacking');
                console.log('Attacking boss...')
                const attackTxn = await gameContract.attackBoss()
                await attackTxn.wait()
                console.log('attackTxn: ', attackTxn);
                setAttackState('hit')
            }
        } catch (error) {
            console.error('Error attacking boss: ', error)
            setAttackState('')
        }
    }

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
        }}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'nowrap',
                justifyContent: 'space-around',
                color: '#fff',
                mt: 4
            }}>
                <Typography sx={{
                    fontFamily:'Silkscreen',
                    fontSize: 24,

                }}>The enemy!</Typography>
                <Typography sx={{
                    fontFamily:'Silkscreen',
                    fontSize: 24,
                }}>You character!</Typography>

            </Box>
            <Container sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'nowrap',
                justifyContent: 'flex-start',
                alignItems: 'center'
    
            }}>
                {/* BOSS */}
                {
                    boss && (
                        <Box sx={{
                            width: '50%',
                            color:'#fff',
                            mr: 3
                        }}>
                            <Typography
                            sx={{fontSize: 24, 
                                pt: 0,
                                background: '#03418C',
                                borderRadius: '30px 30px 0px 0px'
                                }}>{boss.name}</Typography>
                            <Box sx={{
                                background: '#011228'
                            }}>
                                <img src={boss.imageURI} 
                                    alt={`Boss ${boss.name}`} 
                                    style={{width: '100%', mt: 0, width:'473px', height: '354px'}} />
                                <Box sx={{
                                    background: '#011228',
                                    
                                }}>
                                    <progress value={boss.hp} max={boss.MaxHp} />
                                    <Typography>{`${boss.hp} / ${boss.maxHp} HP`}</Typography>
                                </Box>
                            </Box>
                            <Box sx={{
                                background: '#03418C',
                                borderRadius: '0px 0px 30px 30px'
                            }}>
                                <Button 
                                    onClick={runAttackAction}
                                    sx={{color: '#fff', fontSize: 18, padding: 0}}
                                >{`💥 Attack ${boss.name}`}</Button>
                            </Box>
                        </Box>
                    )
                }
                {/* CHARACTER NFT */}
                {
                    characterNFT && (
                        <Box sx={{
                            mt: 4,
                            mb: 4,
                            color: '#fff',
                            width: '50%'
                        }}>
    
                            {/* <Typography sx={{
                                fontFamily:'Silkscreen',
                                fontSize: 24,
                                mb: 2
                            }}>You character!</Typography> */}
                            <Box sx={{
                                background: '#011228',
                                borderRadius: '30px 30px 0px 0px',
                            }}>
                                <Typography sx={{fontSize: 24, 
                                    pt: 0,
                                    background: '#03418C',
                                    borderRadius: '30px 30px 0px 0px'
                                }}>{characterNFT.name}</Typography>
                                <img 
                                    src={characterNFT.imageURI}
                                    alt={`Character ${characterNFT.game}`}
                                    style={{width:'473px', height: '354px'}}
                                />
                            </Box>
                            <Box sx={{
                                background: '#011228',
                                
                            }}>
                                <progress value={characterNFT.hp} max={characterNFT.maxHp} />
                                <Typography>{`${characterNFT.hp} / ${characterNFT.maxHp} HP`}</Typography>
                            </Box>
    
                            <Box sx={{
                                background: '#03418C',
                                borderRadius: '0px 0px 30px 30px'
                            }}>
                                <Typography
                                    sx={{
                                        fontSize: 18
                                    }}
                                >{`⚔️ Attack Damage: ${characterNFT.attackDamage}`}</Typography>
                            </Box>
                        </Box>
                    )
                }
            </Container>
        </Box>


    )
}

export default Arena;