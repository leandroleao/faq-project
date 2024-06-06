"use client";

import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import data from './config.js';
import { getFaqs, sendFaq, publishFaq, deleteFaq } from './graphql/faqs/index.js';

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

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';



interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface faq {
  ask: string,
  answer: string
  category: string
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
  console.log('changeTab', index)
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function Nav() {

  const getTitle = (key: string) => {
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
  const [open, setOpen] = React.useState(false);
  const [deleteItem, setDeleteItem] = React.useState();
  const [editItem, setEditItem] = React.useState({});

  const handleChangeCategory = (event: SelectChangeEvent) => {
    setCategory(event.target.value as string);
  };

  const updateData = () => {
    const getData = getFaqs()

    getData.then((result: any) => {
      setFaqsData(result?.props.faqs);
    })
  }

  React.useEffect(() => {
    updateData()
  }, [])

  React.useEffect(() => {
    if (editItem) {
      setAsk(editItem?.ask)
      setAnswer(editItem?.answer)
    }
    
  }, [editItem])

  React.useEffect(() => {
    let data: any = {};

    cat.map((object) => {
      data[object.key] = []
    })

    faqsData.map((faq: faq) => {
      data[faq.category].push(faq)
    })

    setFaqsDataNormalized(data);

  }, [faqsData])

  React.useEffect(() => {

    if (insertedFaq) {

      const publish = publishFaq(insertedFaq)

      publish.then((res) => {
        if (res?.publishFaq?.id) {
          updateData()
          setSuccessMessage(true)
        } else {
          setErrorMessage(true)
        }

      })
    }
  }, insertedFaq)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  }

  const handleClickOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleOK = () => {
    const deleted = deleteFaq(deleteItem)  
    
    deleted.then(() => {
      updateData()
    })
    setOpen(false)
  }

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

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Desaja mesmo deletar o item?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Essa ação não poderá ser desfeita. Clique em OK para deletar o item ou cancelar para desistir.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleOK} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
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
              {val.map((item, k) => (
                <div className='faq-item' key={k}>
                    <p className='ask'>{item.ask}</p>
                    <p className='answer'>{item.answer}</p>

                  <div className="actions">
                    <Button {...changeTab(1)} onClick={() => { setEditItem(item) }}>EDITAR</Button>
                    <Button onClick={() => {handleClickOpen(); setDeleteItem(item.id)}}>DELETAR</Button>
                  </div>


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
                setInsertedFaq(res.createFaq.id)

              })



              //publishFaq(res.id)

            }}>ENVIAR</Button>
        </Box>

      </CustomTabPanel>

    </Box>
  );
}