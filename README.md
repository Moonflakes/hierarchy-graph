## Intalling

Install packages:

### `npm install`

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

## Usage

Data visualization of product purchase and their subcategories by date.

Upload your hierarchy file in csv formated like [this data](src/data.csv).
- With level labels named `niveau_n+i` sort by asc (value string), 
- With date label named `date` (value string `dd/mm/yyyy`),
- With value label named `ventes` (value number)

This will display your hierarchy list and an associated graph.
You can click on hierarchy node to display datas on the graph.