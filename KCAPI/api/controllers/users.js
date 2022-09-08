const jwt = require("jsonwebtoken")
const Users = require("../models/users")
const { responseFormatter, get, SendMail, generateOtp, verifyOtp, SendSMS } = require("../services")
const { OAuth2Client } = require('google-auth-library')
const config = require("../../config")
const client = new OAuth2Client(config.Google_ClientId)

exports.login = async (req, res) => { 
    const user = await Users.findOne({
        ...(isNaN(req.body.email) ? {email: req.body.email} : {phoneNumber: req.body.email}),
        password: req.body.password
    })

    if (user) {
        const token = jwt.sign({ _id: user.toJSON().id }, req.app.get("secretKey"), { expiresIn: '365d' });
        res.send(responseFormatter({
            ...user.toJSON(),
            token
        }, 1, 'User signed in successfully'))
    } else {
        res.send(responseFormatter(null, 0, "Invalid credentials"))
    }
}

exports.register = async (req, res) => {
    if (await Users.findOne({ email: get(req.body, 'userData.email', '')})) {
        res.send(responseFormatter(null, 0, get(req.body, 'userData.email', '') + ' is already taken'));
        return;
    }

    if (await Users.findOne({ phoneNumber: get(req.body, 'userData.phoneNumber', '') })) {
        res.send(responseFormatter(null, 0, get(req.body, 'userData.phoneNumber', '') + ' is already taken'));
        return;
    }
    
    // global.fireAuth.createUser({
    //         ...(req.body.userData || {}),
    //         phoneNumber: '+91' + get(req.body, 'userData.phoneNumber', '')
    //     })
        // .then((userRecord) => {
            const userObj = new Users({ 
                ...req.body.userData, 
                // uid: userRecord.toJSON().uid 
            });
            userObj.save().then(async(user) => {
                const mailResponse = await SendMail(user.email, "Greeting from Konncet Cart", `Your profile has been added to KC family. Enjoy the shopping!`)
                res.send(responseFormatter(user.toJSON(), 1, "User created successfully"))
            }).catch(err => {
                // global.fireAuth.deleteUser(userRecord.toJSON().uid)
                //     .then(() => {
                //         console.log('Successfully deleted user');
                //     })
                //     .catch((error) => {
                //         console.log('Error deleting user:', error);
                //     });
                res.send(responseFormatter(err.errors, 0, err.name))
            })
            // // res.send(responseFormatter(userRecord.toJSON(), 1, "User created successfully"))
        // })
        // .catch((error) => {
        //     res.send(responseFormatter(null, 0, error.message))
        // });
}

exports.updateProfile = async (req, res) => {
    try {
        let user = await Users.findById(req._id);
        const userParam = { ...req.body.userData };
        // validate
        if (!user) {
            res.send(responseFormatter(null, 0, 'User not found'));
            return;
        }
        if (user.email !== userParam.email && await Users.findOne({ email: userParam.email })) {
            res.send(responseFormatter(null, 0, userParam.email + ' is already taken'));
            return;
        }
        if (user.phoneNumber !== userParam.phoneNumber && await Users.findOne({ phoneNumber: userParam.phoneNumber })) {
            res.send(responseFormatter(null, 0, userParam.phoneNumber + ' is already taken'));
            return;
        }

        // global.fireAuth.updateUser(req.uid, {
        //         ...(req.body.userData || {}),
        //         phoneNumber: '+91' + userParam.phoneNumber
        //         // email: <updatedEMail>,
        //         // phoneNumber: <updatedPhoneNumber>,
        //         // emailVerified: <boolean>,
        //         // password: <updatedPassword>,
        //         // displayName: <updatedName>,
        //         // photoURL: <URLString>,
        //         // disabled: <boolean>,
        //     })
        //     .then((userRecord) => {
                Object.assign(user, userParam);

                user.save().then((updatedUser) => {
                    res.send(responseFormatter(updatedUser.toJSON(), 1, "User updated successfully"))
                }).catch(err => {
                    // global.fireAuth.deleteUser(userRecord.toJSON().uid)
                    //     .then(() => {
                    //         console.log('Successfully deleted user');
                    //     })
                    //     .catch((error) => {
                    //         console.log('Error deleting user:', error);
                    //     });
                    res.send(responseFormatter(err.errors, 0, err.name))
                })
                // // res.send(responseFormatter(userRecord.toJSON(), 1, "Successfully updated user"))
            // })
            // .catch((error) => {
            //     res.send(responseFormatter(null, 0, error.message))
            // });
    } catch (ex) {
        res.send(responseFormatter(ex, 0, "Something went wrong"))
    }
}

exports.getProfile = async (req, res) => { 
    Users.findById(req._id)
        .then((userRecord) => {
            res.send(responseFormatter(userRecord.toJSON(), 1, "Successfully fetched user"))
        })
        .catch((error) => {
            res.send(responseFormatter(null, 0, 'Error fetching user: ' + JSON.stringify(error)))
        });
}

exports.googleRegisterAndLogin = async (req, res) => {
    console.log("req.body.idToken",client.verifyIdToken)
    client.verifyIdToken({
        idToken: req.body.idToken
    }).then(async(ticket) => {
        console.log("ticket",ticket)
        const userInfo = ticket.getPayload()
        const user = await Users.findOne({
            email: userInfo.email,
            isGoogleUser: true
        })

        if(user) {
            const token = jwt.sign({ _id: user.toJSON().id }, req.app.get("secretKey"), { expiresIn: '365d' });
            res.send(responseFormatter({
                ...user.toJSON(),
                token
            }, 1, 'User signed in successfully'))
        } else {
            if (await Users.findOne({ email: userInfo.email})) {
                res.send(responseFormatter(null, 0, userInfo.email + ' is already taken'));
                return;
            }
        
            if (userInfo.phone_number && await Users.findOne({ phoneNumber: userInfo.phone_number })) {
                res.send(responseFormatter(null, 0, userInfo.phone_number + ' is already taken'));
                return;
            }

            const userObj = new Users({ 
                email: userInfo.email,
                ...(userInfo.phone_number ? { phoneNumber: userInfo.phone_number } : {} ),
                displayName: userInfo.name,
                photoURL: userInfo.picture,
                isGoogleUser: true
            });
            userObj.save().then(async(u) => {
                const mailResponse = await SendMail(userInfo.email, "Greeting from Konncet Cart", `Your profile has been added to KC family. Enjoy the shopping!`)
                const token = jwt.sign({ _id: u.toJSON().id }, req.app.get("secretKey"), { expiresIn: '365d' });
                res.send(responseFormatter({
                    ...u.toJSON(),
                    token
                }, 1, 'User signed in successfully'))
                // res.send(responseFormatter(u.toJSON(), 1, "User created successfully"))
            }).catch(err => {
                res.send(responseFormatter(err.errors, 0, err.name))
            })
        }
    }).catch(err => {
        console.log(err)
        res.send(responseFormatter(err, 0, 'Something went wrong'))
    })
    
}

exports.forgotPassword = async (req, res) => {
    const user = await Users.findOne({
        ...(isNaN(req.body.email) ? {email: req.body.email} : {phoneNumber: req.body.email})
    })

    if(user && !user.isGoogleUser) {
        generateOtp(Buffer.from(user.id, 'UTF-8'), 10, 4).then(async(doc) => {
            const mailResponse = await SendMail(user.email, "Forgot Password OTP for Konnect Cart", 'Your OTP is ' + doc.otp)
            if(user.phoneNumber) {
                const smsResponse = await SendSMS(user.phoneNumber, "Forgot Password OTP for Konnect Cart. Your OTP is " + doc.otp)
                console.log(smsResponse);
            }
            res.send(responseFormatter({ mailSent: true, identifier: doc.identifier }, 1, 'Otp Sent to email/phone'))
        }).catch(err => {
            console.log(err)
            res.send(responseFormatter(err, 0, 'Something went wrong'))
        })
    } else {
        res.send(responseFormatter(null, 0, user ? 'This mail/phone configured with google' : 'Mail/Phone not registered yet'))
    }
}

exports.verifyOtp = async (req, res) => {
    verifyOtp(req.body.identifier, req.body.otp).then(doc => {
        res.send(responseFormatter({
            token: jwt.sign({ _id: doc.identifier.toString('UTF-8', 0, 9), otp: doc.otp }, req.app.get("secretKey"), { expiresIn: '5m' })
        }, 1, 'OTP Verified'))
    }).catch(err => {
        console.log(err)
        res.send(responseFormatter(err, 0, 'OTP not verified, You may enter wrong OTP'))
    })
}

exports.resetPassword = async (req, res) => {
    try {
        if(!req.otpMode) {
            res.send(responseFormatter(null, 0, 'Invalid token for this operation'))
            return;
        }
        let user = await Users.findById(req._id);
        Object.assign(user, {
            password: req.body.updatedPassword
        });

        user.save().then(async(updatedUser) => {
            const mailResponse = await SendMail(user.email, "Password Reset", `Your password has been updated successfully`)
            res.send(responseFormatter(updatedUser.toJSON(), 1, "Password is reseted"))
        }).catch(err => {
            res.send(responseFormatter(err.errors, 0, err.name))
        })
    } catch (ex) {
        res.send(responseFormatter(ex, 0, "Something went wrong"))
    }
}