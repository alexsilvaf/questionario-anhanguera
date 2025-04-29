# Estudante 360

## Overview

Estudante 360 is a web application built with React, React Router, Vite, Bootstrap, and TypeScript.  
The application supports both light and dark themes with a custom gradient cursor effect in dark mode. It includes the following screens:
  - Tela Principal  
  - Matérias  
  - Editar Matéria  
  - Simulados da Matéria  
  - Editar Simulado  
  - Informações do Simulado  
  - Simulado em Andamento

## Technologies Used

* React 19.0.0  
* React Router Dom 7.3.0  
* Vite 6.2.0  
* Bootstrap  
* TypeScript

## Screens

### Tela Principal  
The screen displays summarized details of the best scores achieved by students in simulated tests, along with the average score.

### Matérias  
This screen shows the subjects contained in the subjects table. For administrators, there are options to delete, edit, or add a subject.  
When the delete button is selected, a confirmation alert should be displayed asking if the user is sure they want to delete that subject.

### Editar Matéria  
This screen displays the fields from the subjects table, allowing the editing of data such as the subject name and image.

### Simulados da Matéria  
This screen displays simulation options for each unit of the subject (for example: Simulado da Unidade 1, Unidade 2, Unidade 3, Unidade 4).  
It also shows a history of the scores achieved by the student. For administrators, the page displays options to delete, edit, or create a simulation.

### Editar Simulado  
When the edit simulation button is clicked, the option to change the simulation name, change the subject, and a question manager should be displayed,  
allowing the creation, editing, and deletion of questions.

### Informações do Simulado  
This screen is shown after the user selects a simulation. It should contain the simulation description, informing about the subject content and the average score.  
It also includes an option to start the simulation and a history of scores achieved by the user through the PanelMenu component.  
When the user clicks on a history item, the simulation's answer key should be displayed.

### Simulado em Andamento  
Upon starting the simulation, the system should display the following options to the user:  
1 - Answer question  
2 - Go back to the previous question  
3 - Skip question

## Setup and Running the Project

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

## Build

To create a production build:
```
npm run build
   ```

## Linting

To run the linter:
```
npm run lint
   ```

## Preview

To preview the production build locally:
```
npm run preview
   ```

## Notes

  The application uses a custom dark/light theme toggle.  
  A custom gradient cursor effect is applied in dark mode on the header.  
  The project is structured modularly with separate components for each screen.
