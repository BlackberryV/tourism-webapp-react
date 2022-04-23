import React from 'react';

const Footer = () => {
    const year = new Date();
    return (
        <div>
            <footer className='footer'>
                <div>
                    <div className="footer-date">© 2021 - {year.getFullYear()}</div>
                </div>
                <nav className="footer-nav">
                    <div className="creators-title">Creators: </div>
                    <a href="https://github.com/venomusss" target="_blank" className="creator-link">Volodymyr</a>
                    <a href="https://github.com/BlackberryV" target="_blank" className="creator-link">Viktoriia</a>
                    <a href="https://github.com/abcbbxhdhd" target="_blank" className="creator-link">Anton</a>
                </nav>
            </footer>
        </div>
    );
};

export default Footer;