import React, {useEffect, useState} from 'react';

export const Logout = (setIsAuth, setAccessToken, setUserId, setNumReviewedBooks) => {
    setIsAuth(false);
    setAccessToken('');
    setUserId('');
    setNumReviewedBooks(0);
    localStorage.removeItem('auth');
    localStorage.removeItem('userId');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userLogin');
}