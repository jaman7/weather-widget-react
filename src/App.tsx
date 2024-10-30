import { Route, Routes } from 'react-router-dom';
import Home from 'view/Home';
import Loader from 'common/Loader';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLoading } from 'core/loading/LoadingContext';
import './i18n';

const App = () => {
  const { i18n } = useTranslation();
  const { isLoading } = useLoading();

  useEffect(() => {
    const currentPath = location?.pathname.replace(/^\//, '') ?? '';
    const selectedNamespace = currentPath !== '' ? currentPath : 'home';
    if (!i18n.hasResourceBundle(i18n.language, selectedNamespace)) {
      i18n.loadNamespaces(selectedNamespace);
    }
  }, [location, i18n]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>

      {isLoading && <Loader />}
    </>
  );
};

export default App;
