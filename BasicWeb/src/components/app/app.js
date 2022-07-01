import React from 'react';
import './app.css'
import { Redirect, Route, Switch } from 'react-router-dom';
import {
    RecordsListPage
} from '../../pages'
import Header from "../header/header";
import Footer from "../footer/footer";

export default () => {
    return <><Switch>
            <Route path="/" component={RecordsListPage} exact />
        </Switch>
    </>
};