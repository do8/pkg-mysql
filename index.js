"use strict";
const mysql = require('mysql')

function pool() { }

pool.prototype.new = env => {
    const p = new pool()
    p.db = mysql.createPool(Object.assign({
        connectionLimit: 10,
        multipleStatements: true,
        timeout: 36000,
        charset: 'utf8mb4',
        timezone: 'local',
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'mysql',
        port: 3306
    }, env))
    return p
}

pool.prototype.query = async function (sql, data) {
    return new Promise((resolve, reject) => {
        this.db.query(sql, data, function (err, res) {
            if (err) return reject(err)
            resolve(res)
        })
    })
}

pool.prototype.tran = async function (arr) {
    return new Promise((resolve, reject) => {
        this.db.getConnection((err, connection) => {
            if (err) return reject(err)
            connection.beginTransaction(err => {
                if (err) return reject(err)
                resolve(new tran(connection))
            })
        })
    })
}

function tran(connection) { this.connection = connection }
tran.prototype.query = async function (sql, data) {
    return new Promise((resolve, reject) => {
        this.connection.query(sql, data, function (err, res) {
            if (err) return reject(err)
            resolve(res)
        })
    })
}
tran.prototype.rollback = async function () {
    return new Promise((resolve, reject) => {
        this.connection.rollback(() => {
            this.connection.release()
            resolve(res)
        })
    })
}
tran.prototype.commit = async function () {
    return new Promise((resolve, reject) => {
        this.connection.commit(err => {
            this.connection.release()
            if (err) return reject(err)
            resolve()
        })
    })
}

async function e(sql, data) {
    return new Promise(function (resolve, reject) {
        pool.getConnection(function (err, connection) {
            if (err) return reject(err)
            connection.query(sql, data, function (err, res) {
                connection.release();//放回连接池
                if (err) return reject(err)
                resolve(res)
            })
        })
    })
}

pool.prototype.try = async function (sql, data, re) {
    try {
        return {
            data: await this.exec(sql, data)
        }
    } catch (err) {
        if (re) return await this.try(sql, data)
        return { msg: err.message, err }
    }
}

pool.prototype.format = mysql.format

let p = new pool()

if (global.poolmysqlconfig) p = p.new(global.poolmysqlconfig)

module.exports = p
