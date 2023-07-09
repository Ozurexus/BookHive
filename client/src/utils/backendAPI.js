import React from "react";
import {config} from "../cfg/config";

const backAddr = config.backend_addr;

export const register = (user) => {
    return fetch(`${backAddr}/auth/users/register`, {
        method: "POST",
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(resp => resp.json())
        .catch(err => console.log(err));
}
export const changePassword = (passForm) => {
    return fetch(`${backAddr}/auth/users/change_password`, {
        method: "POST",
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(passForm)
    })
        .catch(err => console.log(err));
}
export const login = (user) => {
    return fetch(`${backAddr}/auth/users/login`, {
        method: "POST",
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(resp => resp.json())
        .catch(err => console.log(err));
}

export const getBooks = (newName, accessToken) => {
    return fetch(`${backAddr}/api/books/find/?` + new URLSearchParams({pattern: newName.toLowerCase(), limit: 10}), {
        method: "GET",
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
    })
        .then(resp => resp.json())
        .catch(err => console.log(err));
}

export const rateBook = (bookId, newRate, userId, accessToken) => {
    return fetch(`${backAddr}/api/books/rate/`, {
        method: "POST",
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
            book_id: bookId,
            rate: newRate,
            user_id: userId // схуяли тут вообще строка, в swagger не строка ** а шоб все охуели
        })
    })
        .catch(err => console.log(err))
}

export const getRatedBooks = (userId, accessToken) => {
    return fetch(`${backAddr}/api/get_rated_books/${userId}`, {
        method: "GET",
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    })
        .then(resp => resp.json())
        .catch(err => console.log(err));
}

export const getRecommendedBooks = (userId, accessToken, limit=5) => {
    return fetch(`${backAddr}/api/books/recommendations/${userId}?`+new URLSearchParams({limit: limit}), {
        method: "GET",
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    })
        .then(resp => resp.json())
        .catch(err => console.log(err));
}

export const getUserStatus = (userId, accessToken) => {
    return fetch(`${backAddr}/api/user/status/${userId}`, {
        method: "GET",
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    })
        .then(resp => resp.json())
        .catch(err => console.log(err));
}
export const getWishesBooks = (userId, accessToken) => {
    return fetch(`${backAddr}/api/books/wishes/${userId}`, {
        method: "GET",
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    })
        .then(resp => resp.json())
        .catch(err => console.log(err));
}
export const addWishBook = (bookId, userId, accessToken) => {
    return fetch(`${backAddr}/api/books/wish/`, {
        method: "POST",
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
            book_id: bookId,
            user_id: userId // схуяли тут вообще строка, в swagger не строка ** а шоб все охуели
        })
    })
        .catch(err => console.log(err))
}
export const unRateBook = (bookId, userId, accessToken) => {
    return fetch(`${backAddr}/api/books/unrate/`, {
        method: "POST",
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
            book_id: bookId,
            user_id: userId // схуяли тут вообще строка, в swagger не строка ** а шоб все охуели
        })
    })
        .catch(err => console.log(err))
}