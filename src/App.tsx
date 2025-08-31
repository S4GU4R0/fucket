import React, { useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact, IonTabs, IonTabBar, IonTabButton, IonLabel, IonIcon, IonContent, IonPage, IonGrid, IonRow, IonCol, IonButton } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Budgets from './pages/Budgets';
import BudgetDetails from './pages/BudgetDetails';
import Home from './pages/Home';
import Settings from './pages/Settings';
import Templates from './pages/Templates';
import Tools from './pages/Tools';
import { home, document, construct, settings } from 'ionicons/icons';
import { useFs } from 'use-fs';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

// Matches all Apple devices (Safari/Chrome/Firefox/etc.)
function isAppleDevice() {
  return /Macintosh|iPad|iPhone|iPod/.test(navigator.userAgent);
}

setupIonicReact({
  mode: isAppleDevice() ? 'ios' : 'md'
});

const App: React.FC = () => {
  // Use the hook at the top level
  const {
    files,
    requestPermission,
    granted,
    error
  } = useFs({
    type: 'directory',
    id: 'budget-app-directory'
  });

  // Example: Log files when access is granted
  useEffect(() => {
    if (granted && files) {
      console.log('Access granted to directory. Files:', files);
    }
  }, [granted, files]);

  // If permission is not granted, render a page asking for it
  if (!granted) {
    return (
      <IonApp>
        <IonPage>
          <IonContent fullscreen className="ion-padding ion-text-center">
            <IonGrid className="ion-align-items-center ion-justify-content-center">
              <IonRow>
                <IonCol size="12">
                  <h1>File Access Required</h1>
                  <p>
                    This app requires access to a directory to store and retrieve your budget files.
                    Please grant persistent access to continue.
                  </p>
                  <IonButton expand="block" onClick={requestPermission}>
                    Grant File Access
                  </IonButton>
                  {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonContent>
        </IonPage>
      </IonApp>
    );
  }

  // If permission is granted, render the main app
  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/budgets">
              <Budgets />
            </Route>
            <Route exact path="/budgets/:id" component={BudgetDetails} />
            <Route exact path="/templates">
              <Templates />
            </Route>
            <Route exact path="/tools">
              <Tools />
            </Route>
            <Route exact path="/settings">
              <Settings />
            </Route>
            <Route exact path="/">
              <Home />
            </Route>
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="budgets" href="/budgets">
              <IonIcon icon={home} />
              <IonLabel>Budgets</IonLabel>
            </IonTabButton>
            <IonTabButton tab="templates" href="/templates">
              <IonIcon icon={document} />
              <IonLabel>Templates</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tools" href="/tools">
              <IonIcon icon={construct} />
              <IonLabel>Tools</IonLabel>
            </IonTabButton>
            <IonTabButton tab="settings" href="/settings">
              <IonIcon icon={settings} />
              <IonLabel>Settings</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;