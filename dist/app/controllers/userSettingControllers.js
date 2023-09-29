var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const UserSetting = require('../models/UserSetting');
const updateUserSettingbyUserId = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const { userId, displayPhoneNo, language, displayProfilePhoto, displayAddress, } = req.body;
    try {
        if (!userId) {
            res
                .status(400)
                .send({ error: 'bad request', errorMessage: 'userId is required' });
            return;
        }
        const [userSettingResult, __] = yield UserSetting.findUserSetting({
            userId,
        });
        if (!userSettingResult || !userSettingResult.length) {
            res
                .status(404)
                .send({ error: 'not found', errorMessage: 'user Setting not found' });
        }
        else {
            let userSetting = userSettingResult[0];
            if (displayPhoneNo !== undefined &&
                userSetting.displayPhoneNo !== displayPhoneNo)
                userSetting.displayPhoneNo = displayPhoneNo;
            if (language !== undefined && userSetting.language !== language)
                userSetting.language = language;
            if (displayProfilePhoto !== undefined &&
                userSetting.displayProfilePhoto !== displayProfilePhoto)
                userSetting.displayProfilePhoto = displayProfilePhoto;
            if (displayAddress !== undefined &&
                userSetting.displayAddress !== displayAddress)
                userSetting.displayAddress = displayAddress;
            try {
                yield UserSetting.updateUserSetting({
                    userSetting,
                });
                res.status(200).send({ userSetting });
            }
            catch (err) {
                res.status(400).send({
                    error: 'Bad Request',
                    errorMessage: 'user Setting update failed ',
                });
            }
        }
    }
    catch (err) {
        res.status(500).send({ error: 'server error', errorMessage: err.message });
    }
});
const getUserSettingByUserId = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const { userId } = req.params;
    if (!userId) {
        res
            .status(400)
            .send({ error: 'bad request', errorMessage: 'userId is required' });
        return;
    }
    try {
        const [userSettingResult, __] = yield UserSetting.findUserSetting({
            userId,
        });
        if (!userSettingResult || !userSettingResult.length) {
            res
                .status(404)
                .send({ error: 'not found', errorMessage: 'user setting not found' });
        }
        else {
            res.status(200).send({ userSetting: userSettingResult[0] });
        }
    }
    catch (err) {
        res.status(500).send({ error: 'server error', errorMessage: err.message });
    }
});
module.exports = { updateUserSettingbyUserId, getUserSettingByUserId };
//# sourceMappingURL=userSettingControllers.js.map