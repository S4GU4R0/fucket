import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonBackButton, IonFooter, IonTabBar, IonTabButton, IonLabel, IonIcon } from '@ionic/react';
import { home, document, construct, settings } from 'ionicons/icons';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          {/* Centered title for tab page, matching iOS tab bar conventions */}
          <IonTitle>Budgets</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {/* Main area content goes here */}
        <ExploreContainer />
      </IonContent>
  {/* Tab bar removed. Should be placed at the app level, not inside individual pages. */}
    </IonPage>
  );
};

export default Home;
