const {emailActionEnum} = require("../constants");
module.exports = {
    [emailActionEnum.WELCOME]: {
        subject: 'WELCOME',
        templateName: 'welcome'
    },

    [emailActionEnum.ORDER_ARRIVED]: {
        subject: 'ORDER ARR',
        templateName: 'order_arrived'
    },

    [emailActionEnum.FORGOT_PASSWORD]: {
        subject: 'Opps dont worry',
        templateName: 'forgot_pass'
    }
}