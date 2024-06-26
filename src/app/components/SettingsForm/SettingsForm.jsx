"use client";

import React, { useEffect, useState } from "react";
import { getSettings, updateSettings } from "@/app/helpers/settingsActions";
import { getClothesJSON, updateClothesJSON } from "@/app/helpers/clothesJSONActions";

import "./styles.css";

/**
 * Represents a form for managing settings.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.className - The CSS class name for the component.
 * @returns {JSX.Element} The rendered component.
 */
const SettingsForm = ({ className }) => {
    // Initialize state variables
    const [formState, setFormState] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [updatingSettings, setUpdatingSettings] = useState(false);
    const [error, setError] = useState("");

    // Fetch settings data when component mounts
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            // Fetch settings data
            const settingsData = await getSettings();
            // format the APEL part to be displayed as a percentage
            // (it is stored as a decimal in the database)
            // add the clothesJSON data to the form state
            settingsData.APELPart *= 100;

            // Fetch clothesJSON data
            const jsonData = await getClothesJSON();
            settingsData.clothesJSON = JSON.stringify(jsonData, null, 4);

            setFormState(settingsData);

            setIsLoading(false);
        };
        fetchData();
    }, []);

    // Handle form changes
    const handleChange = (event) => {
        // Extract the name, value, checked and type from the event target
        const { name, value, checked, type } = event.target;
        const newValue = type === "checkbox" ? checked : value;

        // Check if the JSON is valid
        if (name == "clothesJSON") {
            try {
                JSON.parse(newValue);
                setError("");
            } catch (e) {
                setError(e.message);
            }
        }

        // Update the form state
        if (name === "publicAccess" && !newValue) {
            setFormState((prevState) => ({
                ...prevState,
                allowArticleRegistration: false,
                endRegisterDate: null,
                publicAccess: newValue,
            }));
        } else if (name === "allowArticleRegistration" && !newValue) {
            setFormState((prevState) => ({
                ...prevState,
                endRegisterDate: null,
                allowArticleRegistration: newValue,
            }));
        } else {
            let updatedValue = newValue;
            if (name === "endRegisterDate" && new Date(newValue) < new Date()) {
                updatedValue = new Date().toISOString().split("T")[0];
            }
            setFormState((prevState) => ({
                ...prevState,
                [name]: updatedValue,
            }));
        }
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        setUpdatingSettings(true);

        // Check if the JSON is valid (its the only field that can raise an error)
        if (error)
            return alert(
                "Erreur dans le JSON des vêtements, veuillez corriger.",
            );

        // Update the clothesJSON if the checkbox is checked
        if (formState.clothesInputCheckbox){
            const clothesJSON = await JSON.parse(formState.clothesJSON);
            await updateClothesJSON(clothesJSON);
        }

        // Prepare the data to be pushed
        const toPushSettings = { ...formState };
        // Remove the clothesJSON from the toPushSettings
        const clothesJSONBackup = formState.clothesJSON;
        toPushSettings.clothesInputCheckbox = undefined;
        toPushSettings.clothesJSON = undefined;

        // format the APEL part to be stored as a decimal
        toPushSettings.APELPart = parseFloat(toPushSettings.APELPart) / 100;
        toPushSettings.returnFees = parseFloat(toPushSettings.returnFees);
        await updateSettings(toPushSettings);

        alert("Paramètres enregistrés avec succès!");

        setUpdatingSettings(false);
    };

    return (
        <div className={className}>
            <form onSubmit={handleSubmit} className="flex-column width-full">
                {isLoading ? (
                    <p className="text-center">Chargement...</p>
                ) : (
                    <div className="flex-column gap-30 width-full">
                        {/* Access parameters */}
                        <div>
                            <h3>Paramètres Généraux</h3>
                            <span className="flex-justify-space-between">
                                <label>Site ouvert</label>
                                <input
                                    type="checkbox"
                                    name="publicAccess"
                                    className="checkbox"
                                    checked={formState.publicAccess}
                                    onChange={handleChange}
                                />
                            </span>

                            {formState.publicAccess && (
                                 <span className="flex-justify-space-between">
                                    <label>
                                        Autoriser l'ajout/modification
                                        d'articles
                                    </label>
                                    <input
                                        type="checkbox"
                                        name="allowArticleRegistration"
                                        className="checkbox"
                                        checked={
                                            formState.allowArticleRegistration
                                        }
                                        onChange={handleChange}
                                    />
                                </span>
                            )}

                            {formState.allowArticleRegistration && (
                                 <span className="flex-justify-space-between">
                                    <label>Fin des enregistrements</label>
                                    <input
                                        type="date"
                                        name="endRegisterDate"
                                        className="checkbox"
                                        value={
                                            formState.endRegisterDate ||
                                            new Date()
                                                .toISOString()
                                                .split("T")[0]
                                        }
                                        onChange={handleChange}
                                    />
                                </span>
                            )}
                        </div>

                        {/* Accounting parameters */}
                        <div>
                            <h3>Comptabilité</h3>
                             <span className="flex-justify-space-between">
                                <label>Part de l'APEL</label>
                                <span style={{ width: "min-content" }}>
                                    <input
                                        type="number"
                                        name="APELPart"
                                        className="checkbox"
                                        value={formState.APELPart}
                                        onChange={handleChange}
                                        min="0"
                                        max="100"
                                        style={{
                                            textAlign: "right",
                                            maxWidth: "100px",
                                        }}
                                    />
                                    %
                                </span>
                            </span>

                             <span className="flex-justify-space-between">
                                <label>Frais de renvoi</label>
                                <span style={{ width: "min-content" }}>
                                    <input
                                        type="number"
                                        name="returnFees"
                                        className="checkbox"
                                        value={formState.returnFees}
                                        onChange={handleChange}
                                        min="0"
                                        max="100"
                                        style={{
                                            textAlign: "right",
                                            maxWidth: "100px",
                                        }}
                                    />
                                   &nbsp;€
                                </span>
                            </span>
                        </div>

                        {/* Clothes JSON */}
                        <div>
                            <h3>Liste des vêtements</h3>
                             <span className="flex-justify-space-between">
                                <label>
                                    Modifier le fichier JSON des vêtements :{" "}
                                </label>
                                <input
                                    type="checkbox"
                                    name="clothesInputCheckbox"
                                    className="checkbox"
                                    checked={
                                        formState.clothesInputCheckbox || false
                                    }
                                    onChange={handleChange}
                                />
                            </span>
                            <textarea
                                type="text"
                                name="clothesJSON"
                                value={formState.clothesJSON}
                                onChange={handleChange}
                                disabled={!formState.clothesInputCheckbox}
                                className="width-full height-200"
                            />
                            <p className="error self-center">{error}</p>
                        </div>

                        {/* Change password */}
                        <span id="changePasswordSpan">
                            <h3>Changer le mot de passe</h3>
                            <a href="/admin-panel/change-password-admin" className="margin-left-10">
                                Aministrateur
                            </a>
                            <a href="/admin-panel/change-password-benevole" className="margin-left-10">
                                Bénévole
                            </a>
                        </span>

                        <button
                            type="submit"
                            disabled={isLoading || updatingSettings}
                        >
                            Enregistrer
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default SettingsForm;
