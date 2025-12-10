// eslint-disable-next-line import/default
import playground from 'kotlin-playground';
import React, { useEffect, useState } from 'react';
import './Main.css';
import { Spinner } from '@skatteetaten/ds-progress';
import '../components/Playground.css';

type PlaygroundProps = {
  tdss: string;
  setTdss: React.Dispatch<React.SetStateAction<string>>;
};

export const Playground = ({ tdss, setTdss }: PlaygroundProps) => {
  const [loading, setLoading] = useState(true);
  const maxRetries = 15;

  useEffect(() => {
    let retryCount = 0;

    const startPlayground = async () => {
      try {
        const res = await fetch('/api/versions');
        if (!res.ok) throw new Error('Kotlin Playground kunne ikke starte');

        playground('code', {
          server: '/api',
          version: '1.3.50',
          onChange: (code: string) => setTdss(code),
          callback: (targetNode, mountNode) => {
            mountNode.style.display = 'block';
            setLoading(false);
            console.log('Kotlin Playground startet OK');
          },
        });
      } catch (err) {
        console.error(err);
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(() => {
            void startPlayground();
          }, 500);
        }
      }
    };

    void startPlayground();
  }, [setTdss]);

  const optionalProps = {
    theme: 'darcula',
    mode: 'kotlin',
    lines: 'true',
  } as React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

  return (
    <div>
      {loading && (
        <Spinner color={'blue'} size={'large'} className={'spinner'}>
          Laster Playground
        </Spinner>
      )}

      <code
        data-autocomplete="true"
        data-crosslink="disabled"
        // eslint-disable-next-line react/no-unknown-property
        auto-indent="true"
        // eslint-disable-next-line react/no-unknown-property
        highlight-on-fly="true"
        // eslint-disable-next-line react/no-unknown-property
        match-brackets="true"
        style={{ display: 'none' }}
        {...optionalProps}
      >
        {`
import no.skatteetaten.rst.tdss.person.person
import no.skatteetaten.rst.tdss.enhet.enhet

fun main() {
//sampleStart
  ${tdss}
//sampleEnd
}
        `}
      </code>
    </div>
  );
};
