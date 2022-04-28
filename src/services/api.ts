import axios from 'axios';

export const api = axios.create({
    baseURL: '/api'// o axios já irá reconhecer automaticamente o http://localhost:3000
})