import React from 'react';

const oauthLink = 'https://www.reddit.com/api/v1/authorize?client_id=lc3vtl-uKhFj8A&response_type=code&state=ok&redirect_uri=http://localhost:3000/saved&duration=temporary&scope=history';

function Home(props) {
    return (
        <div id="home-container" className="home-container">
            <button><a href={oauthLink}>Log in</a></button>
        </div>
    );
}

export default Home;
