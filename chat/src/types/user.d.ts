export interface IUserFormData {
  username: string;
  email?: string;
  password: string;
}

export interface ILoginResponse {
  access: string;
  refresh: string;
}

export interface IUserInfo {
  id: number;
  date_joined: string;
  last_login: null | string;
  is_superuser: boolean;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  is_staff: boolean;
  is_active: boolean;
  groups: any[];
  user_permissions: any[];
}
