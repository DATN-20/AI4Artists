export enum LoginModalPage {
    LOGIN_PAGE,
    REGISTER_PAGE,
    FORGOT_PASSWORD_PAGE,
    }

    export interface ModalProps {
        onClose: (page: LoginModalPage) => void
      }