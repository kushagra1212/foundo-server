import { OkPacket, RowDataPacket } from 'mysql2';
import promisePool from '../db';
import { UserType } from '../types/types';

class User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  constructor({ firstName, lastName, email, password }: UserType) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
  }

  save() {
    let sql = `INSERT INTO user(firstName,lastName,email,password) VALUES(?,?,?,?)`;
    return promisePool.execute(sql, [
      this.firstName,
      this.lastName,
      this.email,
      this.password,
    ]) as Promise<OkPacket[]>;
  }

  static findAllUsers({ limit, offset }: { limit: string; offset: string }) {
    let sql = `SELECT * FROM user LIMIT ? OFFSET ?`;
    return promisePool.execute(sql, [limit, offset]) as Promise<
      RowDataPacket[]
    >;
  }
  static findUser({ id }: { id: number }) {
    let sql = `SELECT * FROM user WHERE id=?`;
    return promisePool.execute(sql, [id]) as Promise<RowDataPacket[]>;
  }

  static updateUser({ user, id }: { user: UserType; id: number }) {
    let sql = `UPDATE user SET address=?,phoneNo=?,profilePhoto=?, countryCode=?, otp=?, isVerified=? WHERE id=?`;

    return promisePool.execute(sql, [
      user.address,
      user.phoneNo,
      user.profilePhoto,
      user.countryCode,
      user.otp,
      user.isVerified,
      id,
    ]) as Promise<OkPacket[]>;
  }
  static changePassword({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    let sql = `UPDATE user SET password=? WHERE email=?`;
    return promisePool.execute(sql, [password, email]);
  }

  static deleteUser({ userId }: { userId: number }) {
    let sql = `DELETE FROM user WHERE id=?`;
    return promisePool.execute(sql, [userId]) as Promise<OkPacket[]>;
  }
  static findUserByEmail({ userEmail }: { userEmail: string }) {
    let sql = `SELECT * FROM user WHERE email=?`;
    return promisePool.execute(sql, [userEmail]) as Promise<RowDataPacket[]>;
  }
}

export default User;
