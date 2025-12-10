import { CompanySVGpath, PersonSVGpath } from '@skatteetaten/ds-icons';
import { Tabs } from '@skatteetaten/ds-collections';
import './Modusvelger.css';

type TdssPlaceholder = {
  person: string;
  enhet: string;
};

type ModusvelgerProps = {
  tdssPlaceholder: TdssPlaceholder;
};

export const Modusvelger = ({ tdssPlaceholder }: ModusvelgerProps) => {
  const oppdaterTekstICodeMirror = (value: string) => {
    if (value === 'person') {
      value = tdssPlaceholder.person;
    }
    if (value === 'enhet') {
      value = tdssPlaceholder.enhet;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    document.querySelector('.CodeMirror').CodeMirror.setValue(value);
  };

  return (
    <Tabs
      defaultValue={'person'}
      onChange={(value) => {
        oppdaterTekstICodeMirror(value);
      }}
    >
      <Tabs.List className={'tabs'}>
        <Tabs.Tab value={'person'} svgPath={PersonSVGpath}>
          Person
        </Tabs.Tab>
        <Tabs.Tab value={'enhet'} svgPath={CompanySVGpath}>
          Enhet
        </Tabs.Tab>
      </Tabs.List>
    </Tabs>
  );
};
