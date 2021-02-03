const { Schema, model } = require('mongoose');

const CompanySchema = Schema({
    tradename: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
    },
    vat: {
        type: String,
        unique: true
    },
    address: {
        type: String,
    },
    zip: {
        type: String
    },
    municipality: {
        type: String
    },
    province: {
        type: String
    },
    country: {
        type: String
    },
    phone: {
        type: String
    },
    email: {
        type: String
    },
    master_user: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = model('Company', CompanySchema );