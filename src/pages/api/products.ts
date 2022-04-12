import { NextApiRequest, NextApiResponse } from 'next';

export default (request: NextApiRequest, response: NextApiResponse) => {
    const products = [
        { id: 1, name: 'Colher' },
        { id: 2, name: 'Garfo' },
        { id: 3, name: 'Faca' },
    ]

    return response.json(products);
}