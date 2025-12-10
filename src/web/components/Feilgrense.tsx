import { ErrorMessage } from '@skatteetaten/ds-forms';
import { ErrorBoundary } from 'react-error-boundary';

export const Feilgrense = ({ children }: { children: React.ReactNode }) => {
  const feilmelding = (
    <ErrorMessage showError hasSpacing={true} className={'error-boundary'}>
      {'Noe gikk galt. Forsøk å laste siden på nytt.'}
    </ErrorMessage>
  );

  return <ErrorBoundary fallback={feilmelding}>{children}</ErrorBoundary>;
};
