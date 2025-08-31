import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonModal,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useState, useRef } from 'react';
import { OverlayEventDetail } from '@ionic/core/components';
import "./Budgets.css";
import { nanoid } from 'nanoid';
import { ellipsisVerticalSharp as ellipsesIcon } from 'ionicons/icons';

const Budgets: React.FC = () => {

  const testData = [{ id: nanoid(), name: "Test Budget" }]
  const modal = useRef<HTMLIonModalElement>(null);
  const input = useRef<HTMLIonInputElement>(null);
  function confirm() {
    modal.current?.dismiss(input.current?.value, 'confirm');
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text={``} />
          </IonButtons>
          <IonTitle>Budgets</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          {
            testData.map(budget => {
              return (
                <IonItemSliding>
                  <IonItem key={budget.id} routerLink={`/budgets/${budget.id}`}>
                    <IonLabel>{budget.name}</IonLabel>

                  </IonItem>
                  <IonItemOptions>
                    <IonItemOption color="primary">Edit</IonItemOption>
                    <IonItemOption color="danger">Delete</IonItemOption>
                  </IonItemOptions>
                </IonItemSliding>
              )
            })
          }
        </IonList>
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonFooter>
            <IonToolbar>
              <IonButton id="open-modal" expand="block" fill="outline">Add Budget</IonButton>
            </IonToolbar>
          </IonFooter>
        </IonToolbar>
      </IonFooter>
      <IonModal ref={modal} trigger="open-modal">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={() => modal.current?.dismiss()}>Cancel</IonButton>
            </IonButtons>
            <IonTitle>Add Budget</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => confirm()}>
                Save
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonItem>
            <IonInput
              label="Budget Name"
              labelPlacement="floating"
              ref={input}
              type="text"
              placeholder="Your name"
            />
          </IonItem>
        </IonContent>
      </IonModal>
    </IonPage >
  );
};

export default Budgets;
