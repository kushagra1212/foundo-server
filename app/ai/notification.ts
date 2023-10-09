import ItemManager from '../controllers/utility';
import { sendFcmMessageLegacy } from '../firebase/firebase';
import logger from '../logger/logger';
import Item from '../models/Item';
import User from '../models/User';
import { UserType } from '../types/types';

export const sendMatchedItemsPushNotification = async () => {
  const [allUsers] = await User.findAll();

  const totalUsers = allUsers.length;

  for (let i = 0; i < totalUsers; i++) {
    const user: UserType = allUsers[i];

    const [lostItems] = await Item.findItemsByUserIdorAll({
      userId: user.id,
      founded: 0,
      limit: 1,
      offset: 0,
      latest: '1',
    });
    if (lostItems.length > 0 && user.pushNotificationToken) {
      const item = lostItems[0];

      const matches = await ItemManager.getMatchedItems(Number(item.id));
      const title = `Hey ${user.firstName}, this could be your lost ${item.itemName}`;
      const message = `We found total ${matches.length} matches for your item ${item.itemName}, please check the app for more details`;

      const fcmMessage = {
        token: user.pushNotificationToken,
        title,
        message,
      };
      try {
        const data = await sendFcmMessageLegacy(fcmMessage);
        console.log(data);
      } catch (err) {
        logger.info(err);
      }
    }
  }
};
export const sendMatchedItemsPushNotificationForSingleItem = async (
  fk_userId: number,
  itemId: number,
) => {
  const [row] = await User.findUser({ id: fk_userId });
 const user = row[0];
  const [itemRow] = await Item.findItem({ itemId });
  const item = itemRow[0];
  if (user.pushNotificationToken && item) {
    const matches = await ItemManager.getMatchedItems(Number(item.id));
    const title = `Hey ${user.firstName}, this could be your lost ${item.itemName}`;
    const message = `We found total ${matches.length} matches for your item ${item.itemName}, please check the app for more details`;

    const fcmMessage = {
      token: user.pushNotificationToken,
      title,
      message,
    };
    try {
      const data = await sendFcmMessageLegacy(fcmMessage);
      console.log(data);
    } catch (err) {
      logger.info(err);
    }
  }
};
