import React from 'react'
import { useNavigate } from 'react-router-dom';
//import { useEffect } from 'react';
import { Box} from  '@mui/material'
//import Navbar from './components/Navbar'
import HomePage from '../../components/layout/HomePage';
import Acceuil from '../../components/layout/Accueil';
import Service from '../../components/layout/Service';
import Apropos from '../../components/layout/Apropos';
import Pourquoi from '../../components/layout/Pourquoi';
import Cripto from '../../components/layout/Cripto'
import Annonce from '../../components/layout/Annonce';
import Footer from '../../components/layout/Footer'




export default function Dashboard() {
  const navigate = useNavigate();
 // useEffect(() => {
   // if(localStorage.getItem("utilisateur")) {
    //  navigate("/inscription");
   // }
 // });
  return (
    <Box>
      <HomePage/>
      <Box mt={10}>
        <Acceuil />
      </Box>
      <Box mt={10}>
        <Annonce/>
      </Box>
      <Box mt={10}>
        <Service/>
      </Box>
      <Box mt={10}>
        <Apropos/>
      </Box>
      <Box mt={10}>
        <Pourquoi/>
      </Box>
      <Box mt={10}>
        <Cripto/>
      </Box>
      <Box mt={10}>
        <Footer/>
      </Box>
    </Box>
    
  )
}