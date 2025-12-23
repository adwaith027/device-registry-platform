import React from "react";
import '../styles/Home.css';

export default function Home(){
    // getItem always returns string. convert it to object
    const user=localStorage.getItem('user')
    const userdata=user?JSON.parse(user):{}
    const username=userdata?.username || ''

    return(
        <div className="home-page">
            <div className="home-page__content">
                <h1 className="home-page__title">Welcome, {username}</h1>

            </div>
        </div>
    );
}