import * as React from 'react';
import { FlexBox } from "react-styled-flex";
import { MuiThemeProvider, createTheme } from "@material-ui/core/styles";
import CssBaseline from '@material-ui/core/CssBaseline';
import TableCustom from './TableCustom.js';
import { SubTitle, PageColor, Title } from './StyledComponents.js';
import Form from './Form.js';

function App(props) {
	
	const myRef = React.useRef(null);
	const [rows, setRows] = React.useState();
	const [showTable, setShowTable] = React.useState(false);

	const columns = [
		{field: "ticker", headerName: "Stock", width:150, id: "ticker", minWidth:150, label: "Stock"},
		{field: "percentage", headerName: "Percent of Portfolio", width: 200, id: "percentage", minWidth:200, label: "Percent of Portfolio"},
		{field: "totalVal", headerName: "$ Value", width:175, id: "totalVal", minWidth:175, label: "$ Value"}
    ]

	const theme = createTheme({
		palette: {
		  type: "dark",
		}
	});
	
	const executeScroll = () => myRef.current.scrollIntoView()
	
	return (
		<MuiThemeProvider theme={theme}>
			<CssBaseline />
				<PageColor>
					<Title>ETF/Stock Exposure</Title>
					<SubTitle>A place to analyze exposure of individual stocks within a portfolio of ETFs and stocks. Enjoy!</SubTitle>
					<Form executeScroll={executeScroll} getData={(rows, showTable)=>{
						setRows(rows);
						setShowTable(showTable);
					}}/>
					{showTable?
					<FlexBox justifyContent="center" alignItems="center">
						<div ref={myRef} style={{ height: 600, width: '50%', marginTop: "100px", marginBottom:"100px"}}>
						
						<TableCustom rows={rows} columns={columns}  />
							

					</div>
					</FlexBox>: ""
					}
				</PageColor>
		</MuiThemeProvider>
  	);
}		

export default App;
