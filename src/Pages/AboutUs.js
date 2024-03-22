import React from "react";
import "./about.scss";

const AboutUs = () => {
  return (
    <div>
      <div style={{ width: "176vh", float: "right" }}>
        <div className="ab-main">
          <div className="herp-section">
            <div className="hero-img">
              <div className="hero-content">
                <p>
                  "Four wheels move the body; two wheels move the soul. Life is
                  short, buy the motorcycle, have a ride, live your dreams. You
                  don't stop riding when you get old; you get old when you stop
                  riding."
                </p>
                <div className="ab-name">
                  <p>~ Aryan Dantani ~</p>
                </div>
              </div>
            </div>
          </div>
          <div className="ab-cont">
            <div className="ab-head">
              <h1>AboutUs</h1>
              <hr />
              <br />
              <h2>
                At My bike, we believe everyone should have access to mobility.
                A simple solution to the most complex challenges of the world.
              </h2>
              <br />
              <p>
                We are a bunch of millennials focused on building India’s
                largest mobility solutions provider. Our focus has led us to
                build a platform providing rentals spanning across 14 states, 43
                cities and 3 international cities. Transportation and mobility
                solutions is one of the least understood and most unorganized
                markets. We see this as an unexplored opportunity to build a
                system that can be trusted by everyone beyond barriers. We have
                no limitations when it comes to two wheelers and enjoy serving
                everything from a scooter to a superbike available on both
                website and mobile application. We are obsessed with the concept
                of ‘Why buy when you can rent’.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
