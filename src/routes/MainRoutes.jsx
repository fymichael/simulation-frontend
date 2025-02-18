import { lazy } from 'react';
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';
import ClientsTable from 'pages/extra-pages/clients/Clients';

const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));

// render - sample page
const Departement = Loadable(lazy(() => import('pages/extra-pages/departements/Departement')));
const Contrat = Loadable(lazy(() => import('pages/extra-pages/contrats/Contrat')));
const DetailsContrat = Loadable(lazy(() => import('pages/extra-pages/contrats/DetailsContrat')));
const NewContrat = Loadable(lazy(() => import('pages/extra-pages/contrats/NouveauContrat')));
const ContratVisualisation = Loadable(lazy(() => import('pages/extra-pages/contrats/ContratReview')));
const AttestationVisualisation = Loadable(lazy(() => import('pages/extra-pages/contrats/AttestationReview')));
const ClientContrat = Loadable(lazy(() => import('pages/extra-pages/contrats/ClientContrat')));
const Simulation = Loadable(lazy(() => import('pages/extra-pages/contrats/Simulation')));
const ClientDetails = Loadable(lazy(() => import('pages/extra-pages/clients/ClientDetails')));
const DemandeClients = Loadable(lazy(() => import('pages/extra-pages/clients/DemandeClient')));
const SinistreDetails = Loadable(lazy(() => import('pages/extra-pages/sinistres/DetailsSinistre')));
const Sinistre = Loadable(lazy(() => import('pages/extra-pages/sinistres/Sinistres')));
const NouveauSinistre = Loadable(lazy(() => import('pages/extra-pages/sinistres/NouveauSinistre')));
const Arriere = Loadable(lazy(() => import('pages/extra-pages/arrieres/Comparaison')));
const UserPage = Loadable(lazy(() => import('pages/extra-pages/users/User')));
const UserProfile = Loadable(lazy(() => import('pages/extra-pages/users/UserProfile')));
const ContratAgence = Loadable(lazy(() => import('pages/extra-pages/contrats/ContratAgence')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: 'nyhavana',
  element: <Dashboard />,
  children: [
    {
      path: 'dashboard',
      element: <DashboardDefault />
    },
    {
      path: 'users',
      element: <UserPage />
    },
    {
      path: 'departements',
      element: <Departement />
    },
    {
      path: 'clientContrat',
      element: <ClientContrat />
    },
    {
      path: 'contrats',
      element: <Contrat />
    },
    {
      path: 'sinistre/:idSinistre',
      element: <SinistreDetails />
    },
    {
      path: 'sinistre',
      element: <Sinistre />
    },
    {
      path: 'new-sinistre',
      element: <NouveauSinistre />
    },
    {
      path: 'clients',
      element: <ClientsTable />
    },
    {
      path: 'demandes',
      element: <DemandeClients />
    },
    {
      path: 'profile',
      element: <UserProfile />
    },
    {
      path: 'simulation',
      element: <Simulation />
    },
    {
      path: 'contrat/:idContrat',
      element: <DetailsContrat />
    },
    {
      path: 'contrat-agence',
      element: <ContratAgence />
    },
    {
      path: 'client/:idClient',
      element: <ClientDetails />
    },
    {
      path: 'contrat-visualisation/:idContrat',
      element: <ContratVisualisation />
    },
    {
      path: 'attestation-review/:idContrat',
      element: <AttestationVisualisation />
    },
    {
      path: 'new-contrat',
      element: <NewContrat />
    },
    {
      path: 'arrieres',
      element: <Arriere />
    }

  ]
};

export default MainRoutes;
