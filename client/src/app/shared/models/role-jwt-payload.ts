import {JwtPayload} from "jwt-decode";

export interface RoleJwtPayload extends JwtPayload {
  role: string;
}
