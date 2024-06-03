"use client";

import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import data from './config.js';
import { getFaqs, sendFaq, publishFaq } from './graphql/faqs/index.js';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';



interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function changeTab(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function Nav() {

  const getTitle = (key) => {
    let sel = cat.find((c) => { return c.key == key })
    return sel?.name
  }

  const [value, setValue] = React.useState(0)
  const cat = data.categories.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))

  const [faqsData, setFaqsData] = React.useState([])
  const [faqsDataNormalized, setFaqsDataNormalized] = React.useState({})

  const textAsk = React.useRef();
  const textAnswer = React.useRef();
  const [ask, setAsk] = React.useState()
  const [answer, setAnswer] = React.useState()
  const [category, setCategory] = React.useState(cat[0].key)
  const [successMessage, setSuccessMessage] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState(false)
  const [insertedFaq, setInsertedFaq] = React.useState()

  const handleChangeCategory = (event: SelectChangeEvent) => {
    setCategory(event.target.value as string);
  };

  React.useEffect(() => {
    const getData = () => {
      return new Promise((resolve, reject) => {
        resolve(getFaqs())
      })
    }

    getData().then((result) => {
      setFaqsData(result?.props.faqs);
    })
  }, [])

  React.useEffect(() => {
    let data = {};

    cat.map((object) => {
      data[object.key] = []
    })

    faqsData.map((faq) => {
      data[faq.category].push(faq)
    })
    console.log("DATA NORMALIZED", data)
    setFaqsDataNormalized(data);

  }, [faqsData])

  React.useEffect(() => {

    if (insertedFaq) {

      const publish = publishFaq(insertedFaq)

      publish.then((res) => {
        console.log("publish", res)
        if (res?.publishFaq?.id) {
          getFaqs()
          setSuccessMessage(true)
        } else {
          setErrorMessage(true)
        }

      })
    }
  }, insertedFaq)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="FAQS" {...changeTab(0)} />
          <Tab label="Cadastrar" {...changeTab(1)} />
        </Tabs>
      </Box>
      {successMessage && (
        <Alert severity="success" onClose={() => { setSuccessMessage(false) }}>Cadastro realizado com sucesso!</Alert>
      )}
      {errorMessage && (
        <Alert severity="error" onClose={() => { setErrorMessage(false) }}>Não foi possível realizar o cadastro. Tente novamente mais tarde!</Alert>
      )}
      <CustomTabPanel value={value} index={0} key={0}>

        {Object.entries(faqsDataNormalized).map(([key, val]) => (
          <Accordion key={key}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={key}
              id={key}
            >
              {getTitle(key)}
            </AccordionSummary>
            <AccordionDetails>
              {val.map((item, key) => (
                <div key={key}>
                  <p className='ask'>{item.ask}</p>
                  <p className='answer'>{item.answer}</p>
                </div>

              ))}
            </AccordionDetails>
          </Accordion>
        ))}

      </CustomTabPanel>

      <CustomTabPanel value={value} index={1} key={1}>
        <Box className="form-box">
          <h4 className='page-title'>CADASTRO FAQ</h4>
          <TextField
            className="text"
            required
            id="outlined-required"
            //label="Pergunta"         
            placeholder="Pergunta"
            value={ask}
            fullWidth
            inputRef={textAsk}
          />
          <TextField
            className="text"
            required
            id="outlined-required"
            //label="Resposta"
            placeholder="Resposta"
            value={answer}
            fullWidth
            inputRef={textAnswer}
          />

          <InputLabel id="demo-simple-select-label">Categoria</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={category}
            label={getTitle(category)}
            onChange={handleChangeCategory}
          >
            {cat.map((item) => (
              <MenuItem key={item.key} value={item.key}>{item.name}</MenuItem>
            ))}
          </Select>

          <Button
            className='send-button'
            variant="contained"
            onClick={() => {
              let formData = {
                ask: textAsk?.current.value,
                answer: textAnswer?.current.value,
                category: String(category)
              }

              const result = sendFaq(formData)


              result.then((res) => {
                console.log("nav res", res)
                setInsertedFaq(res.createFaq.id)
                
              })

              

              //publishFaq(res.id)

            }}>ENVIAR</Button>
        </Box>

      </CustomTabPanel>
      
    </Box>
  );
}