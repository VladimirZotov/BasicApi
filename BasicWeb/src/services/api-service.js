import axios from "axios";

class ApiService {

    constructor() {

        this._axios = axios.create({
            baseURL: process.env.API_BASE,
            headers: { 'Content-Type': 'application/json' }
        });

    }

    async post(url, data, headers = {}) {

        const config = {
            method: 'post',
            url,
            data,
            headers
        };

        return this._axios.post(url, data, { headers });

    }

    async get(url) {

        return this._axios.get(url);

    }

    postRecords = async (records) => {

        const data = JSON.stringify(records);

        return this.post(`/records`, data);

    };

    getRecords = async (params) => {

        const query = new URLSearchParams(params).toString();

        return this.get(`/records?${query}`);

    };

}

export default new ApiService();