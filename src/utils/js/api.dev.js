let usedCurrencies = {
    influence: 100,
    goldenInfluence: 100
};

let totalCurrencies = {
    influence: 1000,
    goldenInfluence: 300
};

let lists = {
    todo: {
        possibleVotes: [
            {
                name: 'influence',
                currency: 'influence',
                score: 1,
                color: 'blue'
            },
            {
                name: 'golden',
                currency: 'goldenInfluence',
                score: 100,
                color: '#bfa203'
            }
        ],
        items: [
            { 
                id: '1234', 
                list: 'todo', 
                title: 'Some Feature', 
                description: 'Mauris et sem a risus pharetra suscipit. Fusce gravida purus non nisi pulvinar, non lobortis tortor vehicula. Mauris at dui a ex vestibulum condimentum id sit amet nisl. Nam finibus ornare laoreet. Duis ultrices sollicitudin quam eu vulputate. Sed ac ante odio. Mauris fermentum vel tortor sit amet iaculis.', 
                influence: 15 
            },
            { 
                id: '2345', 
                list: 'todo', 
                title: 'Review Stuff', 
                description: 'Cras libero libero, elementum eu laoreet nec, convallis sit amet sem. Donec ut diam dignissim, hendrerit ante id, congue felis. In hac habitasse platea dictumst. Donec sit amet tellus et neque auctor consequat. Cras porta finibus turpis, id auctor lectus.', 
                golden: 20 
            },
            { 
                id: '3456', 
                list: 'todo', 
                title: 'Another Feature', 
                description: 'Curabitur pharetra facilisis mauris. Integer interdum venenatis metus quis dictum. Cras aliquet erat ut risus vestibulum, sed tincidunt enim maximus. Cras tincidunt vulputate ante vitae tincidunt. Cras quis erat eu augue aliquam pretium nec sit amet magna. Etiam nisi nunc, blandit vel hendrerit et, suscipit finibus nunc.', 
                golden: 20 
            }
        ]
    }
};

let allItems = {
    '1234': lists.todo.items[0],
    '2345': lists.todo.items[1],
    '3456': lists.todo.items[2]
};

function delay(time) {
    return new Promise(function (fulfill) {
        setTimeout(fulfill, time);
    });
}

function clone(json) {
    return JSON.parse(
        JSON.stringify(json)
    );
}

export function isLoginActive() {
    return /^\?login=/.test(window.location.search);
}

export function startLogin(callbackUrl) {
    window.location.search = '?login=' + encodeURIComponent(callbackUrl);
    return Promise.resolve();
}

export function continueLogin() {
    if ( /^\?login=/.test(window.location.search) ) {
        return delay(2000).then(() => {
            setTimeout(() => window.location = decodeURIComponent(window.location.search.substr(7), 100));
            return 'developer';
        });
    }

    return Promise.resolve();
}

export function getSelf(token) {
    if (token !== 'developer') {
        return Promise.reject(new Error('Not logged in as developer'));

    } else {
        return delay(500).then(() => ({
            login: 'dev',
            name: 'Developer',
            avatar: 'https://github.com/webpack.png',
            currencies: [
                { 
                    name: 'influence', 
                    displayName: 'Influence', 
                    description: 'Some **description**', 
                    value: totalCurrencies.influence, 
                    used: usedCurrencies.influence, 
                    remaining: totalCurrencies.influence - usedCurrencies.influence 
                },
                { 
                    name: 'goldenInfluence', 
                    displayName: 'Golden Influence', 
                    description: 'Some **description**', 
                    value: totalCurrencies.goldenInfluence, 
                    used: usedCurrencies.goldenInfluence, 
                    remaining: totalCurrencies.goldenInfluence - usedCurrencies.goldenInfluence 
                }
            ]
        }));
    }
}

export function getList(token, name = 'todo') {
    const loggedIn = token === 'developer';
    const listData = lists[name];

    return delay(500).then(() => ({
        name: name,
        displayName: 'Development Mode: ' + name,
        description: 'These items are simply for testing functionality...',
        lockable: true,
        deletable: true,
        archivable: true,
        isAdmin: true,
        possibleVotes: listData.possibleVotes,
        items: lists[name].items.map(item => {
            const votes = listData.possibleVotes.map(pv => ({
                name: pv.name,
                votes: (item[pv.name] || 0) + Math.floor(Math.random() * 100)
            }));

            const score = listData.possibleVotes.map((pv, i) => {
                return pv.score * votes[i].votes;
            }).reduce((a, b) => a + b, 0);
        
            return {
                id: item.id,
                list: item.list,
                title: item.title,
                locked: item.locked || false,
                archived: item.archived || false,
                description: item.description,
                votes,
                userVotes: loggedIn ? listData.possibleVotes.map(pv => ({
                    name: pv.name,
                    votes: item[pv.name] || 0
                })) : undefined,
                score
            };
        }).sort((a, b) => b.score - a.score)
    }));
}

export function createItem(token, list = 'todo', title, description) {
    if (token !== 'developer') {
        return Promise.reject(new Error('Not logged in as developer'));

    } else {
        let newItem = {
            id: Math.random() + '',
            list,
            title,
            description
        };

        allItems[newItem.id] = newItem;
        lists[list].items.push(newItem);

        return delay(500).then(() => ({
            ...newItem,
            score: 0,
            votes: lists[list].possibleVotes.map(pv => ({
                name: pv.name,
                votes: 0
            })),
            userVotes: lists[list].possibleVotes.map(pv => ({
                name: pv.name,
                votes: 0
            }))
        }));
    }
}

export function vote(token, itemId, voteName, value) {
    if (token !== 'developer') {
        return Promise.reject(
            new Error('Not logged in as developer')
        );

    } else {
        var listId = allItems[itemId].list,
            listData = lists[listId],
            pv = listData.possibleVotes.filter(pv => pv.name === voteName)[0];

        if (pv.currency) {
            usedCurrencies[pv.currency] += value;
        }

        allItems[itemId][voteName] = (allItems[itemId][voteName] || 0) + value;

        return delay(500).then(() => true);
    }
}

export function configItem(token, itemId, config) {
    var item = allItems[itemId];

    if (token !== 'developer') {
        return Promise.reject(
            new Error('Not logged in as developer')
        );

    } else {
        Object.assign(item, config);
        
        return delay(500).then(() => true);
    }
}
