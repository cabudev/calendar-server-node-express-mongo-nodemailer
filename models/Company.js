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
    admin_id: {
        type: String,
        required: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = model('Company', CompanySchema ); 