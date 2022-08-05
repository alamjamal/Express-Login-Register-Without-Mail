const Joi = require('joi');
function userValidate(data) {
    const schema = Joi.object({
        userType: Joi.string().required(),
        organisation:Joi.string().required(),
        firstName:Joi.string().required(),
        lastName:Joi.string(),
        email:Joi.string().email().required(),
        password:Joi.string().required(),
        mobile: Joi.string().max(13).required(),
        pinCode: Joi.string().min(6).max(6).required(),
        address: Joi.string()
    });
    return schema.validate(data);
}

module.exports=userValidate;