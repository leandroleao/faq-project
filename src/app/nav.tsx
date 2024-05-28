"use client";

import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import data from './config.js';
import { getFaqs } from './graphql/faqs/index.js';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';



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

  const [value, setValue] = React.useState(0);
  const cat = data.categories.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));

  const [faqsData, setFaqsData] = React.useState([])
  const [faqsDataNormalized, setFaqsDataNormalized] = React.useState({})

  const getTitle = (key) => {
    let sel = cat.find((c) => { return c.key == key })
    return sel?.name
  }

  React.useEffect(() => {
    const getData = () => {
      return new Promise((resolve, reject) => {
        resolve(getFaqs())
      })
    }

    getData().then((result) => {
      setFaqsData(result.props.faqs);
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

    setFaqsDataNormalized(data);

  }, [faqsData])

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
      <CustomTabPanel value={value} index={0}>

        {Object.entries(faqsDataNormalized).map(([key, value]) => (
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={key}
              id={key}
            >
              {getTitle(key)}
            </AccordionSummary>
            <AccordionDetails>
              {value.map((item) => (
                <div>
                  <p className='ask'>{item.ask}</p>
                  <p className='answer'>{item.answer}</p>
                </div>

              ))}
            </AccordionDetails>
          </Accordion>
        ))}




      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Item Two
      </CustomTabPanel>
    </Box>
  );
}