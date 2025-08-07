import React from "react";
import Navbar from "../components/navbar";
import MyHero from "../components/hero";
import Steps from "../components/steps";
import Reasons from "../components/reasons";
import Footer from "../components/footer";
import "../App.css";

const Landing = () => {
  return (
    <>
      <Navbar />
      <MyHero />
      <Steps />
      <Reasons />
      <Footer />
    </>
  );
};

export default Landing;

// #ff6900
