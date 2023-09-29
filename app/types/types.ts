import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

type JwtPayloadWithId = JwtPayload & { id: number };

export interface RequestWithJwt extends Request {
  jwt: JwtPayloadWithId;
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
