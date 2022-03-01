import * as React from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { FlexBox } from "react-styled-flex";
import Button from '@material-ui/core/Button';
import {ButtonStyle,TopFlex, FlexItem,LastText, TotalButton,ErrorLabel} from './StyledComponents.js';

const axios = require('axios');

function Form(props){
    const [rows, setRows] = React.useState();
	const [etfStockType, setEtfStockType] = React.useState('ETF');
	const [unit, setUnit] = React.useState('Shares');
	const [isValidStockTicker, setIsValidStockTicker] = React.useState(true);
	const [isValidETFTicker, setIsValidETFTicker] = React.useState(true);
	const [showTable, setShowTable] = React.useState(false);
	const [formValues, setFormValues] = React.useState([{ "type": "ETF", "ETFStock" : "", "value":"Shares", "ValueShare":""}])
	const [triedSubmit, setTriedSubmit] = React.useState(false);
	const [empty, setEmpty] = React.useState(false);
    const [isNumber, setIsNumber] = React.useState(true);
    
    async function sendGetRequest(etfValues, etfShares, stockValues, stockShares){
		let stocks = {};
		let etfs = [];
		let individualStocks=[];
		let totalOverallValue=0;
		for (let i=0; i<etfValues.length;i++){
			etfs.push({"etf": etfValues[i]["ticker"], "value": etfValues[i]["value"]});
			totalOverallValue+=etfValues[i]["value"];
		}
		for (let i=0; i<etfShares.length;i++){
			await axios.get(`https://financialmodelingprep.com/api/v3/quote-short/${etfShares[i]["ticker"]}?apikey=`)
			.then((response) => {
				etfs.push({"etf": etfShares[i]["ticker"], "value": etfShares[i]["shares"]*response.data[0]["price"]});
				totalOverallValue+=etfShares[i]["shares"]*response.data[0]["price"];
			})
			.catch(function (error){
				setIsValidETFTicker(false);
			});;
		}

		for (let i=0;i<stockValues.length;i++){
			individualStocks.push({"stock": stockValues[i]["ticker"], "value":stockValues[i]["value"]});
			totalOverallValue+=stockValues[i]["value"];
		}
		

		for (let i=0;i<stockShares.length;i++){
			await axios.get(`https://financialmodelingprep.com/api/v3/quote-short/${stockShares[i]["ticker"]}?apikey=`)
				.then((response) => {
					
					individualStocks.push({"stock": stockShares[i]["ticker"], "value": stockShares[i]["shares"]*response.data[0]["price"]});
					totalOverallValue+=stockShares[i]["shares"]*response.data[0]["price"];
				})
				.catch(function (error){
					setIsValidStockTicker(false);
				});
		}
		//now we have [{stock:AAPL, value 50}, {stock:MSFT, value 50}]
		for(let i=0 ;i<etfs.length;i++){
			await axios.get(`https://fmpcloud.io/api/v3/etf-holder/${etfs[i]["etf"]}?apikey=`)
			.then((response) => {
				for (let j=0;j<response.data.length;j++){
					stocks[response.data[j]["asset"]] = stocks[response.data[j]["asset"]] ? [((response.data[j]["weightPercentage"]/100)*etfs[i]["value"])/totalOverallValue + stocks[response.data[j]["asset"]][0],(((response.data[j]["weightPercentage"]/100)*etfs[i]["value"])/totalOverallValue + stocks[response.data[j]["asset"]][0])*totalOverallValue] : [((response.data[j]["weightPercentage"]/100)*etfs[i]["value"])/totalOverallValue,(((response.data[j]["weightPercentage"]/100)*etfs[i]["value"])/totalOverallValue)*totalOverallValue];
				}
			})
			.catch(function (error){
				setIsValidETFTicker(false);
			});;       
		}
	  
		for (let i=0;i<individualStocks.length;i++){
			stocks[individualStocks[i]["stock"]] = stocks[individualStocks[i]["stock"]] ? [(individualStocks[i]["value"]/totalOverallValue + stocks[individualStocks[i]["stock"]][0]),(individualStocks[i]["value"]/totalOverallValue + stocks[individualStocks[i]["stock"]][0])*totalOverallValue]: [(individualStocks[i]["value"]/totalOverallValue),(individualStocks[i]["value"]/totalOverallValue)*totalOverallValue];
			
		}

		
		return stocks;
		
    };
    
	const useStyles = makeStyles((theme) => ({
        root: {
          '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
          },
        },
        formControl: {
          margin: theme.spacing(1),
          minWidth: 120,
        },
        selectEmpty: {
          marginTop: theme.spacing(2),
        },
    }));

	function createData(id,ticker, percentage, totalVal) {
		return {
		  id,
		  ticker,
		  percentage,
		  totalVal,
		};
	}

    let handleChange = (i, e) => {
        let newFormValues = [...formValues];
        newFormValues[i][e.target.name] = e.target.value;
		setFormValues(newFormValues);
	}
	
    let addFormFields = () => {
		setFormValues([...formValues, { "type": "ETF", "ETFStock" : "", "value":"Shares", "ValueShare":""}])
		setIsNumber(true);
		setIsValidStockTicker(true);
		setIsValidETFTicker(true);
		setEmpty(false);
    }
    
    let removeFormFields = (i) => {
        let newFormValues = [...formValues];
        newFormValues.splice(i, 1);
        setFormValues(newFormValues)
	}
	

	const isNumeric = num => /^-?[0-9]+(?:\.[0-9]+)?$/.test(num+'');

    let handleSubmit = (event) => {
		setIsNumber(true);
		setIsValidStockTicker(true);
		setIsValidETFTicker(true);
		setEmpty(false);
		event.preventDefault();
		setTriedSubmit(true);
		let getOut=false;
		formValues.forEach(function (item, index) {
			if(item["ETFStock"]==="" || item["ValueShare"]===""){
				setEmpty(true);
				getOut=true;
				return;
			}
			if(isNumeric(item["ValueShare"])===false){
				setIsNumber(false);
				getOut=true;
				return;
			}
			
		});

		if(getOut===false){
			let etfShares=[];
			let etfValues=[];
			let stockShares=[];
			let stockValues=[];
			for (let i=0;i<formValues.length;i++){
				if(formValues[i]["type"]==="ETF" && formValues[i]["value"]==="Shares"){
					etfShares.push({"ticker":formValues[i]["ETFStock"].toUpperCase(), "shares":parseFloat(formValues[i]["ValueShare"])});
				}
				else if(formValues[i]["type"]==="ETF" && formValues[i]["value"]==="$ Value"){
					etfValues.push({"ticker":formValues[i]["ETFStock"].toUpperCase(), "value":parseFloat(formValues[i]["ValueShare"])});
				}
				else if(formValues[i]["type"]==="Stock" && formValues[i]["value"]==="Shares"){
					stockShares.push({"ticker":formValues[i]["ETFStock"].toUpperCase(), "shares":parseFloat(formValues[i]["ValueShare"])});
				}
				else if(formValues[i]["type"]==="Stock" && formValues[i]["value"]==="$ Value"){
					stockValues.push({"ticker":formValues[i]["ETFStock"].toUpperCase(), "value":parseFloat(formValues[i]["ValueShare"])});
				}
			}
	
			let percentages = sendGetRequest(etfValues, etfShares, stockValues, stockShares);
			
			percentages.then(function(result) {
				let entries = Object.entries(result);

				let sorted = entries.sort((a, b) => b[1][1] - a[1][1]);
				let newRows=[];
				for (let i=0;i<sorted.length;i++){
					newRows.push(createData(i,sorted[i][0], (sorted[i][1][0]*100).toFixed(2) + '%',"$"+sorted[i][1][1].toFixed(2)))
				}
				setRows(newRows);
                setShowTable(true);
                sendData(newRows, true);
				props.executeScroll();
				
			})
		}
		
    }
	
	const classes = useStyles();
    function sendData(rows, showTable){
        console.log(showTable);
        props.getData(rows, showTable);
    }
    return(
        <TopFlex>
            <form  className={classes.root} onSubmit={handleSubmit}>
            {formValues.map((element, index) => (
            <div className="form-inline" key={index}>
                <FlexBox justifyContent="center" alignItems="center">
                    <FlexItem>
                        <FormControl className={classes.formControl}>
                        <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                            ETF or Stock
                        </InputLabel>
                        <Select name="type" onChange={e =>
                            handleChange(index, e)} labelId="demo-simple-select-placeholder-label-label"
                            id="demo-simple-select-placeholder-label" displayEmpty className={classes.selectEmpty} value={formValues[index]["type"]}>
                            <MenuItem value="ETF">ETF</MenuItem>
                            <MenuItem value ="Stock">Stock</MenuItem>
                        </Select>
                        </FormControl>
                    </FlexItem>
                    <FlexItem>
                        <TextField style = {{width: 150}}  id="outlined-basic" variant ="outlined" type="text" name="ETFStock" value={element.ETFStock || ""} onChange={e => handleChange(index, e)} />
                    </FlexItem>
                    <FlexItem>
                        <FormControl className={classes.formControl}>
                        <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                            Unit
                        </InputLabel>
                        <Select name="value" onChange={e =>
                            handleChange(index, e)} labelId="demo-simple-select-placeholder-label-label"
                            id="demo-simple-select-placeholder-label" displayEmpty className={classes.selectEmpty} value={formValues[index]["value"]}>
                            <MenuItem value="Shares">Shares</MenuItem>
                            <MenuItem value ="$ Value">$ Value</MenuItem>
                        </Select>
                        </FormControl>
                    </FlexItem>
                    <FlexItem>
                        <LastText>
                        <TextField style = {{width: 150}} id="outlined-basic" variant ="outlined" type="text" name="ValueShare" value={element.ValueShare || ""} onChange={e => handleChange(index, e)} />
                        </LastText>
                    </FlexItem>
                    {
                    index>0 ? 
                    <FlexItem>
                        <Button variant="contained" type="button"  className="button remove" onClick={() => removeFormFields(index)}>Remove</Button>
                    </FlexItem>
                    : 
                    <FlexItem><Button variant="contained" disabled type="button"  className="button remove" onClick={() => removeFormFields(index)}>Remove</Button></FlexItem>
                    }
                </FlexBox>
            </div>
            ))}
            {triedSubmit && empty? 
            <ErrorLabel>All inputs must be filled</ErrorLabel>
            :  triedSubmit && isNumber===false ? 
            <ErrorLabel>Value input must be a valid number</ErrorLabel>
            : triedSubmit && isValidStockTicker===false? 
            <ErrorLabel>Ensure that it is a valid stock ticker!</ErrorLabel>
            :triedSubmit && isValidETFTicker===false?
            <ErrorLabel>Ensure that it is a valid ETF!</ErrorLabel>
            :""}
            <div className="button-section">
                <TotalButton>
                    <ButtonStyle>
                        <Button style = {{width: 92, height:45}}  variant="contained" color="primary" className="button add" type="button" onClick={() => addFormFields()}>
                        Add
                        </Button>
                    </ButtonStyle>
                    <Button style = {{width: 92, height:45}}  variant="contained" color="primary" className="button submit" type="submit">
                    Submit
                    </Button>
                </TotalButton>
            </div>
            </form>
        </TopFlex>

    )

}

export default Form;