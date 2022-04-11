import { NextApiRequest, NextApiResponse } from 'next';

export default (resquest: NextApiRequest, response: NextApiResponse) => {
    const users = [
        { id: 1, name: 'Diego' },
        { id: 2, name: 'João' },
        { id: 3, name: 'Michel' },
        { id: 4, name: 'Letícia' }
    ]

    return response.json(users);
}