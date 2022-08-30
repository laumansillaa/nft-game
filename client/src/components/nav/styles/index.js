import { red } from '@mui/material/colors';
import {createTheme} from '@mui/material/styles';
import {styled} from '@mui/material'

export const styledTypography = createTheme({
    typography: {
        color: '#fff',
        fontSize: 24,
        fontFamily: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
        ].join(','),
      }
})


