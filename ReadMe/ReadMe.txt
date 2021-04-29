Concernant la base de données :

Créer une base de données nommé "test", ensuite utiliser les fichiers SQL pour créer les tables avec MysSQL Workbench.

Concernant le token key : 

Il faudra utiliser dotenv pour créer la token key, pour ce faire installer dotenv ensuite faire une require('dotenv').config(), sur le fichier concerné.

Créer un fichier .env qui contiendra la viariable de la clé du token.

Il suffira ensuite de revenir sur le fichier qui appel la variable et faire un process.env (dans la constante qui contiendra la clé du token) pour importer la clé.

