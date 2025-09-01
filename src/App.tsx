import React, { useEffect, useState } from 'react';
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

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import './theme/variables.css';

function isAppleDevice() {
  return /Macintosh|iPad|iPhone|iPod/.test(navigator.userAgent);
}

setupIonicReact({
  mode: isAppleDevice() ? 'ios' : 'md'
});

const App: React.FC = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [dbReady, setDbReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initDB();
    loadFileOnLaunch();
  }, []);

  const loadFileOnLaunch = async () => {
    // Handle launch queue for file associations
    if ('launchQueue' in window) {
      (window as any).launchQueue.setConsumer(async (launchParams: any) => {
        if (launchParams.files && launchParams.files.length) {
          for (const fileHandle of launchParams.files) {
            const file = await fileHandle.getFile();
            const content = await file.text();
            await saveCsvToIndexedDB(file.name, content);
            initDB();
          }
        }
      });
    }
  };

  const saveCsvToIndexedDB = async (filename: string, content: string) => {
    try {
      const db = await openDB();
      const tx = db.transaction(['csvFiles'], 'readwrite');
      const store = tx.objectStore('csvFiles');
      await store.put({ filename, content, timestamp: Date.now() });
    } catch (error) {
      console.error('Error saving CSV to IndexedDB:', error);
    }
  };

  const initDB = async () => {
    try {
      const db = await openDB();
      const tx = db.transaction(['csvFiles'], 'readonly');
      const store = tx.objectStore('csvFiles');
      const allFiles = await getAllFromStore(store);
      setFiles(allFiles);
      setDbReady(true);
    } catch (error: any) {
      setError(error.message);
      setDbReady(true);
    }
  };

  const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('BudgetAppDB', 1);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('csvFiles')) {
          db.createObjectStore('csvFiles', { keyPath: 'filename' });
        }
      };
    });
  };

  const getAllFromStore = (store: IDBObjectStore): Promise<any[]> => {
    return new Promise((resolve) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => resolve([]);
    });
  };

  if (!dbReady) {
    return (
      <IonApp>
        <IonPage>
          <IonContent fullscreen className="ion-padding ion-text-center">
            <IonGrid className="ion-align-items-center ion-justify-content-center">
              <IonRow>
                <IonCol size="12">
                  <h1>Loading...</h1>
                  <p>Initializing app storage...</p>
                  {error && <p style={{ color: 'red' }}>{error}</p>}
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonContent>
        </IonPage>
      </IonApp>
    );
  }

  return (
    <IonApp>
      <IonReactRouter basename="/fucket">
        <IonTabs>
          <IonRouterOutlet>
            <Route path="/:id" component={BudgetDetails} />
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
              <Budgets />
            </Route>
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="budgets" href="/">
              <IonIcon icon={document} />
              <IonLabel>Budgets</IonLabel>
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