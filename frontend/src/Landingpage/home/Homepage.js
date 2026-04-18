import React from 'react';
import Hero from './Hero';
import Awards from './Awards';
import Stats from './Stats';
import Pricing from './Pricing';
import Education from './Education';
import Openacc from '../Openacc';
import Footer from '../Footer';
import Navbar from '../Navbar';


function Homepage() {
    return ( <>
    <Hero/>
    <Awards/>
    <Stats/>
    <Pricing/>
    <Education/>
    <Openacc/>
    <Footer/>
    <Navbar/>
    </> );
} 

export default Homepage;