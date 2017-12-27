const API_URL = 'https://oswils44oj.execute-api.us-east-1.amazonaws.com/production/';
const GITHUB_CLIENT_ID = '4d355e2799cb8926c665';

function checkResult(result) {
    if ( !result ) throw new Error('No result received');
    if ( result.errorMessage ) throw new Error(result.errorMessage);

    return result;
}

export function isLoginActive() {
    return /^\?code=([^&]*)&state=([^&]*)/.test(window.location.search);
}

export function startLogin(url = '') {
    let state = '' + Math.random();

    if ( url.includes('webpack.js.org') ) {
        window.localStorage.githubState = state;
        window.location = 'https://github.com/login/oauth/authorize?client_id=' + GITHUB_CLIENT_ID + '&scope=user:email&state=' + state + '&allow_signup=false&redirect_uri=' + encodeURIComponent(url);

    } else alert(
        'You can\'t login with GitHub OAuth on localhost. Please pass the ' +
        '`development` prop to the `Wrapper` in order to use `api.dev`.'
    );

    return Promise.resolve();
}

export function continueLogin() {
    const match = /^\?code=([^&]*)&state=([^&]*)/.exec(window.location.search);

    if ( match ) {
        return login(match[1], match[2]).then(result => {
            setTimeout(() => {
                let href = window.location.href;
                window.location = href.substr(0, href.length - window.location.search.length);
            }, 100);

            return result;
        });
    }

    return Promise.resolve();
}

function login(code, state) {
    if ( state !== window.localStorage.githubState ) {
        return Promise.reject(new Error('Request state doesn\'t match (Login was triggered by 3rd party)'));

    } else {
        delete window.localStorage.githubState;

        return fetch(API_URL + '/login', {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    code,
                    state
                })
            })
            .then((res) => res.json())
            .then(checkResult).then(result => {
                if (!result.token) throw new Error('No token received from API');

                return result.token;
            });
    }
}

export function getSelf(token) {
    return fetch(`${API_URL}/self?token=${token}`, {
            mode: 'cors'
        })
        .then((res) => res.json())
        .then(checkResult);
}

export function getList(token, name = 'todo') {
    return fetch(`${API_URL}/list/${name}` + (token ? `?token=${token}` : ''), {
            mode: 'cors'
        })
        .then((res) => res.json())
        .then(checkResult);
}

export function createItem(token, list = 'todo', title, description) {
    return fetch(`${API_URL}/list/${list}?token=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                description
            })
        })
        .then((res) => res.json())
        .then(checkResult);
}

export function vote(token, itemId, voteName, value) {
    return fetch(`${API_URL}/vote/${itemId}/${voteName}?token=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                count: value
            })
        })
        .then((res) => res.json())
        .then(checkResult)
        .then(result => true);
}

export function configItem(token, itemId, config) {
    return fetch(`${API_URL}/config/${itemId}?token=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                config: config
            })
        })
        .then((res) => res.json())
        .then(checkResult).then(result => true);
}
