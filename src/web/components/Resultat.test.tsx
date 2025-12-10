import { render, screen } from '@testing-library/react';
import { Resultat } from './Resultat';
import userEvent from '@testing-library/user-event';

const dokumentDtoMed2Innsendinger = [
  {
    leveranseReferanse: 'ref1',
    dokument: 'dok1',
  },
  { leveranseReferanse: 'ref2', dokument: 'dok2' },
];

describe('Resultat', () => {
  beforeAll(() => {
    HTMLDialogElement.prototype.showModal = vi.fn();
    HTMLDialogElement.prototype.close = vi.fn();
  });

  const renderComponent = (korrelasjonsId: string) =>
    render(
      <Resultat
        korrelasjonsId={korrelasjonsId}
        dokumentDto={dokumentDtoMed2Innsendinger}
      />,
    );

  it('skal vise overskrift og korrelasjonsId når komponenten rendres', () => {
    renderComponent('abc-123');
    expect(screen.getByText('Resultat')).toBeInTheDocument();
    expect(screen.getByText(/abc-123/)).toBeInTheDocument();
  });

  it('skal vise en tabell som inneholder to rader med leveranseReferanser og knapper for å vise dokument', () => {
    renderComponent('abc-123');
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByRole('table')).toHaveTextContent('Dokument-id');
    expect(screen.getByRole('table')).toHaveTextContent('Vis dokument');
    expect(screen.getAllByRole('cell')[0]).toHaveTextContent('ref1');
    expect(screen.getAllByRole('cell')[1]).toHaveTextContent('Åpne dokument');
    expect(screen.getAllByRole('cell')[2]).toHaveTextContent('ref2');
    expect(screen.getAllByRole('cell')[3]).toHaveTextContent('Åpne dokument');
  });

  it('skal vise modal som inneholder overskrift og dokumentinnhold', async () => {
    renderComponent('abc-123');

    const iconbuttons = screen.getAllByRole('button', {
      name: 'Åpne dokument',
    });
    expect(iconbuttons).toHaveLength(2);

    await userEvent.click(iconbuttons[0]);
    expect(screen.getByText(/dok1/i)).toBeInTheDocument();
    expect(screen.getByText('Innsendt dokument')).toBeInTheDocument();

    await userEvent.click(iconbuttons[1]);
    expect(screen.getByText(/dok2/i)).toBeInTheDocument();
  });
});
