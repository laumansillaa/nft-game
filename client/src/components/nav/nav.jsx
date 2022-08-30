import React from "react";
import { Container, Box, Typography } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import './styles/index.css'

const Nav = () => {
    

    return (    

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'space-around',
                    
                }}
            >
                <Typography sx={{
                    color: '#fff',
                    fontSize: 40,
                    fontFamily: 'silkscreen'
                    }}
                    className='title'

                >
                    Crypto-Game
                </Typography>
                <a href='https://www.github.com/laumansillaa/nft-game' target='_blank' style={{textDecoration: 'none', color: '#fff'}}>
                    <GitHubIcon sx={{fontSize:40, mt:1}} />   
                </a>

            </Box>

    )
}


export default Nav;