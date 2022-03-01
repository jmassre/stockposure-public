

function InputSection(){

    return(
        <div>
             <select name="type" id="cars">
                <option value="ETF">ETF</option>
                <option value="Stock">Stock</option>
            </select> 

            <input type="text" text="ETF/Stock Name"></input> 

            <select name="value" id="cars">
                <option value="Shares">Shares</option>
                <option value="$ Value">$ Value</option>
            </select>
            
            <input type="text" text="Value"></input> 
            
        </div>
        
        
    );
}

export default InputSection;