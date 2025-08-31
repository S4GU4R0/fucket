import { RouteComponentProps } from 'react-router-dom';
import {
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonItem,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonLabel,
    IonList,
    IonPage,
    IonTitle,
    IonToolbar,
} from "@ionic/react";
import React from "react";
import "./BudgetDetails.css";

interface BudgetDetailsProps extends RouteComponentProps<{ id: string }> { }

const BudgetDetails: React.FC<BudgetDetailsProps> = ({ match }) => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton text={`Budgets`} />
                    </IonButtons>
                    <IonTitle>Budgets</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>

                <IonList>
                    <IonItemSliding>
                        <IonItem>
                            <IonLabel>
                                <div>Item ID: {match?.params?.id}</div>
                            </IonLabel>
                        </IonItem>

                        <IonItemOptions>
                            <IonItemOption>Favorite</IonItemOption>
                            <IonItemOption color="danger">Delete</IonItemOption>
                        </IonItemOptions>
                    </IonItemSliding>

                    <IonItemSliding>
                        <IonItemOptions side="start">
                            <IonItemOption color="success">Archive</IonItemOption>
                        </IonItemOptions>

                        <IonItem>
                            <IonLabel>Sliding Item with Start Options</IonLabel>
                        </IonItem>
                    </IonItemSliding>

                    <IonItemSliding>
                        <IonItemOptions side="start">
                            <IonItemOption color="success">Archive</IonItemOption>
                        </IonItemOptions>

                        <IonItem>
                            <IonLabel>Sliding Item with Options on Both Sides</IonLabel>
                        </IonItem>

                        <IonItemOptions side="end">
                            <IonItemOption>Favorite</IonItemOption>
                            <IonItemOption color="danger">Delete</IonItemOption>
                        </IonItemOptions>
                    </IonItemSliding>
                </IonList>

            </IonContent>
        </IonPage>
    );
};

export default BudgetDetails;
