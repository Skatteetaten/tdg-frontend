import { render, screen } from '@testing-library/react';
import { Modusvelger } from './Modusvelger';
import userEvent from '@testing-library/user-event';

describe('Modusvelger', () => {
  const tdssPlaceholder = {
    person: 'person-placeholder-innhold',
    enhet: 'enhet-placeholder-innhold',
  };

  let settVerdiICodeMirror: ReturnType<typeof vi.fn>;
  let querySelectorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    settVerdiICodeMirror = vi.fn();
    interface CodeMirrorElement extends HTMLElement {
      CodeMirror: { setValue: typeof settVerdiICodeMirror };
    }
    querySelectorSpy = vi
      .spyOn(document, 'querySelector')
      .mockImplementation((selector: string) => {
        if (selector === '.CodeMirror') {
          const element = document.createElement(
            'div',
          ) as unknown as CodeMirrorElement;
          element.CodeMirror = { setValue: settVerdiICodeMirror };
          return element;
        }
        return null;
      });
  });

  afterEach(() => {
    querySelectorSpy.mockRestore();
    vi.resetAllMocks();
  });

  const renderComponent = () =>
    render(<Modusvelger tdssPlaceholder={tdssPlaceholder} />);

  it('skal vise 2 tabs når komponenten rendres', () => {
    renderComponent();
    const tabs = screen.getAllByRole('tab');

    expect(tabs).toHaveLength(2);
    expect(tabs[0]).toHaveTextContent('Person');
    expect(tabs[1]).toHaveTextContent('Enhet');
  });

  it('skal vise riktig default valgt tab', async () => {
    renderComponent();

    const defaultTab = screen.getByRole('tab', { name: 'Person' });
    expect(defaultTab).toHaveAttribute('aria-selected', 'true');

    const user = userEvent.setup();
    await user.click(defaultTab);
    expect(settVerdiICodeMirror).toHaveBeenCalledWith(tdssPlaceholder.person);
  });

  it('skal sette aktiv tab til Enhet når denne klikkes og oppdatere tekst i CodeMirror', async () => {
    renderComponent();
    const user = userEvent.setup();
    const enhetTab = screen.getByRole('tab', { name: 'Enhet' });
    await user.click(enhetTab);

    expect(enhetTab).toHaveAttribute('aria-selected', 'true');
    expect(settVerdiICodeMirror).toHaveBeenCalledTimes(1);
    expect(settVerdiICodeMirror).toHaveBeenCalledWith(tdssPlaceholder.enhet);
  });
});
