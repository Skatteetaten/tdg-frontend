import { Card } from '@skatteetaten/ds-content';
import { Heading } from '@skatteetaten/ds-typography';
import { Button } from '@skatteetaten/ds-buttons';
import { useCreateTdss, useGetDokument } from '../hooks/useTdss';
import { useState } from 'react';
import './Main.css';
import { Modusvelger } from './Modusvelger';
import { Resultat } from './Resultat';
import { Feilgrense } from './Feilgrense';
import { Alert } from '@skatteetaten/ds-status';
import { Spinner } from '@skatteetaten/ds-progress';
import { Playground } from './Playground';

export const Main = () => {
  const [korrelasjonsId, setKorrelasjonsId] = useState<string | null>(null);

  const tdssPlaceholder = {
    person: 'person {\n    /* Skriv TDSS her */\n}',
    enhet: 'enhet {\n    /* Skriv TDSS her */\n}',
  };

  const [tdss, setTdss] = useState<string>(tdssPlaceholder.person);

  const createTdss = useCreateTdss();

  const handleClick = () => {
    createTdss.mutate(
      {
        spesifikasjon: tdss,
      },
      {
        onSuccess: (data) => {
          setKorrelasjonsId(data);
        },
        onError: () => {
          setKorrelasjonsId(null);
        },
      },
    );
  };

  const { data: dokumentDto, isLoading } = useGetDokument(korrelasjonsId);

  return (
    <Card color={'ochre'} className={'main-wrapper'}>
      <Card.Content classNames={{ children: 'main-card' }}>
        <Heading as={'h1'} level={3} hasSpacing={true}>
          Angi spesifikasjon
        </Heading>
        <Modusvelger tdssPlaceholder={tdssPlaceholder}></Modusvelger>
        <Feilgrense>
          <Playground tdss={tdss} setTdss={setTdss}></Playground>
          <Button onClick={handleClick} className={'innsendingsknapp'}>
            Send inn spesifikasjon
          </Button>
        </Feilgrense>
        {createTdss.isError && (
          <Alert showAlert={true} variant={'error'}>
            {createTdss.error?.message ||
              'En feil oppstod ved innsending av spesifikasjonen'}
          </Alert>
        )}
        {isLoading && <Spinner color={'blue'}>Lager innsending...</Spinner>}
        {korrelasjonsId && dokumentDto && !createTdss.isError && (
          <Feilgrense>
            <Resultat
              korrelasjonsId={korrelasjonsId}
              dokumentDto={dokumentDto}
            />
          </Feilgrense>
        )}
      </Card.Content>
    </Card>
  );
};
