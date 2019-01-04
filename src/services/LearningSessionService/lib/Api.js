const express = require('express');

module.exports = class Api {
    constructor(service) {
        this.service = service;
    }
};