import { NextApiRequest, NextApiResponse } from 'next';

export default (request: NextApiRequest, response: NextApiResponse) => {
    const param = request.query;

    console.log(param)

    const users = [
        { id: 1, name: 'Diego' },
        { id: 2, name: 'Mayk' },
        { id: 3, name: 'Jaqueliny' }
    ]

    return response.json(users[1]);
}