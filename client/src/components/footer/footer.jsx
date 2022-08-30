import TwitterIcon from '@mui/icons-material/Twitter'
const TWITTER_LINK = 'https://twitter.com/laumansillaa';



const Footer = () => {
    return (
        <footer
            style={{marginTop: '2rem'}}>
            <TwitterIcon color='primary'/>
            <a href={TWITTER_LINK} target='_blank' rel='noreferrer' style={{color:'#fff', textDecoration: 'none'}}>{`Build with @laumansillaa`}</a>
        </footer>
    )
}

export default Footer;