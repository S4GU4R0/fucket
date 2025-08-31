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

const App = () => {
  const [files, setFiles] = useState([]);
  const [dbReady, setDbReady] = useState(false);

  // Initialize IndexedDB on app start
  useEffect(() => {
    initDB();
  }, []);

  const initDB = async () => {
    try {
      const db = await openDB();
      const tx = db.transaction(['csvFiles'], 'readonly');
      const store = tx.objectStore('csvFiles');
      const allFiles = await getAllFromStore(store);
      setFiles(allFiles);
      setDbReady(true);
    } catch (error) {
      console.error('Failed to initialize DB:', error);
      setDbReady(true); // Still allow app to work
    }
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

  const getAllFromStore = (store) => {
    return new Promise((resolve) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => resolve([]);
    });
  };

  const saveCSV = async (filename, content) => {
    try {
      const db = await openDB();
      const tx = db.transaction(['csvFiles'], 'readwrite');
      const store = tx.objectStore('csvFiles');

      const fileData = {
        filename: filename,
        content: content,
        lastModified: Date.now()
      };

      await new Promise((resolve, reject) => {
        const request = store.put(fileData);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      // Update files state
      const allFiles = await getAllFromStore(store);
      setFiles(allFiles);

    } catch (error) {
      console.error('Failed to save CSV:', error);
    }
  };

  const loadCSV = async (filename) => {
    try {
      const db = await openDB();
      const tx = db.transaction(['csvFiles'], 'readonly');
      const store = tx.objectStore('csvFiles');

      return new Promise((resolve, reject) => {
        const request = store.get(filename);
        request.onsuccess = () => resolve(request.result?.content || null);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Failed to load CSV:', error);
      return null;
    }
  };

  const handleFileUpload = async (event) => {
    const uploadedFiles = event.target.files;
    if (!uploadedFiles) return;

    for (const file of uploadedFiles) {
      try {
        const content = await file.text();
        await saveCSV(file.name, content);
      } catch (error) {
        console.error('Failed to process file:', file.name, error);
      }
    }
  };

  const downloadCSV = (filename, content) => {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
              <Home
                files={files}
                saveCSV={saveCSV}
                loadCSV={loadCSV}
                onFileUpload={handleFileUpload}
                onDownload={downloadCSV}
              />
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