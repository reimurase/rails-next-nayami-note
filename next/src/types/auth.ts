export type SignupParams = {
  email: string;
  password: string;
  password_confirmation: string;
};

export type LoginParams = {
  email: string;
  password: string;
};

export type MeResponse = {
  id: number;
  email: string;
  auto_archive_enabled: boolean;
};

export type Me = {
  id: number;
  email: string;
  autoArchiveEnabled: boolean;
};
