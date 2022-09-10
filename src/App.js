import React, { useEffect, useState } from 'react'
import './App.css';
import { Box, FormControl, Select, MenuItem, TextField } from '@mui/material';
import { XMLParser } from 'fast-xml-parser'

const parser = new XMLParser()

function App() {
  const [currencies, setCurrencies] = useState([]);
  const [firstCurrency, setFirstCurrency] = useState('USD');
  const [secondCurrency, setSecondCurrency] = useState('RUB');
  const [value, setValue] = useState('');

  useEffect(() => {
    fetch('https://www.cbr-xml-daily.ru/daily_utf8.xml')
      .then(res => res.text())
      .then(res => parser.parse(res))
      .then(res => res.ValCurs.Valute)
      .then(res => [{ CharCode: "RUB", Name: "Российский Рубль", Value: "1" }, ...res])
      .then(setCurrencies)
  }, [])
  const firstCurrencyChangeHandler = (event) => {
    setFirstCurrency(event.target.value)
  }
  const secondCurrencyChangeHandler = (event) => {
    setSecondCurrency(event.target.value)
  }
  const valueChangeHandler = (event) => {
    setValue(event.target.value)
  }

  const firstCurrencyValue = (+currencies
    .find((currency => currency.CharCode === firstCurrency))
    ?.Value
    ?.replace(',', '.')) || 0
  const secondCurrencyValue = (+currencies
    .find((currency => currency.CharCode === secondCurrency))
    ?.Value
    ?.replace(',', '.')) || 0

  const rubResult = value * firstCurrencyValue
  const result = rubResult / secondCurrencyValue

  return (
    <Box sx={{ display: 'flex', gap: 2, m: 5, width: 300 }}>
      <Box>
        <TextField fullWidth variant="standard" value={value} onChange={valueChangeHandler} />
        <FormControl fullWidth>
          <Select
            variant='standard'
            value={firstCurrency}
            onChange={firstCurrencyChangeHandler}
          >
            {currencies.map(currency =>
              <MenuItem dense key={currency.CharCode}
                value={currency.CharCode}>
                {currency.Name}
              </MenuItem>
            )}
          </Select>
        </FormControl>
      </Box>
      <Box>
        <TextField fullWidth variant="standard" disabled value={result.toFixed(2)} />
        <FormControl fullWidth>
          <Select
            variant="standard"
            value={secondCurrency}
            onChange={secondCurrencyChangeHandler}
          >
            {currencies.map(currency =>
              <MenuItem dense key={currency.CharCode}
                value={currency.CharCode}>
                {currency.Name}
              </MenuItem>
            )}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}

export default App;
