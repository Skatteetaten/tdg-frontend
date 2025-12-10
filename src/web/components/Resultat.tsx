import { Card } from '@skatteetaten/ds-content';
import { Heading, Paragraph } from '@skatteetaten/ds-typography';
import { useEffect, useRef, useState } from 'react';
import { Table } from '@skatteetaten/ds-table';
import { DokumentDto } from '../../types/dokumentDto';
import { IconButton } from '@skatteetaten/ds-buttons';
import { Modal } from '@skatteetaten/ds-overlays';
import { FileSVGpath } from '@skatteetaten/ds-icons';
import '../components/Resultat.css';

type ResultatProps = {
  korrelasjonsId: string;
  dokumentDto: DokumentDto[];
};

export const Resultat = ({ korrelasjonsId, dokumentDto }: ResultatProps) => {
  const refModal = useRef<HTMLDialogElement>(null);

  const [valgtDto, setValgtDto] = useState<DokumentDto | null>(null);

  useEffect(() => {
    if (valgtDto) {
      refModal.current?.showModal();
    }
  }, [valgtDto]);

  const aapneModal = (dto: DokumentDto) => {
    setValgtDto(dto);
  };

  const lukkModal = () => setValgtDto(null);

  return (
    <>
      <Card color={'forest'} spacing={'l'} className={'resultat-wrapper'}>
        <Card.Content classNames={{ children: 'resultat-card' }}>
          <Heading as={'h2'} level={3} hasSpacing={true}>
            Resultat
          </Heading>
          <Paragraph>Korrelasjonsid: {korrelasjonsId}</Paragraph>
          <Table
            caption={'Opprettede dokumenter'}
            className={'resultat-tabell'}
          >
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>{'Dokument-id'}</Table.HeaderCell>
                <Table.HeaderCell alignment={'center'}>
                  {'Vis dokument'}
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {dokumentDto.map((dto: DokumentDto) => (
                <Table.Row key={dto.leveranseReferanse}>
                  <Table.DataCell>{dto.leveranseReferanse}</Table.DataCell>
                  <Table.DataCell alignment={'center'}>
                    <IconButton
                      title={'Åpne dokument'}
                      svgPath={FileSVGpath}
                      onClick={() => {
                        aapneModal(dto);
                      }}
                    />
                  </Table.DataCell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Card.Content>
      </Card>
      {valgtDto && (
        <Modal
          classNames={{ container: 'modal-wrapper' }}
          title={'Innsendt dokument'}
          ref={refModal}
          onClose={lukkModal}
          padding={'m'}
        >
          <pre className={'xml-visning'}>{valgtDto.dokument}</pre>
        </Modal>
      )}
    </>
  );
};
