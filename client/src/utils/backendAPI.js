import React from "react";
import {config} from "../cfg/config";

const backAddr = config.backend_addr;

export class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.name = "AuthorizationError";
    this.statusCode = 401;
  }
}

// -----------------------------------AUTH-----------------------------------
export const register = async (user) => {
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
    }).catch(err => console.log(err));
}
export const login = (user) => {
    return fetch(`${backAddr}/auth/users/login`, {
        method: "POST",
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    }).then(resp => resp.json())
        .catch(err => console.log(err));
}


// -----------------------------------CORE-----------------------------------
export const getBooks = (newName, accessToken) => {
    return fetch(`${backAddr}/api/books/find/?` + new URLSearchParams({pattern: newName.toLowerCase(), limit: 10}), {
        method: "GET",
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
    }).then(resp => {
        if (resp.status === 401) {
            throw new AuthorizationError("jwt died");
        }
        return resp.json();
    })
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
    }).then(resp => {
        if (resp.status === 401) {
            throw new AuthorizationError("jwt died");
        }
    })
}

export const getRatedBooks = (userId, accessToken) => {
    return fetch(`${backAddr}/api/user/rated_books/`, {
        method: "GET",
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    })
        .then(resp => {
            if (resp.status === 401) {
                throw new AuthorizationError("jwt died");
            }
            return resp.json();
        })
}

export const getRecommendedBooks = (userId, accessToken, limit = 5) => {
    return fetch(`${backAddr}/api/user/books/recommendation?` + new URLSearchParams({limit: limit}), {
        method: "GET",
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    })
        .then(resp => {
            if (resp.status === 401) {
                throw new AuthorizationError("jwt died");
            }
            return resp.json();
        })
}

export const getUserStatus = (userId, accessToken) => {
    return fetch(`${backAddr}/api/user/status`, {
        method: "GET",
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    }).then(resp => {
            if (resp.status === 401) {
                throw new AuthorizationError("jwt died");
            }
            return resp.json();
        })
}
export const getWishesBooks = (userId, accessToken) => {
    return fetch(`${backAddr}/api/user/wish_list`, {
        method: "GET",
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    }).then(resp => {
            if (resp.status === 401) {
                throw new AuthorizationError("jwt died");
            }
            return resp.json();
        })
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
    }).then(resp => {
        if (resp.status === 401) {
            throw new AuthorizationError("jwt died");
        }
    })
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
    }).then(resp => {
        if (resp.status === 401) {
            throw new AuthorizationError("jwt died");
        }
    })
}
export const deleteAccount = async (accessToken) => {
    return fetch(`${backAddr}/api/user/me`, {
        method: "DELETE",
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
    }).then(resp => {
            if (resp.status === 401) {
                throw new AuthorizationError("jwt died");
            }
        })
}