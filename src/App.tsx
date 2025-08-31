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
  const [directoryHandle, setDirectoryHandle] = useState(null);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);

  const requestDirectoryAccess = async () => {
    try {
      const handle = await window.showDirectoryPicker({
        id: 'budget-app-directory',
        mode: 'readwrite'
      });

      setDirectoryHandle(handle);
      loadFiles(handle);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError('Failed to access directory: ' + err.message);
      }
    }
  };

  const loadFiles = async (handle) => {
    try {
      const fileHandles = [];
      for await (const entry of handle.entries()) {
        const name = entry[0];
        const fileHandle = entry[1];
        if (fileHandle.kind === 'file' && name.endsWith('.csv')) {
          fileHandles.push(fileHandle);
        }
      }
      setFiles(fileHandles);
    } catch (err) {
      setError('Failed to load files: ' + err.message);
    }
  };

  const saveCSV = async (filename, content) => {
    if (!directoryHandle) return;

    try {
      const fileHandle = await directoryHandle.getFileHandle(filename, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(content);
      await writable.close();

      await saveToIndexedDB(filename, content);

      loadFiles(directoryHandle);
    } catch (err) {
      setError('Failed to save file: ' + err.message);
    }
  };

  const saveToIndexedDB = async (filename, content) => {
    const db = await openDB();
    const tx = db.transaction(['csvFiles'], 'readwrite');
    const store = tx.objectStore('csvFiles');
    await store.put({ filename, content, lastModified: Date.now() });
  };

  const openDB = () => {
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

  if (!directoryHandle) {
    return (
      <IonApp>
        <IonPage>
          <IonContent fullscreen className="ion-padding ion-text-center">
            <IonGrid className="ion-align-items-center ion-justify-content-center">
              <IonRow>
                <IonCol size="12">
                  <h1>Directory Access Required</h1>
                  <p>
                    This app requires access to a directory to store and retrieve your budget files.
                    Please grant persistent access to continue.
                  </p>
                  <IonButton expand="block" onClick={requestDirectoryAccess}>
                    Select Directory
                  </IonButton>
                  {error && (
                    <p style={{ color: 'red', marginTop: '1rem' }}>
                      {error}
                    </p>
                  )}
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
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/home">
              <Home files={files} saveCSV={saveCSV} />
            </Route>
            <Route exact path="/budgets">
              <Budgets />
            </Route>
            <Route path="/budget/:id">
              <BudgetDetails />
            </Route>
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
              <Redirect to="/home" />
            </Route>
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="home" href="/home">
              <IonIcon icon={home} />
              <IonLabel>Home</IonLabel>
            </IonTabButton>
            <IonTabButton tab="budgets" href="/budgets">
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