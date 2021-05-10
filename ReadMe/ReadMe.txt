Installation de l'application : 

1-Clôner le répertoire github sur votre PC, pour se faire, copier le lien du répertoire github, puis utiliser la commande git clone et coller le lien avant de valider la commande.

Vous pouvez vous référer au pdf github présent dans le dossier, pour vous aider.

2-Importez la base de donnée, sur votre serveur SQL en utilisant le fichier SQL présent dans le dossier "README". Pour ce se faire, lancez MySQL WorkBench 8.0, puis cliquez sur administration, puis data import. Selectionnez import from self-contained file et selectionnez le fichier SQL. Selectionnez dump structure and data puis cliquez sur start import.

3-Ouvrez un panneau de commande dans le sous-dossier back-end présent dans le dossier Projet-7. Utilisez la commande npm install pour installer tous les modules.

4-Allez dans le sous dossier front-end, puis utilisez la commande npm install. Ensuite allez dans le dossier app-vue-cli et refaites un npm install.

5-Créez un fichier .env et placer dedans la clé du token ainsi que les informations de connexion au serveur SQL (host, nom de la base de donnée, mot de passe). La clé et les informations seront déclaré dans des variables qui auront les noms suivant :

SECRET_TOKEN_KEY = la clé qui sera une suite de chiffre et de lettre.

DB_NAME = nom de votre base de donnée.

DB_HOST_NAME = nom du de l'hébergeur du serveur SQL.

DB_PASSWORD = mot de passe du serveur SQL.

DB_HOST = nom de l'hébergeur, ex: localhost.

DB_DIALECT = le language du serveur utilisé, ici ça sera "mysql"

6-Lancez le serveur back-end en utilisant la commande npm start.

7-Lancez l'application front-end en utilisant la commande npm run serve.

Voilà, vous pouvez maintenant utiliser l'application.



 

