import { TopBannerInternal } from '@skatteetaten/ds-layout';
import { ReactNode } from 'react';
import './Layout.css';

type Props = {
  children: ReactNode;
};

export const Layout = (props: Props) => {
  return (
    <div className={'layout'}>
      <TopBannerInternal title={'Testdatagenerator'} logoHref={'/'} />
      <main>{props.children}</main>
    </div>
  );
};
