import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

type JwtPayloadWithId = JwtPayload & { id: number };

export interface RequestWithJwt extends Request {
  jwt: JwtPayloadWithId;
  decoded?: JwtPayloadWithId;
  user?: UserType;
}

export type UserType = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  address?: string;
  phoneNo?: string;
  profilePhoto?: string;
  countryCode?: string;
  otp?: string | number;
  isVerified?: number;
};

export type UserSettingType = {
  fk_userId: number;
  language: string;
  displayPhoneNo: number;
  displayProfilePhoto: number;
  displayAddress: number;
};

export type ItemBaseType = {
  itemName: string;
  color: string;
  dateTime: string;
  description: string;
  brand: string;
  city: string;
  category: string;
  fk_userId: number;
  isFounded: number;
};
export type ImageType = {
  image: string;
};

export type ItemLocationType = {
  fk_itemId: number;
  fk_locationId: number;
};

export type LocationType = {
  latitude: number;
  longitude: number;
};

export type messageType = {
  fk_senderId: number;
  fk_receiverId: number;
  message: string;
  title: string;
};

export type contactMessageType = {
  baseMessage: messageType;
  location: LocationType | undefined;
  isFound: number;
  isPhoneNoShared: number;
};

export type MessageLocationType = {
  fk_messageId: number;
  fk_locationId: number;
};
