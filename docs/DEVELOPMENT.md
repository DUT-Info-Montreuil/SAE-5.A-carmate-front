# Documentation nécéssaire pour œuvrer au développement du projet

---

### Prérequis

- Node.js et npm installés localement
- Angular CLI installé globalement (`npm install -g @angular/cli`)

## Ce projet utilise Tailwind CSS en guise de framework CSS

### Installation

Pour installer Tailwind CSS, PostCSS et Autoprefixer :  
`npm install tailwindcss postcss autoprefixer`

En cas de problème, voir avec [LiberiBg](https://github.com/LiberiBg)

## Ce projet nécéssite Angular/material pour la plupart de ses composants graphiques

### Installation

`ng add @angular/material`

## Ce projet nécéssite ESLint, un linter statique utilisé pour identifier le code non conforme

### Installation

`npm install eslint --save-dev`

La configuration se trouve dans le fichier **.eslintrc.json**

#### Extension pour Visual Studio Code

[ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

## Ce projet nécéssite Prettier, un formateur de code qui permet de maintenir un codestyle

### Installation

`npm install --save-dev prettier`

La configuration se trouve dans le fichier **.prettierrc.json**

#### Extension pour Visual Studio Code

[Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
[Prettier ESLint](https://marketplace.visualstudio.com/items?itemName=rvest.vs-code-prettier-eslint)

**Tips** : Modifier le formatter par défaut dans les paramètres de VS Code et sélectionner Prettier, activer l'auto-formatage à l'enregistrement du fichier.
