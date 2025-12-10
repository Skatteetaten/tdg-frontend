import { BrowserRouter } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Main } from './components/Main';

export function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Layout>
        <Main />
      </Layout>
    </BrowserRouter>
  );
}
