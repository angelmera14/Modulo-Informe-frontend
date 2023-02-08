import { Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';

export const Loadable = (Component) => (props) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { pathname } = useLocation();

    return (
        <Suspense fallback={<LoadingScreen isDashboard={pathname.includes('/sistema')} />}>
            <Component {...props} />
        </Suspense>
    );
};