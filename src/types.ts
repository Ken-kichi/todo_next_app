export interface LayoutProps {
  children: React.ReactNode;
}

export interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  is_manager: boolean;
  disabled: boolean;
}
export interface ContentProps {
  user: User;
}

export interface Task {
  user_id: string;
  title: string;
  description: string | null;
  completed: boolean;
}

export interface LoginFormInputs {
  username: string;
  password: string;
}
