declare module 'react-multiline-clamp' {
  import { ReactNode } from 'react';

  interface ClampProps {
    lines: number;
    maxLines?: number;
    withToggle?: boolean;
    showMoreElement?: (props: { toggle: () => void }) => React.ReactNode;
    showLessElement?: (props: { toggle: () => void }) => React.ReactNode;
    children: React.ReactNode;
  }

  const Clamp: React.FC<ClampProps>;

  export default Clamp;
}
