import React from "react";
import AllProducts from "../features/products/AllProducts";
import Hero from "../ui/Hero";
import FeaturedProducts from "../features/products/FeaturedProducts";

const Home = () => {
  const handleGetStarted = () => {
    console.log("Get Started clicked");
  };

  const handleWatchDemo = () => {
    console.log("Watch Demo clicked");
  };

  return (
    <>
      <Hero
        title="Transform Your Experience with Our Platform"
        subtitle="Discover endless opportunities with our intuitive platform. Start your journey today and unlock a world of possibilities."
        backgroundImage="https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        badgeText="🚀 Welcome to the Future"
        ctaButtonText="Get Started Now"
        demoButtonText="Watch Demo"
        showStats={true}
        onCtaClick={handleGetStarted}
        onDemoClick={handleWatchDemo}
      />
      <AllProducts />
      <FeaturedProducts />
    </>
  );
};

export default Home;
